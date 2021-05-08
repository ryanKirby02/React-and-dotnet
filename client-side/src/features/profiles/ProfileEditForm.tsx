import { Form, Formik } from 'formik';
import { Button, Header, Segment } from 'semantic-ui-react';
import FormInput from '../../app/common/form/FormInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import FormTextArea from '../../app/common/form/FormTextArea';
import { observer } from 'mobx-react-lite';

interface Props {
  setEditMode: (editMode: boolean) => void;
}

const ProfileEditForm = ({ setEditMode }: Props) => {
  const { profileStore: {profile, updateProfile} } = useStore();

  const validationSchema = Yup.object({
    displayName: Yup.string().required('A display name is required'),
  });

  return (
    <Segment clearing>
      <Header content='Update Profile' sub color='teal' />
      <Formik
        initialValues={{displayName: profile?.displayName, bio: profile?.bio}}
        onSubmit={(values) => updateProfile(values).then(() => setEditMode(false))}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {({isValid, isSubmitting, dirty }) => (
          <Form className='ui form' autoComplete='off'>
            <FormInput name='displayName' placeholder='Display Name' />
            <FormTextArea name='bio' placeholder='Bio' rows={3} />
            <Button
              disabled={!dirty || !isValid}
              floated='right'
              positive
              type='submit'
              content='Update Profile'
              loading={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ProfileEditForm);
