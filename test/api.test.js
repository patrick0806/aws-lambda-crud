const { expect, test } = require("@jest/globals");
const users = require("./users.json");
const api = require("../api");

test("test create a worker in api", async () => {
  const response = await api.createWorker({ body: JSON.stringify(users[0]) });
  expect(response.statusCode).toBe(200);
});

test("test list workers", async () => {
  const response = await api.getAllWorkers();

  expect(response.statusCode).toBe(200);
});

test("test delete workers", async () => {
  const response = await api.deleteWorker({ body: JSON.stringify(users[1]) });

  expect(response.statusCode).toBe(200);
});

test("test get a worker", async () => {
  const response = await api.getWorker({
    pathParameters: { workerId: users[1].id },
  });
  expect(response.statusCode).toBe(200);
});

test("test update a worker", async () => {
  const response = await api.getWorker({
    pathParameters: { workerId: users[1].id },
    body: JSON.stringify(users[0]),
  });
  expect(response.statusCode).toBe(200);
});
