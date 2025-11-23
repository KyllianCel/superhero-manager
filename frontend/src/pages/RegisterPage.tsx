import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../api/authApi';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Trop court !').required('Nom d\'utilisateur requis'),
  password: Yup.string().min(4, 'Trop court !').required('Mot de passe requis'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      setServerError('');
      setSuccessMessage('');

      const credentials = { ...values };
      
      await registerUser(credentials);

      setSuccessMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      
      // Redirige vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      setServerError(error.response?.data?.message || 'Une erreur est survenue');
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-sm mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Inscription</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
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
            {successMessage && (
              <div className="text-green-500 text-center text-sm">{successMessage}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Création...' : 'S\'inscrire'}
            </button>

            <p className="text-sm text-center">
              Déjà un compte ? <Link to="/login" className="text-blue-500 hover:underline">Connectez-vous</Link>
            </p>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterPage;