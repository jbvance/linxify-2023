import React, { Fragment, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteLink } from '@/util/db';
import FormAlert from './FormAlert';
import Link from './Link';
import useToast from '@/hooks/useToast';
import { createFavorite, deleteFavorite } from '@/util/db';

const Links = ({ links, favorites, onEditLink, showEditLink = true }) => {
  const [error, setError] = useState(null);
  const {
    setShowToast: setShowSuccessToast,
    setToastMessage: setToastSuccessMessage,
    ToastCustom: ToastCustomSuccess,
  } = useToast('success', 3000);

  const isFavorite = (linkId) => {
    return (
      favorites &&
      favorites.findIndex((fav) => fav.linkId === linkId || fav.id === linkId) >
        -1
    );
  };

  const toggleFavorite = (linkId) => {
    console.log('LINK ID', linkId);
    setError(null);
    if (isFavorite(linkId)) {
      deleteFavorite(linkId);
    } else {
      try {
        createFavorite(linkId);
      } catch (err) {
        setError('Unable to create favorite');
      }
    }
  };

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
              showEditLink={showEditLink}
              onEditLink={onEditLink}
              onDeleteLink={onDeleteLink}
              isFavorite={isFavorite(link.id)}
              onToggleFavorite={toggleFavorite}
            />
          );
        })}
        {error && <FormAlert type="error" message={error} />}
      </div>
    </Fragment>
  );
};

export default Links;
