import React, { useEffect } from 'react';
import { Col, Button, Alert } from 'react-bootstrap';
import { InfoCircleFill, ChevronRight } from 'react-bootstrap-icons';
import { Badge } from 'react-bootstrap';
import { useForm, RegisterOptions, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const InputPage: React.FC<{
  columns: Array<CircleInputFieldConfig>,
  validator: any,
  validValues: FormValues,
  onSubmit: SubmitHandler<FormValues>,
}> = ({
  columns,
  validator,
  validValues,
  onSubmit,
}) => {
    const { register, handleSubmit, formState, getValues, trigger } = useForm({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: validValues,
      resolver: yupResolver(validator),
    });

    useEffect(() => {
      if (Object.keys(validValues).length) {
        trigger();
      }
    }, [trigger, validValues]);

    const values = getValues();
    const errors = formState.errors;
    const allErrorCount = columns.filter(c => {
      return (c.required && !values[c.column_name])
        || (!c.required && errors[c.column_name]);
    }).length;

    return <>
      <Col>
        <Alert variant="light" className="text-center">
          <InfoCircleFill /> 下記のフォームに入力し、「入力内容を確認する」ボタンを押してください。
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="table table-condensed">
            <tbody>
              {
                columns.map(col => {
                  let elem;
                  const name = col.column_name;
                  const classes = ["form-control"];

                  if (errors[name]) {
                    classes.push('is-invalid');
                  } else if (values[name] && values[name].length !== 0) {
                    classes.push('is-valid');
                  }

                  const param: RegisterOptions = {};
                  param.required = col.required;

                  switch (col.type) {
                    case "select":
                      elem = (
                        <select
                          name={name}
                          ref={register(param)}
                          className={classes.join(" ")}
                        >
                          <option value={""}>-選択してください-</option>
                          {
                            Object.entries(col.values).map(([idx, label]) =>
                              <option key={idx} value={idx}>{label}</option>
                            )
                          }
                        </select>
                      );
                      break;

                    case "radio":
                      elem = (
                        <div className={classes.join(" ")}>
                          {
                            Object.entries(col.values).map(([idx, label]) =>
                              <label key={idx} className="mr-3">
                                <input
                                  name={name}
                                  ref={register(param)}
                                  type="radio"
                                  value={idx}
                                /> {label}
                              </label>
                            )
                          }
                        </div>
                      );
                      break;

                    case "textarea":
                      elem = (
                        <textarea
                          name={name}
                          ref={register(param)}
                          className={classes.join(" ")}
                          style={{ resize: "none" }}
                        ></textarea>
                      );
                      break;

                    default:
                      elem = (
                        <input
                          name={name}
                          ref={register(param)}
                          className={classes.join(" ")}
                          type="text"
                        />
                      );
                  }

                  return (
                    <tr key={col.column_name}>
                      <td style={{ width: "18vw" }} className={col.required ? 'text-danger' : 'text-info'}>
                        {col.label}
                        <br />
                        {
                          col.required
                            ? <Badge variant="danger">必須</Badge>
                            : <Badge variant="info">任意</Badge>
                        }
                      </td>
                      <td>
                        {elem}
                        {
                          errors[name]
                          && <small className="text-danger">{errors[name].message}</small>
                        }
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          {
            allErrorCount === 0
              ? <Button block size="lg" variant="primary" type="submit">
                入力内容を確認する <ChevronRight />
              </Button>
              : <Button block size="lg" variant="secondary" disabled>
                あと {allErrorCount}個の項目を入力してください。
            </Button>
          }
        </form>
      </Col>
    </>;
  };

export default InputPage;