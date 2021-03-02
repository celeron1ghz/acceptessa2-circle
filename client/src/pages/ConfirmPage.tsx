import React from 'react';
import { Col, Button } from 'react-bootstrap';
import CircleInputField from '../component/CircleInputField';

const ConfirmPage: React.FC<{
  onForward: () => void,
  onBack: () => void,
}> = ({
  onForward,
  onBack,
}) => {
    return <>
      <br />
      <div className={"text-center"}>
        入力内容を確認してください。
      </div>
      <br />
      <Button block onClick={onForward}>進む</Button>
      <Button block onClick={onBack}>戻る</Button>
    </>;
  };

export default ConfirmPage;