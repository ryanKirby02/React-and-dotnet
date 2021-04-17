import { useState, useEffect } from 'react';

import axios from 'axios';

//semantic ui
import { Header, List } from 'semantic-ui-react';

const App = () => {
  //states
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then((response) => {
      console.log(response);
      setActivities(response.data);
    });
  }, []);

  return (
    <div className='App'>
      <Header as='h2' icon='users' content='React and DotNet' />
        <List>
          {activities.map((activity: any) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
    </div>
  );
};

export default App;
