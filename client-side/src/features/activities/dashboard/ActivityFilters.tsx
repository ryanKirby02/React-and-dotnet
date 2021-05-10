import { observer } from 'mobx-react-lite';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

const ActivityFilters = () => {
  const {
    activityStore: { type, setType },
  } = useStore();

  return (
    <>
      <Menu vertical size='large' style={{ width: '100%', marginTop: 26 }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item content='All Activities' active={type.has('all')} onClick={() => setType('all', 'true')} />
        <Menu.Item content="I'm Going" active={type.has('isGoing')} onClick={() => setType('isGoing', 'true')} />
        <Menu.Item content="I'm Hosting" active={type.has('isHost')} onClick={() => setType('isHost', 'true')} />
      </Menu>
      <Header />
      <Calendar onChange={(date) => setType('startDate', date as Date)} value={type.get('startDate') || new Date()} />
    </>
  );
};

export default observer(ActivityFilters);
