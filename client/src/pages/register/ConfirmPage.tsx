import React from 'react';
import { Alert, Col, Button, Badge } from 'react-bootstrap';
import { ExclamationTriangleFill, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const ConfirmPage: React.FC<{
  columns: Array<CircleInputFieldConfig>,
  validValues: FormValues,
  onForward: () => void,
  onBack: () => void,
}> = ({
  columns,
  validValues,
  onForward,
  onBack,
}) => {
    return <>
      <Alert variant="light" className="text-primary text-center">
        <ExclamationTriangleFill /> 入力内容を確認してください。
      </Alert>
      <Col>
        <table className="table table-condensed">
          <tbody>
            {
              columns.map(col => <tr>
                <td style={{ width: "20vw" }}>
                  {col.label}
                  <br />
                  {
                    col.required
                      ? <Badge variant="danger">必須</Badge>
                      : <Badge variant="info">任意</Badge>
                  }
                </td>
                <td>
                  {
                    validValues[col.column_name]
                      ? validValues[col.column_name]
                      : <span className="text-muted">(未入力)</span>
                  }
                </td>
              </tr>
              )
            }
          </tbody>
        </table>
      </Col>
      <br />
      <Button block variant="primary" onClick={onForward}>
        上記内容でサークル参加登録を行う <ChevronRight />
      </Button>
      <Button block variant="danger" onClick={onBack}>
        <ChevronLeft /> 入力内容の修正を行う
      </Button>
    </>;
  };

export default ConfirmPage;