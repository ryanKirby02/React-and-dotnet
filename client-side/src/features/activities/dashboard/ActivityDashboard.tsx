import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid, GridColumn } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, loadingInitial } = activityStore;

  useEffect(() => {
    if(activityRegistry.size <= 1) loadActivities();
  }, [activityRegistry, loadActivities]);

  if (loadingInitial) return <Loading content='loading app...' />;

  return (
    <Grid>
      <GridColumn width='10'>
        <ActivityList />
      </GridColumn>
      <GridColumn width='6'>
        <ActivityFilters />
      </GridColumn>
    </Grid>
  );
};

export default observer(ActivityDashboard);
