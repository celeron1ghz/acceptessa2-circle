import React from 'react';
import { Col, Button } from 'react-bootstrap';
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
      <br />
      <div className={"text-center"}>
        ssss
      </div>
      <br />
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
            ? <Button block variant="primary" onClick={onSubmit}>確認</Button>
            : <Button block variant="secondary" disabled>
              あと {inputRemainCount}個の項目を入力してください。
            </Button>
        }
      </Col>
    </>;
  };

export default InputPage;