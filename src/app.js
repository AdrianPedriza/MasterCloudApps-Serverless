'use strict';

// dbManager file will have DynamoDB functionality in further changes. For now, it just uses mocked data to test a REST Api
const dbManager = require('./dbManager');

exports.entriesHandler = (event, context, callback) => {

    switch (event.httpMethod) {
        case 'GET':
            if (event.pathParameters == null){
                getAllEntries(callback);
            } else {
                getEntry(event.pathParameters.entryid, callback);
            }
            break;
        case 'POST':
            if (event.pathParameters == null) {
                saveEntry(event.body, callback);
            } else {
                saveComment(event.pathParameters.entryid, event.body, callback);
            }
            break;
        case 'PUT':
            updateEntry(event.pathParameters.entryid, event.body, callback);
            break;
        case 'DELETE':
            if (event.pathParameters.commentid == null) {
                deleteEntry(event.pathParameters.entryid, callback);
            } else {
                deleteComment(event.pathParameters.entryid, event.pathParameters.commentid, callback);
            }            
            break;
        default:
            sendResponse(400, `Unsupported method ${event.httpMethod}`, callback);
    }
};

const getAllEntries = (callback) => {
    dbManager.getAllEntries()
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const getEntry = (entryid, callback) => {
    dbManager.getEntry(entryid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const saveEntry = (data, callback) => {
    data = JSON.parse(data);
    dbManager.saveEntry(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const updateEntry = (entryid, data, callback) => {
    data = JSON.parse(data);
    data.entryid = entryid;

    console.log(JSON.stringify(data))

    dbManager.updateEntry(data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const deleteEntry = (entryid, callback) => {
    dbManager.deleteEntry(entryid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};


const saveComment = (entryid, data, callback) => {
    dbManager.saveComment(entryid, data)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};


const deleteComment = (entryid, commentid, callback) => {
    dbManager.removeComment(entryid, commentid)
    .then((res) => {
        sendResponse(200, res, callback);
    })
    .catch((err) => {
        console.log(err);
        sendResponse(500, err, callback);
    });
};

const sendResponse = (statusCode, message, callback) => {
    const res = {
        statusCode: statusCode,
        body: JSON.stringify(message)
    };
    callback(null, res);
};