import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Container, Row, Col, Button, Spinner, Toast } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
import { getSession } from 'next-auth/react';
import Links from '@/components/Links';
import FormAlert from '@/components/FormAlert';
import EditLinkModal from '@/components/EditLinkModal';
import PageLoader from '@/components/PageLoader';
import { useLinksByCategory } from '@/util/db';
import useToast from '@/hooks/useToast';

import { orbitron } from '@/util/util';

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

const CategoryLinksPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [updatingLinkId, setUpdatingLinkId] = useState(null);
  const [filter, setFilter] = useState('');
  const [creatingLink, setCreatingLink] = useState(null);
  //const [showToast, setShowToast] = useState(false);
  //const [toastMessage, setToastMessage] = useState(null);
  const { isLoading, isFetching, isError, data, error } =
    useLinksByCategory(id);
  const { setShowToast, setToastMessage, showToast, ToastCustom } = useToast();

  useEffect(() => {
    console.log('SHOW TOAST', showToast);
  }, [showToast]);

  if (isError) {
    return (
      <FormAlert
        type="error"
        message={`Unable to retrieve data - ${error.message}`}
      />
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Container className={styles.links}>
      <ToastCustom />
      <div style={{ position: 'absolute', top: '5%', left: '50%' }}></div>
      <Row>
        <h1 className={`${orbitron.className}`}>Category - {data.title}</h1>
        {isLoading ? (
          <PageLoader />
        ) : data && data.links && data.links.length > 0 ? (
          <Links
            links={data.links}
            onEditLink={(id) => setUpdatingLinkId(id)}
          />
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

export default CategoryLinksPage;
