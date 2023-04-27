import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa';

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
      <div>
        <a href={link.url} target="_blank" rel="noopener noreferrer">
          {link.description}
        </a>
      </div>
      <div
        className={styles.manage_link}
        style={{
          visibility: showManageLinkId === index ? '' : 'hidden',
        }}
      >
        <div className={styles.manage_link_item}>
          <FaRegEdit
            title="Edit"
            className={styles.edit_item}
            onClick={() => onEditLink(link.id)}
          />
        </div>
        <div className={styles.manage_link_item}>
          {isDeleting ? (
            <Spinner size="sm" className={styles.delete_item} />
          ) : (
            <FaRegTrashAlt
              title="Delete"
              className={styles.delete_item}
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Link;
