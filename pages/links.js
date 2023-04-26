import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Pagination,
  Spinner,
  Toast,
} from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { getSession } from 'next-auth/react';
import Links from '@/components/Links';
import { FaPlusCircle } from 'react-icons/fa';
import FormAlert from '@/components/FormAlert';
import EditLinkModal from '@/components/EditLinkModal';
import { useLinksByUser, useLinkCountByUser } from '@/util/db';
import ToastMessage from '@/components/ToastMessage';
import PageLoader from '@/components/PageLoader';

import { Orbitron } from 'next/font/google';

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

const LinksPage = ({ session }) => {
  const [page, setPage] = useState(1);
  const [updatingLinkId, setUpdatingLinkId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingLink, setCreatingLink] = useState(null);
  const {
    isLoading,
    isFetching,
    isError,
    isPreviousData,
    data,
    error,
    refetch,
  } = useLinksByUser(filter, page);
  const { isLoading: isCountLoading, data: linkCountData } = useLinkCountByUser(
    session.user.id
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const createPaginationItems = () => {
    const numPages = Math.ceil(linkCountData / 5);
    let items = [];
    for (let i = 1; i <= numPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={async () => {
            setPage(i);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  if (isLoading || isCountLoading) {
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
      <div>
        <h1 className={`${orbitron.className}`}>Your Links</h1>
        <div className={styles.search_bar}>
          <input
            type="text"
            placeholder="Search for Links"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Button variant="success" onClick={() => setCreatingLink(true)}>
            <FaPlusCircle color="white" style={{ marginRight: '10px' }} />
            Add Link
          </Button>
        </div>
        {isFetching ? (
          <PageLoader />
        ) : data && data.length > 0 ? (
          <Links links={data} onEditLink={(id) => setUpdatingLinkId(id)} />
        ) : (
          <FormAlert type="error" message="No links found" />
        )}
      </div>
      <div>
        <Pagination className={styles.pagination1}>
          {createPaginationItems()}
        </Pagination>
      </div>
      {updatingLinkId && (
        <EditLinkModal
          id={updatingLinkId}
          onDone={() => {
            setUpdatingLinkId(null);
            setToastMessage('Link Updated!');
            setShowToast(true);
          }}
          onHide={() => setUpdatingLinkId(null)}
        />
      )}

      {creatingLink && (
        <>
          <EditLinkModal
            onDone={() => {
              setCreatingLink(false);
              setToastMessage('Link Created!');
              setShowToast(true);
            }}
            onHide={() => setCreatingLink(false)}
          />
        </>
      )}
    </Container>
  );
};

export default LinksPage;
