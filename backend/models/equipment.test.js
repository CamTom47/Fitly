const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Equipment} = require('../models/equipment');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testEquipmentId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", async function(){
    test('works', async function() {
        let equipments = await Equipment.findAll(testUserId[0]);
    
        expect(equipments).toEqual([{
            id: expect.any(Number),
            name: "Kettle Bells"
        }])
    })
})

describe("find", function(){
    test("works", async function() {
        let equipment = await Equipment.find(testEquipmentId[0], testUserId[0]);
        expect(equipment).toEqual({
            id: expect.any(Number),
            name: "Kettle Bells"
        })
    })
})

describe("add", function() {
    test("works", async function(){
        let data = {
            user_id: testUserId[0],
            name:"test equipment",
            systemDefault: false
        }

    let newEquipment = await Equipment.add(data);

    expect(newEquipment).toEqual({
        id: expect.any(Number),
        name: "test equipment"
    })

    let equipments = await Equipment.findAll(testUserId[0]);

    expect(equipments.length).toEqual(2);
    })

})

describe("update", function(){
    test("works", async function(){
        let updatedEquipment = await Equipment.update(testEquipmentId[0],{
            name: "updated equipment"
        })

        expect(updatedEquipment).toEqual({
            id: expect.any(Number),
            name: "updated equipment"
        })
    })
})

describe("delete", function(){
    test("works", async function(){
        
        const res = await db.query(`DELETE FROM equipments WHERE id = ${testEquipmentId[0]}`)

        expect(res.rows.length).toEqual(0);
    });
});