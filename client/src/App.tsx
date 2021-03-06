import React from 'react';
import Root from './pages/register/Root';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

function App() {
  const param = new URLSearchParams(window.location.search);

  return (
    <Root />
  );
}

export default App;
