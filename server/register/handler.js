'use strict';

module.exports.validate_mail = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'validate',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.check_mail = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'check',
      },
      null,
      2
    ),
  };
};
