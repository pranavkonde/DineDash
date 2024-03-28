import { Formik, Form, Field, ErrorMessage } from "formik";

import "./index.css";

const Login = (props) => {
  return (
    <>
      <div className='login'>
        <button
          className='back'
          onClick={() => {
            props.l(false);
          }}
        >
          X
        </button>
        <h2>Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
          className='loginForm'
        >
          {({ isSubmitting }) => (
            <Form>
              <Field type='email' name='email' className='emailInput' />
              <ErrorMessage name='email' component='div' />
              <Field
                type='password'
                name='password'
                className='passwordInput'
              />
              <ErrorMessage name='password' component='div' />
              <button
                type='submit'
                disabled={isSubmitting}
                className='submitButton'
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div
        className='overlay'
        onClick={() => {
          props.l(false);
        }}
      ></div>
    </>
  );
};

export default Login;
