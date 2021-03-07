import React from 'react';
import { Alert, Row, Col } from 'react-bootstrap';
import { EnvelopeFill } from 'react-bootstrap-icons';

const CompletePage: React.FC<{ exhibition: Exhibition }> = ({ exhibition }) => {
  return <>
    <Row>
      <Col>
        <Alert variant="info"><EnvelopeFill /> メールアドレス確認 入力完了</Alert>
      </Col>
    </Row>
    <Row>
      <Col>
        <div className="text-muted">
          入力したメールアドレスにサークル参加登録へのリンクを含むメールを送信しました。<br />
            メールのリンクよりサークルの参加登録を行ってください。<br />
          <br />
            メールが届かない場合は迷惑メールフォルダに入っていないかをご確認ください。<br />
          <br />
            何度か試してもメールが届かない場合は、イベント主催者にお問い合わせください。
          </div>
      </Col>
    </Row>
  </>;
};

export default CompletePage;