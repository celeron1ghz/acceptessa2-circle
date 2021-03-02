import React from 'react';
import { Col, Button, Alert } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

import CircleInputField from '../component/CircleInputField';

const InputPage: React.FC<{
  columns: Array<CircleInputFieldConfig>,
  onValidate: (key: string, value: string, valid: boolean) => void,
  onSubmit: () => void,
  inputRemainCount: number,
}> = ({
  columns,
  onValidate,
  onSubmit,
  inputRemainCount,
}) => {
    return <>
      <Alert variant="light" className="text-center">
        <Icon.ExclamationTriangleFill /> 下記のフォームに入力してください。
      </Alert>
      <Col>
        <table className="table table-condensed">
          <tbody>
            {
              columns.map(col =>
                <CircleInputField
                  key={col.column_name}
                  column={col}
                  onValidate={onValidate}
                />
              )
            }
          </tbody>
        </table>
        {
          inputRemainCount === 0
            ? <Button block variant="primary" onClick={onSubmit}>
              入力内容を確認する <Icon.ChevronRight />
            </Button>
            : <Button block variant="secondary" disabled>
              あと {inputRemainCount}個の項目を入力してください。
            </Button>
        }
      </Col>
    </>;
  };

export default InputPage;