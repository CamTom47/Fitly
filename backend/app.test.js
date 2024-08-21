const request = require("supertest");

const app = require('./app');
const db = require('./db');

test("not found 404", async function() {
    const resp = await request(app).get("/not-a-path");
    expect(resp.statusCode).toEqual(404);
})

afterAll(function() {
    db.end();
})