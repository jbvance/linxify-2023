import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';

const Link = ({ link, onEditLink, onDeleteLink, index }) => {
  const [showManageLinkId, setShowManageLinkId] = useState(-1);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    console.log('DELETING');
    try {
      setIsDeleting(true);
      await onDeleteLink(link.id);
    } catch (e) {
      throw e;
    } finally {
      setIsDeleting(false);
    }
  };
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
            size="sm"
            variant="outline-success"
            style={{ width: '100%' }}
            onClick={() => onEditLink(link.id)}
          >
            Edit
          </Button>
        </div>
        <div>
          <Button
            size="sm"
            variant="outline-danger"
            style={{ width: '100%' }}
            onClick={handleDelete}
          >
            {isDeleting && (
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
};

export default Link;
