import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Button, Spinner, Toast } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { getSession } from 'next-auth/react';
import Links from '@/components/Links';
import { FaPlusCircle } from 'react-icons/fa';
import FormAlert from '@/components/FormAlert';
import EditLinkModal from '@/components/EditLinkModal';
import { useLinksByUser } from '@/util/db';
import ToastMessage from '@/components/ToastMessage';
import PageLoader from '@/components/PageLoader';
import useDebounce from '@/hooks/useDebounce';

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

const LinksPage = () => {
  const [updatingLinkId, setUpdatingLinkId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingLink, setCreatingLink] = useState(null);
  const { isLoading, isError, data, error, refetch } = useLinksByUser(filter);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // DeBounce Function
  useDebounce(
    () => {
      refetch();
    },
    [filter],
    800
  );

  const handleSearch = (e) => setFilter(e.target.value);

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
        <h1 className={`${orbitron.className}`}>Your Links</h1>
        <div className={styles.search_bar}>
          <input
            type="text"
            placeholder="Search for Links"
            value={filter}
            onChange={handleSearch}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <Button variant="success" onClick={() => setCreatingLink(true)}>
            <FaPlusCircle color="white" style={{ marginRight: '10px' }} />
            Add Link
          </Button>
        </div>
        {isLoading ? (
          <PageLoader />
        ) : data && data.length > 0 ? (
          <Links links={data} onEditLink={(id) => setUpdatingLinkId(id)} />
        ) : (
          <FormAlert type="error" message="No links found" />
        )}
      </Row>
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
