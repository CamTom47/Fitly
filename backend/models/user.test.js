const { describe } = require('node:test');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../ExpressError');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

const {
    commonAfterAll,
    commonBeforeAll,
    commonAfterEach,
    commonBeforeEach,
    testUserId
} = require('./_testCommon');
const { BCRYPT_WORK_FACTOR } = require('../config');

process.env.NODE_ENV = "test"

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterAll(commonAfterAll);
afterEach(commonAfterEach);

describe("find", function(){
    test("works", async function() {
        
        let user = await User.find('testUser');

        expect(user).toEqual({
            id: expect.any(Number),
            username: "testUser",
            password: "testtest",
            firstName: "testF",
            lastName: "testL",
            email: "test@test.com",
            isAdmin: true
        })
    })
})

describe("add", function() {
    test("works", async function(){

        let data = {
            username: "testUser2",
            password: 'testtest2',
            is_admin: false
        }

        let newUser = await User.register(data);

        expect(newUser).toEqual({
            id: expect.any(Number),
            username: "testUser2",
            is_admin: false
        })
       
    })
})

describe("update", function(){
    test("works", async function(){

        let data = {
            first_name: "testFupdate",
            last_name: "testLupdate"
        }

        let updatedUser = await User.update("testUser", data);

        expect(updatedUser).toEqual({
            id: expect.any(Number),
            username: "testUser",
            firstName: "testFupdate",
            lastName: "testLupdate",
            email: "test@test.com",
            isAdmin: true

        })

       
    })
})

describe("delete", function(){
    test("works", async function(){


        let res = await db.query(`
            DELETE FROM users WHERE id =${testUserId[0]}`)

            expect(res.rows.length).toEqual(0);

        

    });
});