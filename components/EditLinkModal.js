import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from 'react-hook-form';
import FormAlert from 'components/FormAlert';
import {
  useLink,
  createLink,
  updateLink,
  useCategoriesByUser,
} from '@/util/db';
import PageLoader from './PageLoader';
import styles from '@/styles/Modal.module.css';

const EditLinkModal = (props) => {
  const [category, setCategory] = useState('');

  // This will fetch link if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new link.
  const {
    data: linkData,
    status: linkStatus,
    isLoading: isLinksLoading,
  } = useLink(props.id);
  const {
    data: categoriesData,
    status: categoriesStatus,
    isLoading: isCategoriesLoading,
  } = useCategoriesByUser();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log('LINKDATA', linkData);
    if (linkData) {
      setCategory(linkData.categoryId);
    }
  }, [linkData]);

  const onSubmit = (data) => {
    console.log('DATA', data);
    setPending(true);
    const query = props.id ? updateLink(props.id, data) : createLink(data);

    query
      .then((response) => {
        console.log('RESPONSE', response);
        // Let parent know we're done so they can hide modal
        const newOrUpdatedLink = response;
        props.onDone();
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: 'error',
          message: error.message,
        });
      });
  };
  //console.log('CATS', categoriesData, isCategoriesLoading);
  if (isLinksLoading || isCategoriesLoading) {
    return <PageLoader />;
  }

  console.log('CATEGORIES', categoriesData);
  // If we are updating an existing link
  // don't show modal until link data is fetched.
  if (props.id && linkStatus !== 'success') {
    return null;
  }

  return (
    <Modal show={true} centered={true} animation={false} onHide={props.onHide}>
      <Modal.Header closeButton={true} className={styles.ModalHeader}>
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}Link
      </Modal.Header>
      <Modal.Body>
        {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formName">
            <div className={styles.ModalInput}>
              <input
                placeholder="Title"
                defaultValue={linkData && linkData.title}
                {...register('title', { required: true })}
              />
              {errors.title && (
                <p className={styles.ModalInputError}>*Title is required.</p>
              )}
            </div>
            <div className={styles.ModalInput}>
              <input
                placeholder="Website Address (URL)"
                defaultValue={linkData && linkData.url}
                {...register('url', { required: true })}
              />
              {errors.url && (
                <p className={styles.ModalInputError}>*URL is required.</p>
              )}
            </div>
            <div className={styles.ModalInput}>
              <input
                placeholder="Description (optional)"
                defaultValue={linkData && linkData.description}
                {...register('description')}
              />
            </div>
            <div>
              <select
                defaultValue={linkData && linkData.categoryId}
                onChange={(e) => setCategory(e.target.value)}
                {...register('category')}
              >
                <option value="">Open this select menu</option>
                {categoriesData.map((cat) => {
                  return (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  );
                })}
              </select>
            </div>
          </Form.Group>
          <Button size="lg" variant="primary" type="submit" disabled={pending}>
            <span>Save </span>
            {pending && (
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden={true}
                className="ml-2"
              ></Spinner>
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditLinkModal;
