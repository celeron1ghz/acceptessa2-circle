import React from 'react';
import { Alert, Button, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const CompletePage: React.FC<{
}> = ({
}) => {
    return <>
      <Alert variant="light" className="text-center">
        <Icon.ExclamationTriangleFill /> サークルの登録が完了しました。
      </Alert>

      <Col className="text-center">
        <Button
          size="lg"
          style={{ backgroundColor: "#1DA1F2", border: "0px" }}
          href="https://google.co.jp"
          target="_blank"
        >
          <Icon.Twitter /> ツイートする
        </Button>
      </Col>
    </>;
  };

export default CompletePage;