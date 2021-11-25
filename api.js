const db = require("./db");
const {
  GetCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
//const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const DYNAMODB_TABLE_NAME = "Worker";

const getWorker = async (event) => {
  const response = { statusCode: 200 };
  try {
    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      Key: { id: event.pathParameters.workerId },
    };

    const { Item } = await db.get(new GetCommand(params));
    console.log({ Item });

    response.body = JSON.stringify({
      message: "Success",
      data: Item ? unmarshall(Item) : {},
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
      Item: {id:Math.random().toString(),...worker }|| {},
    };

    const createResult = await db.send(new PutCommand(params));

    if (!createResult) {
      throw new Error("fail to create user");
    }

    response.body = JSON.stringify({
      message: "Success",
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
      TableName: DYNAMODB_TABLE_NAME,
      Item: { id: event.pathParameters.workersId },
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

    const updateResult = await db.send(new UpdateCommand(params));

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
      TableName: DYNAMODB_TABLE_NAME,
      Key: { id: event.pathParameters.workerId },
    };
    const deleteResult = await db.send(new DeleteCommand(params));

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
      new ScanCommand({ TableName: DYNAMODB_TABLE_NAME })
    );

    response.body = JSON.stringify({
      message: "Successfully",
      data: Items.map((item) => unmarshall(item)),
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
