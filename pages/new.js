import React, { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import {
  Button,
  Col,
  Container,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { Formik, Form, useField } from 'formik';
import { FaPlusCircle } from 'react-icons/fa';
import * as Yup from 'yup';
import FormAlert from '@/components/FormAlert';
import TextInput from '@/components/forms/TextInput';
import SelectInput from '@/components/forms/Select';
import { useCategoriesByUser, createLink } from '@/util/db';
import PageLoader from '@/components/PageLoader';
import useToast from '@/hooks/useToast';
import EditCategoryModal from '@/components/EditCategoryModal';

export async function getServerSideProps(context) {
  console.log(context.query);
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      link: context.query.link || null,
    },
  };
}

const NewLinkPage = ({ link }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(null);
  const [error, setError] = useState(undefined);
  const router = useRouter();
  const {
    data: categoriesData,
    status: categoriesStatus,
    isLoading: isCategoriesLoading,
  } = useCategoriesByUser();

  const {
    setShowToast: setShowSuccessToast,
    setToastMessage: setToastSuccessMessage,
    ToastCustom: ToastCustomSuccess,
  } = useToast('success', 3000);

  if (isCategoriesLoading) {
    return <PageLoader />;
  }

  return (
    <Fragment>
      <ToastCustomSuccess />
      <h1 style={{ textAlign: 'center', color: 'var(--primary-green)' }}>
        Enter Link Information
      </h1>
      <Formik
        initialValues={{
          url: link,
          title: '',
          description: '',
          category: '',
        }}
        validationSchema={Yup.object({
          url: Yup.string().required('Please enter website'),
          title: Yup.string().required('Required'),
          description: Yup.string(),
          category: Yup.string(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setError('');
          setIsSaving(true);
          try {
            const { url, title, description, category } = values;
            await createLink({
              url,
              title,
              description,
              category,
            });
            setToastSuccessMessage('Link successfully created!');
            setShowSuccessToast(true);
            setTimeout(() => {
              router.push('/links');
            }, 2000);
          } catch (err) {
            console.log('ERROR', err.message);
            setError(
              'Sorry, there was an error saving your link. Please try again.'
            );
          } finally {
            setIsSaving(false);
          }
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 400);
        }}
      >
        <Container>
          <Form>
            <Row className="mb-3">
              <TextInput
                label="Title"
                name="title"
                type="text"
                placeholder="Enter a title"
              />
            </Row>

            <Row className="mb-3">
              <TextInput
                label="URL (Website Address)"
                name="url"
                type="text"
                placeholder="Enter a title"
              />
            </Row>

            <Row className="mb-3">
              <TextInput
                label="Description"
                name="description"
                type="text"
                placeholder="Enter a description"
              />
            </Row>

            <Row className="mb-3">
              <SelectInput
                label={
                  <>
                    <span>Category </span>
                    <span
                      style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                      onClick={() => setCreatingCategory(true)}
                    >
                      <FaPlusCircle
                        color="var(--primary-green)"
                        style={{
                          marginLeft: '10px',
                          marginRight: '5px',
                        }}
                      />
                      Create new Category
                    </span>
                  </>
                }
                name="category"
              >
                <option value="">None</option>
                {categoriesData &&
                  categoriesData.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    );
                  })}
              </SelectInput>
            </Row>

            <Row>
              <Button
                style={{ maxWidth: '150px' }}
                type="submit"
                variant="success"
                disabled={isSaving}
              >
                <span>Save</span>
                {isSaving && (
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden={true}
                    style={{ marginLeft: '10px' }}
                  ></Spinner>
                )}
              </Button>
            </Row>
          </Form>
          {error && (
            <Row style={{ marginTop: '20px' }}>
              <FormAlert type="error" message={error} />
            </Row>
          )}
          {creatingCategory && (
            <EditCategoryModal
              onDone={() => {
                setCreatingCategory(false);
                setToastSuccessMessage('Category Created!');
                setShowSuccessToast(true);
              }}
              onHide={() => setCreatingCategory(false)}
            />
          )}
        </Container>
      </Formik>
    </Fragment>
  );
};

export default NewLinkPage;
