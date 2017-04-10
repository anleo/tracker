let id = require('pow-mongodb-fixtures').createObjectId;
let moment = require('moment');

function ObjectId(str) {
    return id(str);
}

function ISODate(date) {
    return new Date(date);
}

exports.boards = [
    {
        "_id": ObjectId("551540d7210f67464cde2657"),
        "title": "board 1",
        "status": "",
        "time": 8,
        "owner": ObjectId("5514462ae4eb270b4f115c2c"),
        "shared": [ObjectId("5514462ae4eb270b4f115c2c")],
        "project": ObjectId("551540d7210f64444cde2327"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("551540d7210f67464cde2659"),
        "title": "board 4",
        "status": "",
        "time": 6,
        "owner": ObjectId("5514462ae4eb270b4f115c2c"),
        "shared": [ObjectId("5514462ae4eb270b4f115c2c")],
        "project": ObjectId("551540d7210f64444cde2346"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("551540d7210f67464cde2658"),
        "title": "board 2",
        "status": "in progress",
        "time": 6,
        "owner": ObjectId("5514462ae4eb270b4f115c2c"),
        "shared": [ObjectId("5514462ae4eb270b4f115c2c")],
        "project": ObjectId("551540d7210f64444cde2327"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("551540d7210f67464cde2666"),
        "title": "board 3",
        "status": "accepted",
        "time": 6,
        "owner": ObjectId("5514462ae4eb270b4f115c2c"),
        "shared": [ObjectId("5514462ae4eb270b4f115c2c")],
        "project": ObjectId("551540d7210f64444cde2327"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    }
];