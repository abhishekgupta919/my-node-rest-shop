define({ "api": [
  {
    "type": "get",
    "url": "/orders",
    "title": "List all Orders",
    "group": "Orders",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "tasks",
            "description": "<p>Order's list</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "_id",
            "description": "<p>Order id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n [{\n    \"count\": 1,\n    \"order\": [\n        {\n            \"_id\": \"5e1d87b86450a222290a6ed4\",\n            \"product\": {\n                \"_id\": \"5df8d6522a2ba33228379716\",\n                \"name\": \"Software Updatated\"\n            },\n            \"quantity\": 2,\n            \"request\": {\n                \"type\": \"GET\",\n                \"url\": \"http://localhost:3000/orders/5e1d87b86450a222290a6ed4\"\n            }\n        }\n    ]\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "List error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "/home/taction/my-node-rest-shop/api/routes/orders.js",
    "groupTitle": "Orders",
    "name": "GetOrders"
  }
] });
