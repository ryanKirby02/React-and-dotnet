import { useEffect } from 'react';

//semantic ui
import { Container } from 'semantic-ui-react';

//components
import Nav from './Nav';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import Loading from './Loading';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

const App = () => {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <Loading content='loading app...' />;

  return (
    <>
      <Nav />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default observer(App);
