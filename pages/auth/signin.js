import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { getCsrfToken, signIn } from 'next-auth/react';
import styles from '@/styles/Signin.module.css';

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  console.log('QRY', router.query);
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
        <Form method="post" action="/api/auth/signin/email">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
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

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
