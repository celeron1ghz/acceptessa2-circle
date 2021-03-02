import React from 'react';
import { Alert, Button, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const TweetButton: React.FC<{
  label: string,
  message: string,
}> = (params: FormValues) => {
  return (
    <Button
      size="lg"
      style={{ backgroundColor: "#1DA1F2", border: "0px" }}
      href="https://twitter.com/intent/tweet?text=Hello%20world"
      target="_blank"
    >
      <Icon.Twitter /> {params.label}
    </Button>
  )
};

const CompletePage: React.FC<{
}> = ({
}) => {
    return <>
      <Alert variant="light" className="text-center">
        <Icon.ExclamationTriangleFill /> サークルの登録が完了しました。
      </Alert>

      <Col className="text-center">
        <TweetButton message="aaa" label="ツイートする" />
      </Col>
    </>;
  };

export default CompletePage;