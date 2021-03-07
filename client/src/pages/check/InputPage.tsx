import React, { useState } from 'react';
import { Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import { EnvelopeFill, InfoCircleFill } from 'react-bootstrap-icons';

const App: React.FC<{ exhibition: Exhibition, onSubmit: (mail: string) => void, }> = ({ exhibition, onSubmit }) => {
  const [mail, setMail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const validInput = mail.match(/^[\w-+]{2,}@[\w-]{3,}\.[\w-]{2,}$/);

  const onChange = (e: React.ChangeEvent<any>) => {
    setMail(e.target.value);
  };

  const onClick = () => {
    setLoading(true);
    onSubmit(mail);
  };

  return (
    <>
      <Row>
        <Col>
          <Alert variant="info">
            <EnvelopeFill /> {exhibition.exhibition_name} メールアドレス確認 入力
          </Alert>
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
            <InfoCircleFill />
            下記の送信ボタンを押下しただけではサークル参加申し込みは完了しません。<br />
             メールに記載されたリンクからサークル情報の入力を行ってください。
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="text"
            className={[
              "form-control mt-5 mb-3",
              !mail
                ? ""
                : validInput
                  ? 'is-valid'
                  : 'is-invalid'
            ].join(' ')}
            placeholder="メールアドレスを入力してください"
            onChange={onChange}
          />
          {
            loading
              ? <Button block variant="primary" disabled>
                <Spinner animation="border" size="sm" /> 送信中...
                </Button>
              : <Button block variant="primary" disabled={!validInput} onClick={onClick}>
                <EnvelopeFill /> 送信
                </Button>
          }
        </Col>
      </Row>
    </>
  );
}

export default App;
