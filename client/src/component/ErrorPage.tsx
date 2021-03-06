import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const App: React.FC<{ title?: string, message: string }> = ({ title, message }) => {
  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Alert variant="danger">
            <Alert.Heading>{title || 'Error'}</Alert.Heading>
            <p className="mb-0">{message}</p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default App;