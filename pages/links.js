import React from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import styles from '@/styles/Links.module.css';
//import Button from '@/components/Button';
import { getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';

import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  } else {
    const links = await prisma.link.findMany({
      where: {
        user: { id: session.user.id },
      },
    });
    return {
      props: { session, links: JSON.parse(JSON.stringify(links)) },
    };
  }
}

const Links = ({ links }) => {
  if (!links || links.length < 1) {
    return <div>No links</div>;
  }

  return (
    <Container className={styles.links}>
      <Row>
        <h1 className={`${orbitron.className}`}>Your Links</h1>
      </Row>
      <div className={styles.grid_container}>
        {links.map((link, index) => {
          return (
            <div
              key={link.id}
              className={`${styles.links_row} ${
                index % 2 === 0 ? styles.links_even : styles.links_odd
              }`}
            >
              <div>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.title}
                </a>
              </div>
              <div>
                <Button variant="outline-success" style={{ width: '100%' }}>
                  Edit
                </Button>
              </div>
              <div>
                <Button variant="outline-danger" style={{ width: '100%' }}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Links;
