import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext'; 

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Nom d\'utilisateur requis'),
  password: Yup.string().required('Mot de passe requis'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      setServerError('');
      const { token, user } = await loginUser(values);

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      login(token, user);
      navigate('/');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setServerError(error.response?.data?.message || 'Identifiants invalides');
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-sm mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Connexion</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md space-y-4">
            
            <div>
              <label htmlFor="username" className="block font-medium text-gray-700">Nom d'utilisateur</label>
              <Field
                id="username"
                name="username"
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-gray-700">Mot de passe</label>
              <Field
                id="password"
                name="password"
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {serverError && (
              <div className="text-red-500 text-center text-sm">{serverError}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>

            <p className="text-sm text-center mt-4">
              Pas de compte ? <Link to="/register" className="text-blue-500 hover:underline">Inscrivez-vous</Link>
            </p>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;