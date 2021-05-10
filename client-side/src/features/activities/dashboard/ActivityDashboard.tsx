import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, loadingInitial, setPagingParams, pagination } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const getNextHandler = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [activityRegistry, loadActivities]);

  return (
    <Grid>
      <GridColumn width='10'>
        {loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={getNextHandler}
            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </GridColumn>
      <GridColumn width='6'>
        <ActivityFilters />
      </GridColumn>
      <Grid.Column width={10} style={{ margin: '30px' }}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
