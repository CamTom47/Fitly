/**
 * Helper function that mutates req.body object from front end and maps SQL columns to present objects
 * 
    input 
    {
        id: 1,
        username: testuser,
        password: testtest,
        firstName: testF,
        lastName: testL,
        email: test@test.com,
        isAdmin: false
      }

      returns 
    {
        id: 1,
        username: testuser,
        password: testtest,
        first_name: testF,
        last_name: testL,
        email: test@test.com,
        is_admin: false
    }
 */

const userMap = {
    id: "id",
    username: "username",
    password: "password",
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    isAdmin: "is_admin",
}

const userMapper = (data) => {
    let userKeyValues = Object.entries(userMap)
    let newObj = {}

    for(let [k,v] of userKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

module.exports = {userMapper}