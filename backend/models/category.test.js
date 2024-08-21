const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {Category} = require('../models/category');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId,
    testCategoryId
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("findAll", async function(){

    test('works', async function() {
        let categories = await Category.findAll(testUserId[0]);
        expect(categories).toEqual(
             [{
                id: expect.any(Number),
                user_id: expect.any(Number),
                name: "HIIT",
            },{
                id: expect.any(Number),
                user_id: expect.any(Number),
                name: "Plyometrics"
            }]
        );
    })
})

describe("find", function(){
    test("works", async function() {
        let category = await Category.find(testCategoryId[0]);
        expect(category).toEqual(
            {
                id: expect.any(Number),
                user_id: expect.any(Number),
                name:"HIIT"
            }
        )
    })
})

describe("add", function(){
    test("works", async function() {
        let newCat = await Category.add({
            user_id: testUserId[0],
            name: 'testCat'
        });

        expect(newCat).toEqual(
            {
                user_id: expect.any(Number),
                name:"testCat"
            }
        )
    })
})

describe("update", function(){
    test("works", async function() {
        let updatedCategory = await Category.update(testCategoryId[0], {
            name: 'testCat'
        });

        expect(updatedCategory).toEqual(
            {
                name:"testCat"
            }
        )
    })
})

describe("remove", function(){
    test("works", async function() {

        await Category.remove(testCategoryId[0]);

        let category = await Category.findAll();

        expect(category.length).toEqual(1)
    })
})