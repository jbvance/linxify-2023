import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteLink } from '@/util/db';

const Links = ({ links, onEditLink }) => {
  return (
    <div className={styles.grid_container}>
      {links.map((link, index) => {
        return (
          <div
            key={link.id}
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
                onClick={() => deleteLink(link.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Links;
