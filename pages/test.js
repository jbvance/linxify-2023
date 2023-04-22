import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Navigation from '@/components/Navigation';

const test = () => {
  return (
    <Container>
      <Navigation />
      <Row>
        <Col>Test</Col>
      </Row>
    </Container>
  );
};

export default test;
