import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { deleteCategory } from '@/util/db';

const Categories = ({ categories, onEditCategory }) => {
  return (
    <div className={styles.grid_container}>
      {categories.map((category, index) => {
        return (
          <div
            key={category.id}
            className={`${styles.links_row} ${
              index % 2 === 0 ? styles.links_even : styles.links_odd
            }`}
          >
            <div>{category.title}</div>
            <div>{category.description}</div>
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
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
