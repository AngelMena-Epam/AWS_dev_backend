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
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
      },
      body: await JSON.stringify(products),
    };
  };
  
  module.exports.getProductsById = async (event) => {
    const productId = event.pathParameters.productId;
    const product = products.find(p => p.id == productId);
  
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
      body: JSON.stringify(product)
    };
  };
  