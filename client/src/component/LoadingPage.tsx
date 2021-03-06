import React from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

const App: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Spinner animation="border" size="sm" /> {message || 'Loading...'}
        </Col>
      </Row>
    </Container>
  );
};

export default App;