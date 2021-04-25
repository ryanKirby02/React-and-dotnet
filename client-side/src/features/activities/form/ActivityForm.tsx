import { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
  activity: Activity | undefined;
  closeForm: () => void;
  createOrEdit: (activity: Activity) => void;
}

const ActivityForm = ({
  activity: selectedActivity,
  closeForm,
  createOrEdit,
}: Props) => {
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
    createOrEdit(activity)
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
        <Button floated='right' positive type='submit' content='Submit' />
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

export default ActivityForm;
