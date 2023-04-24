import React from 'react';
import { Container, Row, Button, Spinner } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
//import Button from '@/components/Button';
import { getSession } from 'next-auth/react';
import Links from '@/components/Links';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import FormAlert from '@/components/FormAlert';

import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

// export async function getServerSideProps(context) {
//   const session = await getSession({ req: context.req });
//   if (!session) {
//     console.log('NO SESSION');
//     return {
//       redirect: {
//         destination: '/api/auth/signin',
//         permanent: false,
//       },
//     };
//   } else {
//     const links = await prisma.link.findMany({
//       where: {
//         user: { id: session.user.id },
//       },
//     });
//     return {
//       props: { session, links: JSON.parse(JSON.stringify(links)) },
//     };
//   }
// }

const LinksPage = () => {
  const { isLoading, isError, data, error } = useQuery(['links'], fetchLinks);
  async function fetchLinks() {
    let data;
    try {
      const response = await axios.get('/api/links');
      console.log('RESPONSE', response);
      if (response.data && response.data.data) {
        data = response.data.data;
      }
    } catch (err) {
      console.log('ERROR', err);
    } finally {
      return data;
    }
  }

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
      <Row>
        <h1 className={`${orbitron.className}`}>Your Links</h1>
        <Links links={data} />
      </Row>
    </Container>
  );
};

export default LinksPage;
