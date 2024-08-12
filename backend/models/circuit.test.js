const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Circuit} = require('../models/circuit');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testCircuitId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", async function(){

    test('works', async function() {
        let circuits = await Circuit.findAll(testUserId[0]);
        expect(circuits).toEqual(
             [{
                id: expect.any(Number),
                sets: 5,
                reps: 10,
                weight: 100,
                rest_period: 60,
                intensity: "medium",
                workout_id: expect.any(Number)
             }]
        );
    })
})

describe("find", function(){
    test("works", async function() {
        let circuits = await Circuit.find(testUserId[0], testCircuitId[0]);
        expect(circuits).toEqual(
             {
                id: expect.any(Number),
                sets: 5,
                reps: 10,
                weight: 100,
                rest_period: 60,
                intensity: "medium",
                exercise_id: expect.any(Number)
             }
        );
        })
})

describe("add", function(){
    test("works when creating circuit", async function() {

        let circuitData = {
            sets: 5,
            reps: 10,
            weight: 60,
            rest_period: 70,
            intensity: "low"
        }
        
        let newCircuit = await Circuit.add(circuitData);
        
        expect(newCircuit).toEqual({
            id: expect.any(Number),
            sets: 5,
            reps: 10,
            weight: 60,
            rest_period: 70,
            intensity: "low"
        })        
    })
})

describe("update", function(){
    test("works", async function(){
        let circuitData = {
            sets: 5,
            reps: 10,
            weight: 60,
            rest_period: 70,
            intensity: "low"
        }
        let udpatedCircuit = await Circuit.update(testCircuitId[0], circuitData);

        expect(udpatedCircuit).toEqual(
            {   
                id: expect.any(Number),
                sets: 5,
                reps: 10,
                weight: 60,
                rest_period: 70,
                intensity: "low"
            }
        )
    })
})

describe("delete", function(){
    test("works", async function(){
        
        await Circuit.remove(testCircuitId[0]);

        let circuits = Circuit.findAll(testUserId[0]);
        expect(circuits.length).toEqual(undefined)
    })
})