"use strict";

const request = require("supertest");
const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1token,
    testCategoryId,
    testUserId,
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

describe(' GET / ', function(){
    test("works", async function(){ 
        const resp = await request(app)
        .get("/categories")
        .set("authorization", `Bearer ${u1token}`);


        expect(resp.body).toEqual({ 
            categories: [
              { id: expect.any(Number), user_id: testUserId[0], name: 'HIIT' },
              { id: expect.any(Number), user_id: testUserId[0], name: 'Plyometrics' }
            ]
          })

        expect(resp.statusCode).toEqual(200)
    })
})

describe(' GET /category_id ', function(){
    test("works", async function(){ 

      let category_id = testCategoryId[0]
        const resp = await request(app)
        .get(`/categories/${category_id}`)
        .set("authorization", `Bearer ${u1token}`);

        expect(resp.body).toEqual({ 
            category: {
               id: expect.any(Number), user_id: testUserId[0], name: 'HIIT' },
          });

        expect(resp.statusCode).toEqual(200);
    })
})

describe(' POST / ', function(){
  test("works", async function(){ 

    let data = {
      user_id: testUserId[0],
      name: 'testCat'
    }

      const resp = await request(app)
      .post("/categories")
      .send(data)
      .set("authorization", `Bearer ${u1token}`);

      expect(resp.body).toEqual({ 
        category: {
          user_id: testUserId[0],
          name: "testCat"
        }
        })

      expect(resp.statusCode).toEqual(201)
  })
})

describe(' PATCH /category_id ', function(){
  test("works", async function(){ 

    let data = {
      name: 'testCatUpdate'}

      const resp = await request(app)
      .patch(`/categories/${testCategoryId[0]}`)
      .send(data)
      .set("authorization", `Bearer ${u1token}`);

      expect(resp.body).toEqual({ 
        category: {
          name: "testCatUpdate"
        }
        })

      expect(resp.statusCode).toEqual(200)
  })
})

describe(' DELETE /category_id ', function(){
  test("works", async function(){ 

      const resp = await request(app)
      .delete(`/categories/${testCategoryId[0]}`)
      .set("authorization", `Bearer ${u1token}`);

      expect(resp.body).toEqual({ 
        message: "deleted"
        })

      expect(resp.statusCode).toEqual(200)
  })
})
