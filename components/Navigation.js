import { useRouter } from 'next/router';
import { useSession, signOut, signIn } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import styles from '@/styles/Navigation.module.css';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

const Navigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log('PATH', router.pathname);
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand
          href="/"
          className={`${orbitron.className}`}
          style={{ color: 'var(--primary-green' }}
        >
          Linxify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link
              className={`${styles.link} ${
                router.pathname == '/links' ? styles.active_link : ''
              }`}
              href="/links"
            >
              Links
            </Link>
            <Link
              className={`${styles.link} ${
                router.pathname == '/categories' ? styles.active_link : ''
              }`}
              href="/categories"
            >
              Categories
            </Link>
          </Nav>
          <Nav>
            {status === 'authenticated' ? (
              <Button variant="success" onClick={signOut}>
                Logout
              </Button>
            ) : (
              <Button variant="success">Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
