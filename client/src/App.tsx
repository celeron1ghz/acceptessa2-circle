import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';

import Register from './pages/register/Root';
import Check from './pages/check/Root';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  const param = new URLSearchParams(window.location.search);
  const eid = param.get('e');
  const token = param.get('t');

  if (token) {
    return <Register token={token} />;
  }

  if (eid) {
    return <Check eid={eid} />;
  }

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p className="mb-0">
              メールに記載されているよりリンクから再度アクセスしてください。
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
