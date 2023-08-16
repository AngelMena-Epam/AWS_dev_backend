import AWS from 'aws-sdk';
import uuid from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

module.exports.main = async() => {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const products = require('../resources/mockdata');
    for(item of products){
        let newId = uuid.v4()
        const product = {
            id: newId,
            title: item.title,
            description: item.description,
            price: item.price
        };
        const command_A = new PutCommand({
            TableName: "ProductsTable",
            Item: product
        });
        const command_B = new PutCommand({
            TableName: "StocksTable",
            Item: {
                id: newId,
                count: item.count
            }
        });
        const response_A = await docClient.send(command_A);
        console.log(response_A);
        const response_B = await docClient.send(command_B);
        console.log(response_B);

    }
}