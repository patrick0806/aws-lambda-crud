const db = require("./db");
const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
  ScanCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const DYNAMODB_TABLE_NAME = "Worker";

const getWorker = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      key: marshall({ workerId: event.pathParameters.workerId }),
    };

    const { Item } = await db.send(new GetItemCommand(params));
    console.log({ Item });

    response.body = JSON.stringify({
      message: "Success",
      data: Item ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;

    response.body = JSON.stringify({
      message: "Fail",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }

  return response;
};

const createWorker = async (event) => {
  const response = { statusCode: 200 };
  try {
    const worker = JSON.parse(event.body);
    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      key: marshall({
        Item: marshall(worker || {}),
      }),
    };
    console.log(params,"table name:" + params.TableName, "Item:",JSON.parse(event.body), "marshall:", ...params.key);

    const createResult = await db.send(new PutItemCommand(params));

    if (!createResult) {
      throw new Error("fail to create user");
    }

    response.body = JSON.stringify({
      message: "Success",
      createResult,
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;

    response.body = JSON.stringify({
      message: "Fail",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }

  return response;
};

const updateWorker = async (event) => {
  const response = { statusCode: 200 };
  try {
    const worker = JSON.parse(event.body);
    const workerKeys = Object.key(worker);

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      key: marshall({ workerId: event.pathParameters.workersId }),
      UpdateExpression: `SET ${workerKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: workerKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        workerKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: worker[key],
          }),
          {}
        )
      ),
    };

    const updateResult = await db.send(new UpdateItemCommand(params));

    if (!updateResult) {
      throw new Error("fail to update user");
    }

    response.body = JSON.stringify({
      message: "Success",
      updateResult,
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Fail",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }

  return response;
};

const deleteWorker = async (event) => {
  const response = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({ workerId: event.pathParameters.workerId }),
    };
    const deleteResult = await db.send(new DeleteItemCommand(params));

    response.body = JSON.stringify({
      message: "Success",
      deleteResult,
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Fail",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }

  return response;
};

const getAllWorkers = async () => {
  const response = { statusCode: 200 };

  try {
    const { Items } = await db.send(
      new ScanCommand({ TableName: process.env.DYNAMODB_TABLE_NAME })
    );

    response.body = JSON.stringify({
      message: "Successfully",
      data: Items.map((item) => unmarshall(item)),
      Items,
    });
  } catch (err) {
    console.error(err);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed.",
      errorMsg: err.message,
      errorStack: err.stack,
    });
  }

  return response;
};

module.exports = {
  getWorker,
  createWorker,
  updateWorker,
  deleteWorker,
  getAllWorkers,
};
