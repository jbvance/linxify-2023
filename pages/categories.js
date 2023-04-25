import React, { useState } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import FormAlert from '@/components/FormAlert';
import PageLoader from '@/components/PageLoader';
import ToastMessage from '@/components/ToastMessage';
import { FaPlusCircle } from 'react-icons/fa';
import EditCategoryModal from '@/components/EditCategoryModal';
import { useCategoriesByUser } from '@/util/db';
import styles from '@/styles/Links.module.css';
import { Orbitron } from 'next/font/google';
import Categories from '@/components/Categories';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

const CategoriesPage = () => {
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(null);
  const { isLoading, isError, data, error } = useCategoriesByUser(filter);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (isLoading) {
    return <PageLoader />;
  }
  if (isError) {
    return <FormAlert type="error" message={error.message} />;
  }

  return (
    <Container className={styles.links}>
      <div style={{ position: 'absolute', top: '5%', left: '50%' }}>
        {showToast && toastMessage && (
          <ToastMessage
            bg="success"
            onClose={() => {
              setShowToast(false);
              setToastMessage(null);
            }}
            show={true}
            headerText=""
            bodyText={toastMessage}
            bodyStyle={{ color: 'white', fontSize: '2rem' }}
          />
        )}
      </div>
      <Row>
        <h1 className={`${orbitron.className}`}>Your Categories</h1>
        {
          <div className={styles.search_bar}>
            <input
              type="text"
              placeholder="Search Categories"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        }
        <div style={{ marginBottom: '20px' }}>
          <Button variant="success" onClick={() => setCreatingCategory(true)}>
            <FaPlusCircle color="white" style={{ marginRight: '10px' }} />
            Add Category
          </Button>
        </div>
        {data && data.length > 0 ? (
          <Categories
            categories={data}
            onEditCategory={(id) => setUpdatingCategoryId(id)}
          />
        ) : (
          <FormAlert type="error" message="No categories found" />
        )}
      </Row>
      {updatingCategoryId && (
        <EditCategoryModal
          id={updatingCategoryId}
          onDone={() => {
            setUpdatingCategoryId(null);
            setToastMessage('Category Updated!');
            setShowToast(true);
          }}
          onHide={() => setUpdatingCategoryId(null)}
        />
      )}

      {creatingCategory && (
        <EditCategoryModal
          onDone={() => {
            setCreatingCategory(false);
            setToastMessage('Category Created!');
            setShowToast(true);
          }}
          onHide={() => setCreatingCategory(false)}
        />
      )}
    </Container>
  );
};

export default CategoriesPage;
