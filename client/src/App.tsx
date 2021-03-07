import React from 'react';
import { Container } from 'react-bootstrap';

import RegisterRoot from './pages/register/Root';
import CheckRoot from './pages/check/Root';
import ErrorPage from './component/ErrorPage';

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  const param = new URLSearchParams(window.location.search);
  const eid = param.get('e');
  const token = param.get('t');

  if (eid && token) {
    return (
      <Container className="mt-3">
        <RegisterRoot accessId={eid} token={token} />
      </Container>
    );
  }

  if (eid) {
    return (
      <Container className="mt-3">
        <CheckRoot accessId={eid} />
      </Container>
    );
  }

  return <ErrorPage message="メールに記載されているよりリンクから再度アクセスしてください。" />
}

export default App;
