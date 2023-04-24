import React, { useState } from 'react';
import { Container, Row, Col, Button, Spinner, Toast } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
//import Button from '@/components/Button';
import { getSession } from 'next-auth/react';
import Links from '@/components/Links';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FaPlusCircle } from 'react-icons/fa';
import FormAlert from '@/components/FormAlert';
import EditLinkModal from '@/components/EditLinkModal';
import { useLinksByUser } from '@/util/db';
import ToastMessage from '@/components/ToastMessage';

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
  }
}

const LinksPage = () => {
  const [updatingLinkId, setUpdatingLinkId] = useState(null);
  const [creatingLink, setCreatingLink] = useState(null);
  const { isLoading, isError, data, error } = useLinksByUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (isLoading) {
    return <Spinner animation="border" variant="success" />;
  }
  if (isError) {
    return <FormAlert type="error" message={error.message} />;
  }

  if (!data || data.length < 1) {
    return <div>No Links</div>;
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
        <div style={{ marginBottom: '20px' }}>
          <Button variant="success" onClick={() => setCreatingLink(true)}>
            <FaPlusCircle color="white" style={{ marginRight: '10px' }} />
            Add Link
          </Button>
        </div>
        <Links links={data} onEditLink={(id) => setUpdatingLinkId(id)} />
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
        <EditLinkModal
          onDone={() => {
            setCreatingLink(false);
            setToastMessage('Link Created!');
            setShowToast(true);
          }}
          onHide={() => setCreatingLink(false)}
        />
      )}
    </Container>
  );
};

export default LinksPage;
