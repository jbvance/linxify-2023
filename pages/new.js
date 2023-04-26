import React, { useState, Fragment } from 'react';
import { getSession } from 'next-auth/react';
import {
  Button,
  Col,
  Container,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import FormAlert from '@/components/FormAlert';
import TextInput from '@/components/forms/TextInput';
import SelectInput from '@/components/forms/Select';
import { useCategoriesByUser, createLink } from '@/util/db';
import PageLoader from '@/components/PageLoader';

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
  const {
    data: categoriesData,
    status: categoriesStatus,
    isLoading: isCategoriesLoading,
  } = useCategoriesByUser();

  console.log('STATUS', categoriesStatus, isCategoriesLoading);
  if (categoriesData) {
    console.log('DATA', categoriesData);
  }
  if (isCategoriesLoading) {
    return <PageLoader />;
  }

  return (
    <Fragment>
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
          setIsSaving(true);
          try {
            const { url, title, description, category } = values;
            await createLink({
              url,
              title,
              description,
              category,
            });
          } catch (err) {
            console.log('ERROR', err.message);
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
              <SelectInput label="Category" name="category">
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
        </Container>
      </Formik>
    </Fragment>
  );
};

export default NewLinkPage;
