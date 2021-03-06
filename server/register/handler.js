'use strict';

const aws = require('aws-sdk');
const ddb = new aws.DynamoDB.DocumentClient();
const rand = require('rand-token');

const REGISTER_TABLE = "acceptessa2-circle-register";
const EXHIBITION_TABLE = "acceptessa2-exhibition";

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
  const eid = param.e;

  if (!mail || !eid) {
    log(event, "no_input");
    return { statusCode: 403, body: "error" };
  }

  if (!mail.match(/@/)) {
    log(event, "invalid_input");
    return { statusCode: 403, body: "error" };
  }

  const e = await ddb.get({ TableName: EXHIBITION_TABLE, Key: { id: eid } }).promise();
  console.log(e);

  if (!e.Item) {
    log(event, "no_exhibition");
    return { statusCode: 403, body: "error" };
  }

  const ttl = Math.ceil(new Date().getTime() / 1000) + 3600; // 1 hour
  const token = rand.generate(128);
  const exhibition = e.Item;

  const r = await ddb
    .put({ TableName: REGISTER_TABLE, Item: { token, mail, eid: exhibition.id, ttl } })
    .promise()
    .catch(err => err);

  if (r instanceof Error) {
    log(event, "dynamodb_error", r);
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
    .get({ TableName: REGISTER_TABLE, Key: { token } })
    .promise()
    .catch(err => err);

  if (!ret.Item) {
    log(event, "no_item", ret);
    return { statusCode: 403, body: "error" };
  }

  log(event, "success");
  return { statusCode: 200, body: ret.Item.eid };
};
