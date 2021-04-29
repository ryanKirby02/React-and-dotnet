import { observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, Form, Segment } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';

const ActivityForm = () => {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [activity, setActivity] = useState({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: '',
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  const submitHandler = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const inputChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setActivity({
      ...activity,
      [name]: value,
    });
  };

  if (loadingInitial) return <Loading content='Loading Activity...' />;

  return (
    <Segment clearing>
      <Form onSubmit={submitHandler} autoComplete='off'>
        <Form.Input
          placeholder='Title'
          onChange={inputChangeHandler}
          value={activity.title}
          name='title'
        />
        <Form.TextArea
          placeholder='Deescription'
          onChange={inputChangeHandler}
          value={activity.description}
          name='description'
        />
        <Form.Input
          placeholder='Category'
          onChange={inputChangeHandler}
          value={activity.category}
          name='category'
        />
        <Form.Input
          placeholder='Date'
          type='date'
          onChange={inputChangeHandler}
          value={activity.date}
          name='date'
        />
        <Form.Input
          placeholder='City'
          onChange={inputChangeHandler}
          value={activity.city}
          name='city'
        />
        <Form.Input
          placeholder='Venue'
          onChange={inputChangeHandler}
          value={activity.venue}
          name='venue'
        />
        <Button
          floated='right'
          positive
          type='submit'
          content='Submit'
          loading={loading}
        />
        <Button
          as={Link}
          to='/activities'
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
