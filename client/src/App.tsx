import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


import InputPage from './pages/InputPage';
import ConfirmPage from './pages/ConfirmPage';
import CompletePage from './pages/CompletePage';

const Menu: React.FC<{ mode: string, label: string }> = function ({ mode, label }) {
  switch (mode) {
    case "complete":
      return (
        <Col className="text-center text-muted">
          <Icon.CheckCircleFill /> {label}
        </Col>
      );

    case "now":
      return (
        <Col className="text-center text-primary">
          <Icon.PencilFill /> {label}
        </Col>
      );

    case "now_complete":
      return (
        <Col className="text-center text-primary">
          <Icon.CheckCircleFill /> {label}
        </Col>
      );

    case "":
      return (
        <Col className="text-center text-muted">
          {label}
        </Col>
      );

    default:
      return (
        <div>aa</div>
      );
  }
}

function App() {
  const [mode, setMode] = useState<string>("input");
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

  const onInputComplete = useCallback(() => {
    console.log(validValues);
    setMode("confirm");
  }, [validValues]);

  const onConfirmForward = function () {
    setMode("complete");
  };
  const onConfirmBack = function () {
    setMode("input");
  };

  let inputState: string, confirmState: string, completeState: string;

  switch (mode) {
    case "confirm":
      inputState = "complete";
      confirmState = "now";
      completeState = "";
      break

    case "complete":
      inputState = "complete";
      confirmState = "complete";
      completeState = "now_complete";
      break

    default:
      inputState = "now";
      confirmState = "";
      completeState = "";
  }

  return (
    <Container>
      <br />
      <Row>
        <Col>
          <Alert variant="info">{exhibition.exhibition_name} サークル参加申込フォーム</Alert>
        </Col>
      </Row>
      <Row>
        <Menu mode={inputState} label="1. 入力" />
        <Menu mode={confirmState} label="2. 確認" />
        <Menu mode={completeState} label="3. 完了" />
      </Row>
      {
        mode === 'input' &&
        <InputPage
          columns={columns}
          onValidate={validate}
          onSubmit={onInputComplete}
          inputRemainCount={allErrorCount}
        />
      }
      {
        mode === 'confirm' &&
        <ConfirmPage
          validValues={validValues}
          columns={columns}
          onForward={onConfirmForward}
          onBack={onConfirmBack}
        />
      }
      {
        mode === 'complete' &&
        <CompletePage />
      }
    </Container>

  );
}

export default App;
