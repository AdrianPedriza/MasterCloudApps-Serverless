const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();
const table = 'entries';

const getAllEntries = () => {
    const params = {
        TableName: table
    };

    return docClient.scan(params).promise();
};

const getEntry = (id) => {
    const params = {
        TableName: table,
        Key: {
            "entryid": id
        }
    };
    return docClient.get(params).promise();
}

const saveEntry = (entry) => {
    const params = {
        TableName: table,
        Item: {
            "entryid": uuid.v1(),
            "name": entry.name,
            "nickname": entry.nickname,
            "title": entry.title,
            "text": entry.text,
            "comments": {}
        }
    };

    return docClient.put(params).promise();
}

const deleteEntry = (entryid) => {
    const params = {
        TableName: table,
        Key: {
            "entryid": entryid
        },
        ConditionExpression: "entryid = :entryid",
        ExpressionAttributeValues: {
            ":entryid": entryid
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was deleted
    };

    return docClient.delete(params).promise();

}

const updateEntry = (entry) => {
    const params = {
        TableName: table,
        Key: {
            "entryid": entry.entryid
        },
        UpdateExpression: "set #name = :a, nickname = :n, title = :t1, #content = :content, comments = :c",
        ExpressionAttributeNames: {
            "#content": 'content',
            "#name": 'name'
        },
        ExpressionAttributeValues: {
            ":a": entry.name,
            ":n": entry.nickname,
            ":t1": entry.title,
            ":content": entry.content,
            ":c": entry.comments
        },
        ReturnValues: "ALL_OLD" // Returns the item content before it was updated
    };

    return docClient.update(params).promise();
}

const saveComment = (entryid, comment) => {
    const params = {
        TableName: table,
        Key: {
            "entryid": entryid
        },
        UpdateExpression: 'set comments.#commentid = :comment',
        ExpressionAttributeNames: {
            "#commentid": uuid.v1()
        },
        ExpressionAttributeValues: {
            ":comment": JSON.parse(comment)
        },
        ReturnValues: "UPDATED_NEW"
    };

    return docClient.update(params).promise();
}

const removeComment = (entryid, commentid) => {
    const params = {
        TableName: table,
        Key: {
            "entryid": entryid
        },
        UpdateExpression: "remove comments.#commentid",
        ExpressionAttributeNames: {
            "#commentid": commentid
        },
        ReturnValues: "UPDATED_NEW"
    };

    return docClient.update(params).promise();

}

var getTodayDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

module.exports = {
    getAllEntries,
    getEntry,
    saveEntry,
    deleteEntry,
    updateEntry,
    saveComment,
    removeComment
};