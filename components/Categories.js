import React, { useState } from 'react';
import Link from 'next/link';
import { Spinner } from 'react-bootstrap';
import { FaRegTrashAlt, FaRegEdit } from 'react-icons/fa';
import styles from '@/styles/Links.module.css';
import { deleteCategory } from '@/util/db';

const Categories = ({ categories, onEditCategory }) => {
  const [showManageCategoryId, setShowManageCategoryId] = useState(-1);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await deleteCategory(id);
    } catch (err) {
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

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
            <div>
              <Link href={`categories/${category.id}`}>{category.title}</Link>
            </div>
            <div>
              <Link href={`categories/${category.id}`}>
                {category.description}
              </Link>
            </div>
            <div
              className={styles.manage_link}
              style={{
                visibility: showManageCategoryId === index ? '' : 'hidden',
              }}
            >
              <div>
                <FaRegEdit
                  title="Edit"
                  className={styles.edit_item}
                  onClick={() => onEditCategory(category.id)}
                />
              </div>
              <div>
                {isDeleting ? (
                  <Spinner size="sm" className={styles.delete_item} />
                ) : (
                  <FaRegTrashAlt
                    title="Delete"
                    className={styles.delete_item}
                    onClick={() => handleDelete(category.id)}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
