import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import CircleInputField from './component/CircleInputField';

function App() {
  const [columns, setColumns] = useState<Array<CircleInputFieldConfig>>([]);
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
        for (const r of data) {
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

        setColumns(data);
      })
      .catch(e => alert(e));
  }, []);

  const onSubmit = useCallback(() => {
    console.log(validValues);
  }, [validValues]);

  return (
    <Container>
      <Row>
        <Col className="text-center text-primary">aa</Col>
        <Col className="text-center text-primary">aa</Col>
        <Col className="text-center text-primary">aa</Col>
      </Row>
      <Alert variant="info">hello</Alert>
      <Col>
        <table className="table table-condensed">
          <tbody>
            {
              columns.map(col =>
                <CircleInputField
                  key={col.column_name}
                  column={col}
                  onValidate={validate}
                />
              )
            }
          </tbody>
        </table>
        {
          allErrorCount === 0
            ? <Button block variant="primary" onClick={onSubmit}>確認</Button>
            : <Button block variant="secondary" disabled>
              あと {allErrorCount}個の項目を入力してください。
              </Button>
        }
      </Col>
    </Container>

  );
}

export default App;
