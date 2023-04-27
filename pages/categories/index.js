import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { Container, Row, Button } from 'react-bootstrap';
import FormAlert from '@/components/FormAlert';
import PageLoader from '@/components/PageLoader';
import { FaPlusCircle } from 'react-icons/fa';
import EditCategoryModal from '@/components/EditCategoryModal';
import { useCategoriesByUser } from '@/util/db';
import styles from '@/styles/Links.module.css';
import { Orbitron } from 'next/font/google';
import Categories from '@/components/Categories';
import useToast from '@/hooks/useToast';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    console.log('NO SESSION');
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  } else {
    return {
      props: { session },
    };
  }
}

const CategoriesPage = () => {
  const [updatingCategoryId, setUpdatingCategoryId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(null);
  const { isLoading, isError, data, error } = useCategoriesByUser(filter);
  const {
    setShowToast: setShowSuccessToast,
    setToastMessage: setToastSuccessMessage,
    ToastCustom: ToastCustomSuccess,
  } = useToast('success', 3000);

  if (isLoading) {
    return <PageLoader />;
  }
  if (isError) {
    return <FormAlert type="error" message={error.message} />;
  }

  return (
    <Container className={styles.links}>
      <ToastCustomSuccess />
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
            setToastSuccessMessage('Category Updated!');
            setShowSuccessToast(true);
          }}
          onHide={() => setUpdatingCategoryId(null)}
        />
      )}

      {creatingCategory && (
        <EditCategoryModal
          onDone={() => {
            setCreatingCategory(false);
            setToastSuccessMessage('Category Created!');
            setShowSuccessToast(true);
          }}
          onHide={() => setCreatingCategory(false)}
        />
      )}
    </Container>
  );
};

export default CategoriesPage;
