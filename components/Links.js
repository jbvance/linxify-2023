import React, { Fragment, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteLink } from '@/util/db';
import FormAlert from './FormAlert';
import Link from './Link';
import useToast from '@/hooks/useToast';

const Links = ({ links, onEditLink }) => {
  const [error, setError] = useState(null);
  const {
    setShowToast: setShowSuccessToast,
    setToastMessage: setToastSuccessMessage,
    ToastCustom: ToastCustomSuccess,
  } = useToast('success', 3000);

  const onDeleteLink = async (id) => {
    try {
      setError(null);
      await deleteLink(id);
      setToastSuccessMessage('Link successfully deleted');
      setShowSuccessToast(true);
    } catch (err) {
      setError('Error Deleting link. Please try again');
      console.log('ERROR DELETING LINK', err.message);
    }
  };
  return (
    <Fragment>
      <ToastCustomSuccess />
      <div className={styles.grid_container}>
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              index={index}
              link={link}
              onEditLink={onEditLink}
              onDeleteLink={onDeleteLink}
            />
          );
        })}
        {error && <FormAlert type="error" message={error} />}
      </div>
    </Fragment>
  );
};

export default Links;
