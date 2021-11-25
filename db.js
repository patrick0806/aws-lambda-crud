const { DynamoDBClient } = require("@aws-sdk/lib-dynamodb");
const cliente = new DynamoDBClient({});

module.exports = cliente