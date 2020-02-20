const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product'); 

router.get('/',(req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(doc => {
        const response ={
            count: doc.length,
            products: doc.map(doc => {
                return{
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+ doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.post('/',(req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product Successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => console.log(err));
});

router.get('/:productId',(req, res, next) => {
       const id = req.params.productId;
       Product.findById(id)
       .select('name price _id')
       .exec()
       .then(doc => {
           if(doc){
                res.status(200).json({
                    product:doc,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
           }else{
            res.status(404).json({message:'No valid entry found for provided ID'});
           }  
       })
       .catch(err => {
           console.log(err);
           res.status(500).json({error: err});
        });
});
 
router.patch('/:productId',(req, res, next) => {
    const id = req.params.productId;
    const updateOpt = {};
    for(const ops of req.body){
        updateOpt[ops.propName] = ops.value;
    }
   Product.update({_id: id},{$set: updateOpt})
   .exec()
   .then(result => {
       console.log(result);
       res.status(200).json({
           message:'Product Updated !',
           request:{
               type:'GET',
               url: 'http://localhost:3000/products/' + id
           }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({error:err});
   });
});
 
router.delete('/:productId',(req, res, next) => {
   const id = req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result => {
       res.status(200).json({
           message:'Product Deleted !',
           request:{
               type:'POST',
               url:'http://localhost:3000/products/',
               body:{name:'String', price:'Number'}
           }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({error:err});
   });

});


module.exports = router;