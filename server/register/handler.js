'use strict';

const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient();
const r = require('rand-token');

const TABLE = "acceptessa2-circle-register";

function log(event, status, error) {
  console.log({
    ...event.requestContext.http,
    time: event.requestContext.timeEpoch,
    apiId: event.requestContext.apiId,
    status,
    error,
  });
}

module.exports.validate_mail = async (event) => {
  const param = event.queryStringParameters || {};
  const mail = param.mail;

  if (!mail) {
    log(event, "no_input");
    return { statusCode: 403, body: "error" };
  }

  if (!mail.match(/@/)) {
    log(event, "invalid_input");
    return { statusCode: 403, body: "error" };
  }

  const ttl = Math.ceil(new Date().getTime() / 1000) + 3600; // 1 hour
  const token = r.generate(128);
  const ret = await ddb
    .put({ TableName: TABLE, Item: { token, mail, ttl } })
    .promise()
    .catch(err => err);

  if (ret instanceof Error) {
    log(event, "dynamodb_error", ret);
    return { statusCode: 403, body: "error" };
  }

  log(event, "success");
  return { statusCode: 200, body: "OK" };
};

module.exports.check_mail = async (event) => {
  const param = event.queryStringParameters || {};
  const token = param.t;

  if (!token || !token.length) {
    log(event, "no_input");
    return { statusCode: 403, body: "error" };
  }

  const ret = await ddb
    .get({ TableName: TABLE, Key: { token } })
    .promise()
    .catch(err => err);

  if (!ret.Item) {
    log(event, "no_item", ret);
    return { statusCode: 403, body: "error" };
  }

  log(event, "success");
  return { statusCode: 200, body: "OK" };
};
