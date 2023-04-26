import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaRegTrashAlt } from 'react-icons/fa';
import styles from '@/styles/Links.module.css';
import { deleteLink } from '@/util/db';
import FormAlert from './FormAlert';
import Link from './Link';

const Links = ({ links, onEditLink }) => {
  const [error, setError] = useState(null);

  const onDeleteLink = async (id) => {
    try {
      setError(null);
      await deleteLink(id);
    } catch (err) {
      setError('Error Deleting link. Please try again');
      console.log('ERROR DELETING LINK', err.message);
    }
  };
  return (
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
  );
};

export default Links;
