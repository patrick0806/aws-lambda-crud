const { expect, test } = require("@jest/globals");
const users = require("./users.json");
const api = require("../api");

test("test crud worker api",async () =>{
    const response = await api.createWorker({body:JSON.stringify(users[0])});
    console.log(response);  
    expect(response.statusCode).toBe(200);
})