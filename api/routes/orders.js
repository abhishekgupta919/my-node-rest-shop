const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

/**
 * @api {get} /orders List all Orders
 * @apiGroup Orders
 * @apiSuccess {Number} count Order's count
 * @apiSuccess {Number} _id Order id
 * @apiSuccessExample {json} Success
 * @apiVersion 0.2.0
 *    HTTP/1.1 200 OK
 [{
    "count": 1,
    "order": [
        {
            "_id": "5e1d87b86450a222290a6ed4",
            "product": {
                "_id": "5df8d6522a2ba33228379716",
                "name": "Software Updatated"
            },
            "quantity": 2,
            "request": {
                "type": "GET",
                "url": "http://localhost:3000/orders/5e1d87b86450a222290a6ed4"
            }
        }
    ]
}]
 * @apiErrorExample {json} Order error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/',(req, res, next) => {
    Order.find()
    .select('product quantity __id')
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            order: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/'+ doc._id,
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});
 
router.post('/',(req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: 'product not found'
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
    .then(result => { 
        console.log(result);
        res.status(201).json({
            message: 'Order Stored !',
            createdOrder:{
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request:{
                type: 'GET',
                url:'http://localhost:3000/orders/'+ result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:orderId',(req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .populate('product')
    .exec()
    .then(order => {
        if( !order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        console.log(order);
        res.status(200).json({
            order: order,
            request:{
                type: 'GET',
                url:'http://localhost:3000/orders/'
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:orderId',(req, res, next) => {
    const id = req.params.orderId;
    const updateOpt = {};
    for(const ops of req.body){
        updateOpt[ops.propName] = ops.value;
    }
    Order.update({_id: id},{$set: updateOpt})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.delete('/:orderId',(req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id:id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type: 'PODT',
                url:'http://localhost:3000/orders/',
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;