import React, { useState, useCallback, useEffect } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import InputPage from '../register/InputPage';
import ConfirmPage from '../register/ConfirmPage';
import CompletePage from '../register/CompletePage';
import ErrorPage from '../../component/ErrorPage';
import LoadingPage from '../../component/LoadingPage';

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

const App: React.FC<{ token: string }> = ({ token }) => {
  const [exhibitionConfig, setExhibitionConfig] = useState<ExhibitionValues>({});
  const [mode, setMode] = useState<string>("input");
  const [errors, setErrors] = useState<FormValues>({});
  const [validValues, setValidValues] = useState<FormValues>({})

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

        setExhibitionConfig({ ...data, loaded: true });
      })
      .catch(err => setExhibitionConfig({ error: new Error(err), loaded: true }))
  }, []);

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

  const onInputComplete = useCallback(() => {
    setMode("confirm");
  }, [validValues]);

  const onConfirmForward = function () {
    setMode("complete");
  };
  const onConfirmBack = function () {
    setMode("input");
  };

  if (!exhibitionConfig.loaded) {
    return <LoadingPage />;
  }

  if (exhibitionConfig.error) {
    return <ErrorPage message="指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。" />
  }

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

  const allErrorCount = exhibitionConfig.columns
    ? exhibitionConfig.columns.filter(c => {
      return (c.required && !validValues[c.column_name])
        || (!c.required && errors[c.column_name]);
    }).length
    : 0;

  return (
    <>
      <Row>
        <Col>
          <Alert variant="info">
            {
              exhibitionConfig.exhibition
                ? exhibitionConfig.exhibition.exhibition_name
                : ""
            }
            サークル参加申込フォーム
          </Alert>
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
          columns={exhibitionConfig.columns || []}
          onValidate={validate}
          onSubmit={onInputComplete}
          inputRemainCount={allErrorCount}
        />
      }
      {
        mode === 'confirm' &&
        <ConfirmPage
          validValues={validValues}
          columns={exhibitionConfig.columns || []}
          onForward={onConfirmForward}
          onBack={onConfirmBack}
        />
      }
      {
        mode === 'complete' &&
        <CompletePage />
      }
    </>
  );
}

export default App;
