const sh = require('searchhash')
const map = require('mout/object/map')
const find = require('mout/array/find')

const DB = {
    users: [
        {
            name: "Alexey Kagansky",
            email: "alex@test.me",
            password: "$2a$08$DZf5AgIo7NhtTZrkSTvwZOSoM3RoJ/tHc2yowHtlvhoc5qqro3KQW"
        },      
    ]
}

/**
    key - DB Root property
    value - find criteria: string or object {key: value}
*/
const findOne = (key, value) => {
    return find(DB[key], value)
}

module.exports = { DB, findOne }
