import { observer } from 'mobx-react-lite';
import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';

const ActivityForm = () => {
  const { activityStore } = useStore();
  const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;

  const initialState = selectedActivity ?? {
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: '',
  };

  const [activity, setActivity] = useState(initialState);

  const submitHandler = () => {
    activity.id ? updateActivity(activity) : createActivity(activity)
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
          onClick={closeForm}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
