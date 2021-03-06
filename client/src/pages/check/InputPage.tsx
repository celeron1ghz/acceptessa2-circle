import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { EnvelopeFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

const App: React.FC<{ onSubmit: (mail: string) => void, }> = ({ onSubmit }) => {
  const [mail, setMail] = useState<string>("");
  const validInput = !mail.match(/^[\w+]{2,}@\w{3,}\.\w{2,}$/);

  const onChange = (e: React.ChangeEvent<any>) => {
    setMail(e.target.value);
  };

  const onClick = () => {
    onSubmit(mail);
  };

  return (
    <>
      <Row>
        <Col>
          <Alert variant="info"><EnvelopeFill /> メールアドレス確認 入力</Alert>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="text-muted">
            メールアドレスを入力し送信ボタンを押してください。<br />
              入力したメールアドレスに対し、サークル登録を行うためのリンクを含むメールを送信させていただきます。<br />
          </div>
          <br />
          <div className="text-danger">
            <ExclamationTriangleFill />
              下記の送信ボタンを押下しただけではサークル参加申し込みは完了しません。<br />
              メールに記載されたリンクからサークル情報の入力を行ってください。
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="text"
            className="form-control my-5"
            placeholder="メールアドレスを入力してください"
            onChange={onChange}
          />
          {

          }
          <Button block variant="primary" disabled={validInput} onClick={onClick}>
            <EnvelopeFill /> 送信
            </Button>
        </Col>
      </Row>
    </>
  );
}

export default App;
