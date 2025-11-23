import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, type FieldProps } from 'formik';
import * as Yup from 'yup';
import { createHero } from '../api/heroApi';

// Schéma de validation
const validationSchema = Yup.object({
  name: Yup.string().required('Le nom est requis'),
  univers: Yup.string().required("L'univers est requis"),
  image: Yup.mixed().required('Une image est requise'),
  biography: Yup.object({
    fullName: Yup.string(),
    placeOfBirth: Yup.string(),
  }),
  appearance: Yup.object({
    gender: Yup.string(),
    race: Yup.string(),
  }),
  work: Yup.object({
    occupation: Yup.string(),
  }),
  connections: Yup.object({
    groupAffiliation: Yup.string(),
  }),
  powerstats: Yup.object({
    intelligence: Yup.number().min(0).max(100),
    strength: Yup.number().min(0).max(100),
    speed: Yup.number().min(0).max(100),
    durability: Yup.number().min(0).max(100),
    power: Yup.number().min(0).max(100),
    combat: Yup.number().min(0).max(100),
  }),
});

// Type pour les valeurs du formulaire
interface FormValues {
  name: string;
  univers: string;
  image: File | null;
  biography: {
    fullName: string;
    placeOfBirth: string;
  };
  appearance: {
    gender: string;
    race: string;
  };
  work: {
    occupation: string;
  };
  connections: {
    groupAffiliation: string;
  };
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
}


const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <fieldset className="border border-gray-300 p-4 rounded-md">
    <legend className="text-xl font-semibold px-2">{title}</legend>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </fieldset>
);

// Champ de texte simple
const TextInput = ({ field, label }: FieldProps & { label: string }) => (
  <div>
    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      {...field}
      type="text"
      id={field.name}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

// Champ pour les stats
const StatInput = ({ field, ...props }: FieldProps) => (
  <div>
    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 capitalize">
      {field.name.split('.')[1]}
    </label>
    <Field
      {...field}
      {...props}
      type="number"
      id={field.name}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
      min="0"
      max="100"
    />
  </div>
);


const AddHero = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Valeurs initiales étendues
  const initialValues: FormValues = {
    name: '',
    univers: 'Autre',
    image: null,
    biography: {
      fullName: '',
      placeOfBirth: '',
    },
    appearance: {
      gender: 'Male',
      race: '',
    },
    work: {
      occupation: '',
    },
    connections: {
      groupAffiliation: '',
    },
    powerstats: {
      intelligence: 50,
      strength: 50,
      speed: 50,
      durability: 50,
      power: 50,
      combat: 50,
    },
  };

  const handleSubmit = async (values: FormValues) => {
    if (!values.image) {
      setServerError('Image manquante');
      return;
    }

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('univers', values.univers);
    formData.append('image', values.image);

    const bio = { ...values.biography, publisher: values.univers };
    formData.append('biography', JSON.stringify(bio));
    formData.append('powerstats', JSON.stringify(values.powerstats));
    formData.append('appearance', JSON.stringify(values.appearance));
    formData.append('work', JSON.stringify(values.work));
    formData.append('connections', JSON.stringify(values.connections));

    try {
      await createHero(formData);
      navigate('/');
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      setServerError(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Retour</Link>
      <h1 className="text-3xl font-bold mb-6">Ajouter un nouveau héros</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="bg-white p-6 rounded-lg shadow-md space-y-6">

            <FormSection title="Informations Principales">
              <div>
                <label htmlFor="name" className="block font-medium text-gray-700">Nom du Héros</label>
                <Field id="name" name="name" type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <label htmlFor="univers" className="block font-medium text-gray-700">Univers</label>
                <Field as="select" id="univers" name="univers" className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                  <option value="Autre">Autre</option>
                  <option value="Marvel">Marvel</option>
                  <option value="DC">DC</option>
                </Field>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="image" className="block font-medium text-gray-700">Image</label>
                <input
                  id="image" name="image" type="file" accept="image/*"
                  onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files ? event.currentTarget.files[0] : null);
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
              </div>
            </FormSection>

            <FormSection title="Biographie">
              <Field name="biography.fullName" label="Nom complet (civil)" component={TextInput} />
              <Field name="biography.placeOfBirth" label="Lieu de naissance" component={TextInput} />
            </FormSection>

            <FormSection title="Apparence">
              <div>
                <label htmlFor="appearance.gender" className="block font-medium text-gray-700">Genre</label>
                <Field as="select" id="appearance.gender" name="appearance.gender" className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                  <option value="Other">Autre</option>
                </Field>
              </div>
              <Field name="appearance.race" label="Race" component={TextInput} />
            </FormSection>

            <FormSection title="Travail & Connexions">
              <Field name="work.occupation" label="Occupation" component={TextInput} />
              <Field name="connections.groupAffiliation" label="Affiliation (Groupe)" component={TextInput} />
            </FormSection>

            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-xl font-semibold px-2">Statistiques de puissance</legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Field name="powerstats.intelligence" component={StatInput} />
                <Field name="powerstats.strength" component={StatInput} />
                <Field name="powerstats.speed" component={StatInput} />
                <Field name="powerstats.durability" component={StatInput} />
                <Field name="powerstats.power" component={StatInput} />
                <Field name="powerstats.combat" component={StatInput} />
              </div>
            </fieldset>

            {serverError && <div className="text-red-500 text-center">{serverError}</div>}

            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 disabled:bg-gray-400">
              {isSubmitting ? 'Envoi en cours...' : 'Ajouter le Héros'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddHero;