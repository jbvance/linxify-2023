import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteLink } from '@/util/db';
import FormAlert from './FormAlert';

const Links = ({ links, onEditLink }) => {
  const [deleteLinkId, setDeleteLinkId] = useState(null);
  const [error, setError] = useState(null);
  const [showManageLinkId, setShowManageLinkId] = useState(-1);

  const onDeleteLink = async (id) => {
    try {
      setError(null);
      setDeleteLinkId(id);
      await deleteLink(id);
    } catch (err) {
      setError('Error Deleting link. Please try again');
      console.log('ERROR DELETING LINK', err.message);
    } finally {
      setDeleteLinkId(null);
    }
  };
  return (
    <div className={styles.grid_container}>
      {links.map((link, index) => {
        return (
          <div
            key={link.id}
            onMouseEnter={() => setShowManageLinkId(index)}
            onMouseLeave={() => setShowManageLinkId(-1)}
            className={`${styles.links_row} ${
              index % 2 === 0 ? styles.links_even : styles.links_odd
            }`}
          >
            <div>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </div>
            <div>{link.description}</div>
            <div
              className={styles.manage_link}
              style={{
                visibility: showManageLinkId === index ? '' : 'hidden',
              }}
            >
              <div>
                <Button
                  variant="outline-success"
                  style={{ width: '100%' }}
                  onClick={() => onEditLink(link.id)}
                >
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  variant="outline-danger"
                  style={{ width: '100%' }}
                  onClick={() => onDeleteLink(link.id)}
                >
                  {deleteLinkId === link.id && (
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden={true}
                      style={{ marginRight: '10px' }}
                    ></Spinner>
                  )}
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      {error && <FormAlert type="error" message={error} />}
    </div>
  );
};

export default Links;
