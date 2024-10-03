/**
 * Helper function that mutates req.body object from front end and maps SQL columns to present objects
 * 
    input 
    {
     id: 1,
     name: "test",
     muscleGroup: "arms",
     equipmentId: 3
      }

      returns 
    {
    id: 1,
    name: "test",
    muscle_group: "arms",
    equipment_id: 3
    }

 */

const categorymap = {
    id: "id",
    username: "username",
    password: "password",
    firstName: "firs_name",
    lastName: "last_name",
    email: "email",
    isAdmin: "is_admin",
}

const userMapper = (data) => {
    let userKeyValues = Object.entries(mapper)
    let newObj = {}

    for(let [k,v] of userKeyValues){
        if (data[k]) newObj[v] = data[k]
    }
    return newObj
}

Module.export = {userMapper}