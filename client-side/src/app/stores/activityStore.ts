import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity, ActivityFormValues } from '../models/activity';
import { format } from 'date-fns';
import { store } from './store';
import { Profile } from '../models/profile';
import { Pagination, PagingParams } from '../models/pagination';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  type = new Map().set('all', true);

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.type.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activityRegistry.clear();
        this.loadActivities();
      }
    )
  }

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setType = (type: string, value: string | Date) => {
    const resetType = () => {
      this.type.forEach((value, key) => {
        if(key !== 'startDate') this.type.delete(key);
      })
    }
    switch (type) {
      case 'all':
        resetType();
        this.type.set('all', true)
        break;
      case 'isGoing':
        resetType();
        this.type.set('isGoing', true)
        break
      case 'isHost':
        resetType();
        this.type.set('isHost', true)
        break
      case 'startDate':
        this.type.delete('startDate');
        this.type.set('startDate', value);
        break
      default:
        break;
    }
  }

  get axiosParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    this.type.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value)
      }
    });
    return params;
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  private getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees!.some((a) => a.username === user.username);
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find((x) => x.username === activity.hostUsername);
    }
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  };

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const result = await agent.Activities.list(this.axiosParams);
      runInAction(() => {
        result.data.forEach((activity) => {
          this.setActivity(activity);
        });
        this.setPagination(result.pagination);
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else this.loadingInitial = true;
    try {
      activity = await agent.Activities.details(id);
      this.setActivity(activity);
      runInAction(() => {
        this.selectedActivity = activity;
        this.loadingInitial = false;
      });
      return activity;
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user!.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = { ...this.getActivity(activity.id), ...activity };
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            (a) => a.username !== user?.username
          );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach((activity) => {
      activity.attendees.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
