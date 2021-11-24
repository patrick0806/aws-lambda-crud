const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const cliente = new DynamoDBClient({});

module.exports = cliente