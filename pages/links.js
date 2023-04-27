import React, { useEffect, useState, useMemo } from 'react';
import { Container, Row, Col, Button, Spinner, Toast } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
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
import { getLinksByUser } from '@/util/db';
import useToast from '@/hooks/useToast';

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

function useLinks(filter) {
  return useQuery(
    ['links', { filter }],
    () => getLinksByUser(filter)
    // the following can be used to avoid refetches on already fetched data (see paginated queries docs)
    // { keepPreviousData: true, staleTime: 5 * 60 * 1000 }
  );
}

const LinksPage = () => {
  const [updatingLinkId, setUpdatingLinkId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingLink, setCreatingLink] = useState(null);
  //const [showToast, setShowToast] = useState(false);
  //const [toastMessage, setToastMessage] = useState(null);
  const debouncedSearch = useDebounce(filter, 800);
  const { isLoading, isError, data, error, refetch } =
    useLinks(debouncedSearch);
  const { setShowToast, setToastMessage, showToast, ToastCustom } = useToast();

  useEffect(() => {
    console.log('SHOW TOAST', showToast);
  }, [showToast]);

  const handleSearch = (e) => setFilter(e.target.value);
  if (isError) {
    return <FormAlert type="error" message={error.message} />;
  }
  return (
    <Container className={styles.links}>
      <ToastCustom />
      <div style={{ position: 'absolute', top: '5%', left: '50%' }}></div>
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
