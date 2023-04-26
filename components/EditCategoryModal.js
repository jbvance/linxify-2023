import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from 'react-hook-form';
import FormAlert from 'components/FormAlert';
import {
  useCategory,
  updateCategory,
  createCategory,
  deleteCategory,
} from '@/util/db';
import styles from '@/styles/Modal.module.css';

const EditCategoryModal = (props) => {
  // This will fetch individual recordif props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new record.
  const { data, status } = useCategory(props.id);
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setPending(true);
    const query = props.id
      ? updateCategory(props.id, data)
      : createCategory(data);

    query
      .then((response) => {
        console.log('RESPONSE', response);
        // Let parent know we're done so they can hide modal
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

  console.log('ERRORS', errors);
  // If we are updating an existing record
  // don't show modal until data is fetched.
  if (props.id && status !== 'success') {
    return null;
  }

  return (
    <Modal show={true} centered={true} animation={false} onHide={props.onHide}>
      <Modal.Header closeButton={true} className={styles.ModalHeader}>
        {props.id && <>Update</>}
        {!props.id && <>Create</>}
        {` `}Category
      </Modal.Header>
      <Modal.Body>
        {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formName">
            <div className={styles.ModalInput}>
              <label htmlFor="title" className={styles.ModalLabel}>
                Title
              </label>
              <input
                placeholder="Title"
                defaultValue={data && data.title}
                {...register('title', { required: true })}
              />
              {errors.title && (
                <p className={styles.ModalInputError}>*Title is required.</p>
              )}
            </div>
            <div className={styles.ModalInput}>
              <label htmlFor="description" className={styles.ModalLabel}>
                Description
              </label>
              <input
                placeholder="Description"
                defaultValue={data && data.description}
                {...register('description', { required: true })}
              />
              {errors.description && (
                <p className={styles.ModalInputError}>
                  *Description is required.
                </p>
              )}
            </div>
          </Form.Group>
          <Button
            size="md"
            className={styles.ModalButton}
            type="submit"
            disabled={pending}
          >
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

export default EditCategoryModal;
