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
        "item": ObjectId("551540ec210f64444cde2359"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2657"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f677cc02295c0bfed2a9"),
        "item": ObjectId("551540d7210f67464cde2658"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a1"),
        "item": ObjectId("551540ec210f64444cde2329"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2657"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a2"),
        "item": ObjectId("551540d7210f67464cde2666"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2b7"),
        "item": ObjectId("551540d7210f67464cde2657"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a7"),
        "item": ObjectId("551540d7210f67464cde2659"),
        "type": "board",
        "board": null,
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e5f679cc02295c0bfed2a8"),
        "item": ObjectId("551540d7210f64444cde2347"),
        "type": "task",
        "board": ObjectId("551540d7210f67464cde2659"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc02895c0bfed2a1"),
        "item": ObjectId("551540ec210f64444cde2329"),
        "type": "task",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc77895c0bfed2a1"),
        "item": ObjectId("551540ec210f64444cde2359"),
        "type": "task",
        'status': 'accepted',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc77775c0bfed2a1"),
        "item": ObjectId("551540ec210f64444cde23cf"),
        "type": "task",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf6ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc77795c0bfed131"),
        "item": ObjectId("551540d7210f64444cde2346"),
        "type": "complex",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc77775c0bfed121"),
        "item": ObjectId("551540d7210f64444cde2347"),
        "type": "task",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679cc71275c0bfed121"),
        "item": ObjectId("551540d7210f64477cde2347"),
        "type": "complex",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },
    {
        "_id": ObjectId("58e0f679ac71775c0bfed121"),
        "item": ObjectId("551540d7210f64479cde2347"),
        "type": "task",
        'status': '',
        'timeLog': [],
        "board": ObjectId("58ebdc9dda195f3c1edf3ece"),
        "createdAt": ISODate(moment().toDate()),
        "updatedAt": ISODate(moment().toDate()),
        "__v": 0
    },

];