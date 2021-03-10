import React, { useState, useCallback, useEffect } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import InputPage from '../register/InputPage';
import ConfirmPage from '../register/ConfirmPage';
import CompletePage from '../register/CompletePage';
import ErrorPage from '../../component/ErrorPage';
import LoadingPage from '../../component/LoadingPage';

import createValidator from '../../component/Validator';

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

const App: React.FC<{ accessId: string, token: string }> = ({ token, accessId }) => {
  const [exhibitionConfig, setExhibitionConfig] = useState<ExhibitionValues | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [mode, setMode] = useState<string>("input");
  const [validValues, setValidValues] = useState<FormValues>({})

  useEffect(() => {
    (async () => {
      try {
        const ret = await fetch(`/data/${accessId}.json`);
        if (!ret.ok) {
          throw new Error("指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。");
        }

        const data = await ret.json().catch(err => null);
        if (!data) {
          throw new Error("指定された即売会は存在しないか、現在サークル申し込みを受け付けていません。");
        }

        const ret2 = await fetch("/register/check?t=" + token);
        if (!ret2.ok) {
          throw new Error("メールに記載されているよりリンクから再度アクセスしてください。");
        }

        data.validator = createValidator(data.columns);

        setExhibitionConfig(data);
      } catch (error) {
        setError(error);
      }
    })();
  }, [accessId, token]);

  const onInputComplete = useCallback((data, a) => {
    setValidValues(data);
    setMode("confirm");
  }, []);

  const onConfirmForward = useCallback(() => {
    setMode("complete");
  }, []);
  const onConfirmBack = useCallback(() => {
    setMode("input");
  }, []);

  if (error) {
    return <ErrorPage message={error.message} />
  }

  if (!exhibitionConfig) {
    return <LoadingPage />;
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

  return (
    <>
      <Row>
        <Col >
          <Alert variant="info">
            {exhibitionConfig.exhibition.exhibition_name} サークル参加申込フォーム
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
          validValues={validValues}
          columns={exhibitionConfig.columns}
          validator={exhibitionConfig.validator}
          onSubmit={onInputComplete}
        />
      }
      {
        mode === 'confirm' &&
        <ConfirmPage
          validValues={validValues}
          columns={exhibitionConfig.columns}
          onForward={onConfirmForward}
          onBack={onConfirmBack}
        />
      }
      {
        mode === 'complete' &&
        <CompletePage exhibition={exhibitionConfig.exhibition} />
      }
    </>
  );
}

export default App;
