let id = require('pow-mongodb-fixtures').createObjectId;
let moment = require('moment');

function ObjectId(str) {
    return id(str);
}

function ISODate(date) {
    return new Date(date);
}

exports.boarditems = [
    {
        "_id": ObjectId("58e5f677cc02295c0bfed2a0"),
        "isRoot": false,
        "item": ObjectId("551540ec210f64444cde2359"),
        "project": ObjectId("551540d7210f64444cde2327"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2657"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f677cc02295c0bfed2a9"),
        "isRoot": true,
        "item": ObjectId("551540d7210f67464cde2658"),
        "project": ObjectId("551540d7210f64444cde2327"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a1"),
        "isRoot": false,
        "item": ObjectId("551540ec210f64444cde2329"),
        "project": ObjectId("551540d7210f64444cde2327"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2657"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a2"),
        "isRoot": true,
        "project": ObjectId("551540d7210f64444cde2327"),
        "item": ObjectId("551540d7210f67464cde2666"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2b7"),
        "isRoot": true,
        "item": ObjectId("551540d7210f67464cde2657"),
        "project": ObjectId("551540d7210f64444cde2327"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a7"),
        "isRoot": true,
        "item": ObjectId("551540d7210f67464cde2659"),
        "project": ObjectId("551540d7210f64444cde2346"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a8"),
        "isRoot": false,
        "item": ObjectId("551540d7210f64444cde2347"),
        "project": ObjectId("551540d7210f64444cde2346"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2659"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc02895c0bfed2a1"),
        "item": ObjectId("551540ec210f64444cde2329"),
        "isRoot": false,
        "type": "task",
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc77895c0bfed2a1"),
        "item": ObjectId("551540e2210f64444cde2328"),
        "isRoot": false,
        "type": "task",
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
];