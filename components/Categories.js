import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteCategory } from '@/util/db';

const Categories = ({ categories, onEditCategory }) => {
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [showManageCategoryId, setShowManageCategoryId] = useState(-1);

  return (
    <div className={styles.grid_container}>
      {categories.map((category, index) => {
        return (
          <div
            key={category.id}
            onMouseEnter={() => setShowManageCategoryId(index)}
            onMouseLeave={() => setShowManageCategoryId(-1)}
            className={`${styles.links_row} ${
              index % 2 === 0 ? styles.links_even : styles.links_odd
            }`}
          >
            <div>{category.title}</div>
            <div>{category.description}</div>
            <div
              className={styles.manage_link}
              style={{
                visibility: showManageCategoryId === index ? '' : 'hidden',
              }}
            >
              <div>
                <Button
                  variant="outline-success"
                  style={{ width: '100%' }}
                  onClick={() => onEditCategory(category.id)}
                >
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  variant="outline-danger"
                  style={{ width: '100%' }}
                  onClick={() => deleteCategory(category.id)}
                >
                  {deleteCategoryId === category.id && (
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
    </div>
  );
};

export default Categories;
