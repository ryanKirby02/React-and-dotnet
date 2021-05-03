import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, Header, Segment } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormInput from '../../../app/common/form/FormInput';
import FormTextArea from '../../../app/common/form/FormTextArea';
import FormSelectInput from '../../../app/common/form/FormSelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import FormDateInput from '../../../app/common/form/FormDateInput';
import { ActivityFormValues } from '../../../app/models/activity';

const ActivityForm = () => {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required('The Activity Title Is Required'),
    description: Yup.string().required('The Activity Description Is Required'),
    category: Yup.string().required(),
    date: Yup.string().required('A Date Is Required').nullable(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(new ActivityFormValues(activity)));
  }, [id, loadActivity]);

  const submitFormHandler = (activity: ActivityFormValues) => {
    if (!activity.id) {
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


  if (loadingInitial) return <Loading content='Loading Activity...' />;

  return (
    <Segment clearing>
      <Header content='Activity Details' sub color='teal' />
      <Formik
        initialValues={activity}
        onSubmit={(values) => submitFormHandler(values)}
        enableReinitialize
        validationSchema={validationSchema}>
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <FormInput name='title' placeholder='Title' />
            <FormTextArea rows={3} placeholder='Description' name='description' />
            <FormSelectInput options={categoryOptions} placeholder='Category' name='category' />
            <FormDateInput placeholderText='Date' name='date' showTimeSelect timeCaption='Time' dateFormat='MMMM d, yyyy h:mm aa' />
            <Header content='Location Details' sub color='teal' />
            <FormInput placeholder='City' name='city' />
            <FormInput placeholder='Venue' name='venue' />
            <Button
            disabled={isSubmitting || !dirty || !isValid}
              floated='right'
              positive
              type='submit'
              content='Submit'
              loading={isSubmitting}
            />
            <Button
              as={Link}
              to='/activities'
              floated='right'
              type='button'
              content='Cancel'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
