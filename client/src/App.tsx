import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Container, Row, Col, Alert, Button, Badge } from 'react-bootstrap';

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

const CircleInputField: React.FC<{
  column: InputColumns,
  onValueChange?: (key: string, value: string) => void,
  onValidate: (key: string, value: string, valid: boolean) => void,
}> = ({
  column,
  onValueChange,
  onValidate,
}) => {
    return <tr>
      <td style={{ width: "15vw" }}>
        {column.label}
        <br />
        {
          column.required
            ? <Badge variant="danger">必須</Badge>
            : <Badge variant="info">任意</Badge>
        }
      </td>
      <td>
        {<InputField
          column={column}
          onValueChange={onValueChange}
          onValidate={onValidate}
        />}
      </td>
    </tr>
  };

const InputField: React.FC<{
  column: InputColumns,
  onValueChange?: (key: string, value: string) => void,
  onValidate: (key: string, value: string, valid: boolean) => void,
}> = ({
  column,
  onValueChange,
  onValidate
}) => {
    const id = column.column_name;
    const ref = useRef<string>("");
    const value = ref.current;
    const error = value && !column.validator(value);
    const classes = ["form-control"];

    if (value && value.length > 0) {
      if (error) {
        classes.push('is-invalid');
      } else {
        classes.push('is-valid');
      }
    }

    //
    // handlers
    //
    const onChangeSelectHandler = useCallback((e: React.ChangeEvent<any>) => {
      ref.current = e.target.value;
      console.log(e.target.value)
      if (onValueChange) {
        onValueChange(id, e.target.value);
      }

      onValidate(id, ref.current, column.validator(ref.current));
    }, [onValueChange, onValidate, id, column]);

    const onChangeTextInputHandler = useCallback((e: React.ChangeEvent<any>) => {
      ref.current = e.target.value;
      if (onValueChange) {
        onValueChange(id, e.target.value);
      }
    }, [onValueChange, id]);

    const onBlurTextInputHandler = useCallback((e: React.FocusEvent<any>) => {
      onValidate(id, ref.current, column.validator(ref.current));
    }, [onValidate, id, column]);

    //
    // generate element
    //
    let elem;
    switch (column.type) {
      case "select":
        elem = <select
          className={classes.join(" ")}
          onChange={onChangeSelectHandler}
        >
          {
            Object.entries(column.values).map(([idx, label]) =>
              <option key={idx} value={idx}>{label}</option>
            )
          }
        </select>
        break;


      case "radio":
        elem = <div className={classes.join(" ")}>
          {
            Object.entries(column.values).map(([idx, label]) =>
              <label key={idx}>
                <input type="radio" name={id} value={idx} onChange={onChangeSelectHandler} /> {label}&nbsp;&nbsp;
              </label>
            )
          }
        </div>;
        break;


      case "checkbox":
        elem = <div className={classes.join(" ")}>
          {
            Object.entries(column.values).map(([idx, label]) =>
              <label key={idx}>
                <input type="checkbox" name={id} value={idx} onChange={onChangeSelectHandler} /> {label}&nbsp;&nbsp;
              </label>
            )
          }
        </div>;
        break;


      case "textarea":
        elem = <textarea
          className={classes.join(" ")}
          style={{ resize: "none" }}
          onChange={onChangeTextInputHandler}
          onBlur={onBlurTextInputHandler}
        ></textarea>
        break;


      default:
        elem = <input
          type="text"
          className={classes.join(" ")}
          onChange={onChangeTextInputHandler}
          onBlur={onBlurTextInputHandler}
        />
    }

    return <>
      {elem}
      {
        column.description &&
        <div className="text-muted">! {column.description}</div>
      }
      {
        error &&
        <span key={id} className="text-danger">
          {error && "error"}
        </span>
      }
    </>;
  }

function App() {
  const [columns, setColumns] = useState<Array<InputColumns>>([]);
  const [errors, setErrors] = useState<Array<boolean>>([]);
  const [validValues, setValidValues] = useState<FormValues>({})

  const allColumnsCount = columns.length;
  const errorCount = Object.keys(errors).length;
  const validInputCount = Object.keys(validValues).length;

  const inputAllValid = errorCount === 0 && columns.length === validInputCount;
  const validInputPercentage = Math.ceil(validInputCount / allColumnsCount * 100);

  const validate = useCallback((key, value, valid) => {
    if (valid) {
      delete errors[key];
      validValues[key] = value;
    } else {
      errors[key] = true;
      delete validValues[key];
    }

    setErrors({ ...errors });
    setValidValues({ ...validValues });
  }, [errors, validValues]);

  useEffect(() => {
    fetch("/data/moge.json")
      .then(data => data.json())
      .then(data => {
        for (const r of data) {
          r.validator = (value: string) => {
            // console.log(r.column_name, "-", value)
            return value === r.column_name;
          }
        }

        setColumns(data);
      })
      .catch(e => alert(e));
  }, []);

  return (
    <Container>
      <Row>
        <Col className="text-center text-primary">aa</Col>
        <Col className="text-center text-primary">aa</Col>
        <Col className="text-center text-primary">aa</Col>
      </Row>
      <Alert variant="info">hello</Alert>
      <Col>
        <table className="table table-condensed">
          <tbody>
            {
              columns.map(col =>
                <CircleInputField
                  key={col.column_name}
                  column={col}
                  onValidate={validate}
                />)
            }
          </tbody>
        </table>
        {
          inputAllValid
            ? <Button block variant="primary">確認</Button>
            : <Button block variant="secondary" disabled>
              あと {allColumnsCount - validInputCount}個の項目を入力してください。
              </Button>
        }
      </Col>
    </Container >

  );
}

export default App;
