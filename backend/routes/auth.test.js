"use strict";

const request = require("supertest");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/* --------------------- POST /auth/token */

describe('POST /auth/token', () => {
    test("works", async function (){
        const resp = await request(app)
        .post("/auth/token")
        .send({
            username: "testUser1",
            password: "testtest1"
        });

        expect(resp.body).toEqual({
            "token": expect.any(String)
        })
    })

    test("throws error with incorrect data", async function (){
        const resp = await request(app)
        .post("/auth/token")
        .send({
            username: "wrongUser",
            password: "wrong"
        });

        expect(resp.statusCode).toEqual(400)
    })
  
})

/* --------------------- POST /auth/register */

describe('POST /auth/register', () => {
    test("works", async function(){
        const resp = await request(app)
        .post("/auth/register")
        .send({
            username: "testUserNew",
            password: "testtestNew"
        });

        expect(resp.body).toEqual({
            token: expect.any(String)
        });

        expect(resp.statusCode).toEqual(201)
    });

    test("throw error with incorrect data", async function() {
        const resp = await request(app)
        .post("/auth/register")
        .send({
            username: 123,
            password: "testtest"
        });

        expect(resp.statusCode).toEqual(400);
    });

    test("throw error with missing data", async function() {
        const resp = await request(app)
        .post("/auth/register")
        .send({
            password: "testtest"
        });

        expect(resp.statusCode).toEqual(400);
    })

});