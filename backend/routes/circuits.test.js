"use strict";

const request = require("supertest");
const app = require("../app");
const { mockRequest, mockResponse } = require('mock-req-res')



const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1token,
    testCircuitId,
    testUserId
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);

describe(' GET / ', function(){
    test("works", async function(){ 
            
        let resp = await request(app)
        .get("/circuits")
        .set("authorization", `Bearer ${u1token}`)

        console.log(resp)

        expect(resp.body).toEqual({
            circuits: [{
                sets: 5,
                reps: 10,
                weight: 60,
                rest_period: 70,
                intensity: "low"
            },{
                sets: 1,
                reps: 1,
                weight: 1,
                rest_period: 1,
                intensity: "low"
            },{
                sets: 2,
                reps: 2,
                weight: 2,
                rest_period: 2,
                intensity: "low"
            }]
        })
    })
})

// describe(' GET /circuit_id ', function(){
//     test("works", async function(){ 

      
//     })
// })

// describe(' POST / ', function(){
//   test("works", async function(){ 

    
//   })
// })

// describe(' PATCH /circuit_id ', function(){
//   test("works", async function(){ 

    
//   })
// })

// describe(' DELETE /circuit_id ', function(){
//   test("works", async function(){ 

    
//   })
// })

