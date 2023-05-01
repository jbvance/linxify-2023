import { useRef } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
import styles from '@/styles/Signin.module.css';

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default function SignIn() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || '';
  const emailRef = useRef();
  const submitForm = (e) => {
    let options = { email: emailRef.current.value };
    if (callbackUrl) {
      options = { ...options, callbackUrl };
    }
    e.preventDefault();
    signIn('email', options);
  };
  return (
    <Container>
      <Row>
        <h4 className={styles.signinHeader}>
          Enter your email address to login
        </h4>
      </Row>
      <Row>
        <Col>
          Enter your email address and we&apos;ll send you a link to login
          without having to use a password.
        </Col>
      </Row>
      <Row className={styles.signinForm}>
        <Form onSubmit={submitForm}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We&apos;ll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Button variant="success" type="submit">
            Submit
          </Button>
        </Form>
      </Row>
    </Container>
  );
}
