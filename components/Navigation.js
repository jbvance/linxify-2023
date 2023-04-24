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
            <Link className={styles.link} href="/links">
              Links
            </Link>
            <Link className={styles.link} href="/categories">
              Categories
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
