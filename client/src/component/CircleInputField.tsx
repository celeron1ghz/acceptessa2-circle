import React, { useCallback, useRef } from 'react';
import { Badge } from 'react-bootstrap';

const CircleInputField: React.FC<{
  column: CircleInputFieldConfig,
  onValueChange?: (key: string, value: string) => void,
  onValidate: (key: string, value: string, valid: boolean) => void,
}> = ({
  column,
  onValueChange,
  onValidate,
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
      </td>
    </tr>
  };

export default CircleInputField;
