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
    testMuscleGroupsId,
    testUserId,
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

describe(' GET / ', function(){
    test("works", async function(){ 
        let resp = await request(app)
        .get("/muscleGroups")
        .set("authorization", `Bearer ${u1token}`)

        expect(resp.body).toEqual({
            muscleGroups: []
        })
    })
})

// describe(' GET /muscleGroup_id ', function(){
//     test("works", async function(){ 

      
//     })
// })

// describe(' POST / ', function(){
//   test("works", async function(){ 

    
//   })
// })

// describe(' PATCH /muscleGroup_id ', function(){
//   test("works", async function(){ 

    
//   })
// })

// describe(' DELETE /muscleGroup_id ', function(){
//   test("works", async function(){ 

    
//   })
// })

