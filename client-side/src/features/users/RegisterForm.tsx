import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header } from 'semantic-ui-react';
import FormInput from '../../app/common/form/FormInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

const RegisterForm = () => {
  const { userStore } = useStore();

  return (
    <Formik
      initialValues={{ displayName: '', userName: '', email: '', password: '', error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
        userName: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
      })}
    >
      {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
        <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Sign up to react and dotnet' color='teal' textAlign='center' />
          <FormInput name='displayName' placeholder='Display Name' />
          <FormInput name='userName' placeholder='Username' />
          <FormInput name='email' placeholder='Email' />
          <FormInput name='password' placeholder='Password' type='password' />
          <ErrorMessage
            name='error'
            render={() => <ValidationErrors errors={errors.error} />}
          />
          <Button
            disabled={!isValid || !dirty || isSubmitting}
            loading={isSubmitting}
            positive
            content='Register'
            type='submit'
            fluid
          />
        </Form>
      )}
    </Formik>
  );
};

export default observer(RegisterForm);
