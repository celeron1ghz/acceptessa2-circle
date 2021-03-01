import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

import CircleInputField from './component/CircleInputField';

function App() {
  const [columns, setColumns] = useState<Array<CircleInputFieldConfig>>([]);
  const [errors, setErrors] = useState<Array<boolean>>([]);
  const [validValues, setValidValues] = useState<FormValues>({})

  const allColumnsCount = columns.length;
  const errorCount = Object.keys(errors).length;
  const validInputCount = Object.keys(validValues).length;

  const inputAllValid = errorCount === 0 && columns.length === validInputCount;
  // const validInputPercentage = Math.ceil(validInputCount / allColumnsCount * 100);

  const validate = useCallback((key, value, valid) => {
    if (valid) {
      delete errors[key];
      validValues[key] = value;
    } else {
      errors[key] = true;
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
            // console.log(r.column_name, "-", value)
            return value === r.column_name;
          }
        }

        setColumns(data);
      })
      .catch(e => alert(e));
  }, []);

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
                />)
            }
          </tbody>
        </table>
        {
          inputAllValid
            ? <Button block variant="primary">確認</Button>
            : <Button block variant="secondary" disabled>
              あと {allColumnsCount - validInputCount}個の項目を入力してください。
              </Button>
        }
      </Col>
    </Container >

  );
}

export default App;
