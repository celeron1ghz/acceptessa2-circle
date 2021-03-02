import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


import InputPage from './pages/InputPage';

function App() {
  const [columns, setColumns] = useState<Array<CircleInputFieldConfig>>([]);
  const [exhibition, setExhibition] = useState<FormValues>([]);
  const [errors, setErrors] = useState<FormValues>({});
  const [validValues, setValidValues] = useState<FormValues>({})

  const allErrorCount = columns.filter(c => {
    return (c.required && !validValues[c.column_name])
      || (!c.required && errors[c.column_name]);
  }).length;

  const validate = useCallback((key, value, valid) => {
    if (valid) {
      delete errors[key];
      validValues[key] = value;
    } else {
      errors[key] = "1";
      delete validValues[key];
    }

    setErrors({ ...errors });
    setValidValues({ ...validValues });
  }, [errors, validValues]);

  useEffect(() => {
    fetch("/data/moge.json")
      .then(data => data.json())
      .then(data => {
        for (const r of data.columns) {
          r.validator = (value: string) => {
            if (!r.required && !value) {
              return true;
            }

            switch (r.type) {
              case "select":
              case "radio":
              case "checkbox":
                return r.values[value];

              default:
                return value && value.length >= 5;
            }
          }
        }

        setColumns(data.columns);
        setExhibition(data.exhibition);
      })
      .catch(e => alert(e));
  }, []);

  const onSubmit = useCallback(() => {
    console.log(validValues);
  }, [validValues]);

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Alert variant="info">{exhibition.exhibition_name} サークル参加申込フォーム</Alert>
        </Col>
      </Row>
      <Row>
        <Col className="text-center text-primary"><Icon.PencilFill /> 入力</Col>
        <Col className="text-center text-primary"><Icon.CheckCircleFill /> 確認</Col>
        <Col className="text-center text-muted"><Icon.CheckCircleFill /> 完了</Col>
      </Row>
      <InputPage columns={columns} onValidate={validate} onSubmit={onSubmit} inputRemainCount={allErrorCount} />
    </Container>

  );
}

export default App;
