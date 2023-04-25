import React, { Fragment } from 'react';
import { Button, Col, Container, InputGroup, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import FormAlert from '@/components/FormAlert';
import TextInput from '@/components/forms/TextInput';
import SelectInput from '@/components/forms/Select';
import { useCategoriesByUser } from '@/util/db';
import PageLoader from '@/components/PageLoader';

export async function getServerSideProps(context) {
  console.log(context.query);
  return {
    props: {
      link: context.query.link || null,
    },
  };
}

const NewLinkPage = ({ link }) => {
  console.log('LINK', link);
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

  if (!link) {
    return (
      <FormAlert
        type="error"
        message="No 'link' was provided. Please look at the address bar and make sure you have provided
    the correct format. The address should contain 'new?link=' followed by the name website address you would like to bookmark."
      />
    );
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
          url: Yup.string().required('Required'),
          title: Yup.string().required('Required'),
          description: Yup.string(),
          category: Yup.string(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
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
              <Button type="submit" variant="success">
                Save
              </Button>
            </Row>
          </Form>
        </Container>
      </Formik>
    </Fragment>
  );
};

export default NewLinkPage;
