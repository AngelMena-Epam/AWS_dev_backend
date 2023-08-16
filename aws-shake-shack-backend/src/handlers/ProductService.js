const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const products = [
    {
      "count": 4,
      "description": "Sweet Watermelon",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
      "price": 10,
      "title": "Watermelon"
    },
    {
      "count": 6,
      "description": "Million Mango",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
      "price": 10,
      "title": "Mango"
    },
    {
      "count": 7,
      "description": "Kewl Kiwi",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
      "price": 10,
      "title": "Kiwi"
    },
    {
      "count": 12,
      "description": "Berry Mix: Strawberry/BlueBerry",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
      "price": 15,
      "title": "Strawberry/BlueBerry"
    },
    {
      "count": 7,
      "description": "Berry+Kiwi: Strawberry+BlueBerry+Kiwi",
      "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
      "price": 15,
      "title": "Strawberry/Kiwi"
    },
    {
      "count": 8,
      "description": "Ginger Lemon: Mint/Lemon/Ginger",
      "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
      "price": 20,
      "title": "Mint/Lemon/Ginger"
    },
    {
      "count": 2,
      "description": "Triple Threat: Strawberry/Orange/Mango",
      "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
      "price": 20,
      "title": "Strawberry/Orange/Mango"
    },
    {
      "count": 3,
      "description": "Milky Threat: Strawberry/Banana/Almond Milk",
      "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
      "price": 20,
      "title": "Strawberry/Banana/Oatmeal/Almond Milk"
    },
    {
      "count": 3,
      "description": "Dragonfruit Supreme",
      "id": "756abc4b-b1065c-45c5-9245-ec73c48a80a1",
      "price": 25,
      "title": "Dragonfruit"
    },
    {
        "count": 1,
        "description": "Golden Apple Deloitte",
        "id": "756wxy4b-b1015c-65c6-9665-ec66c48a66a1",
        "price": 25,
        "title": "Golden Apple"
    }
  ]  
  
  module.exports.getProductsList = async (event) => {
    const productResults = await dynamodb.scan({
      TableName: 'ProductsTable'
    }).promise();
    const stockResults = await dynamodb.scan({
      TableName: 'StocksTable'
    }).promise();

    const result = productResults.Items?.map(
      p1 => ({
        ...stockResults.Items?.find((p2)=> (p2.product_id == p1.id) && p2),
        ...p1
      })
    );
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
      },
      body: await JSON.stringify(result),
    };
  };
  
  module.exports.getProductById = async (event) => {
    const id = event.pathParameters.productId;
    const products_params = {
      TableName: "ProductsTable",
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: { ':id': id }
    };
    const product = await dynamodb.query(products_params).promise()
    
    const stock_params = {
      TableName: "StocksTable",
      KeyConditionExpression: 'product_id = :id',
      ExpressionAttributeValues: { ':id': id }
    };
    const stock = await dynamodb.query(stock_params).promise()
    const result = {...product.Items[0], ...stock.Items[0]}

    if (!product) {
      return {
        statusCode: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
        },
        body: JSON.stringify({ error: 'Product not found' })
      };
    }
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
      },
      body: JSON.stringify(result)
    };
  };
  
module.exports.createProduct = async (event, context) => {
    const { title, description, price } = JSON.parse(event.body);

    const product = {
        id: uuid.v4(),
        title,
        description,
        price
    };

    await dynamodb.put({
        TableName: 'ProductsTable',
        Item: product
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify(product),
    };
  } 