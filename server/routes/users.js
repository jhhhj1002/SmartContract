const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { auth } = require("../middleware/auth");
const { Payment } = require('../models/Payment');

const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
        upload: req.user.upload,
        wallet: req.user.wallet
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});


router.post("/update", (req, res) => {

    console.log(req.body)

    User.findOneAndUpdate({ _id: req.body.id },
        {
            $set: {
                name : req.body.name,
                email : req.body.email,
                wallet : req.body.wallet
            }
        },
        (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});





router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


router.post("/updateUserUploadInfo", auth, (req, res) => { // Product upload시 Mongo DB User의 upload에 추가
    console.log("upload에 추가할 user", req.user._id);
    console.log("upload에 추가할 productid", req.body.productId);

    User.findOne({ _id: req.user._id }, (err, userInfo) => {

            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        upload: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json({success:true})
                }
            )
     })

});

router.get('/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, userInfo) => {
        let duplicate = false;

        console.log("user 정보",userInfo)

        userInfo.cart.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })


        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.query.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.query.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, userInfo) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(userInfo.cart)
                }
            )
        }
    })
});


router.get('/removeFromCart', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query._id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    return res.status(200).json({
                        cartDetail,
                        cart
                    })
                })
        }
    )
})


router.get('/userCartInfo', auth, (req, res) => { 
    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })


            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .exec((err, cartDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, cartDetail, cart })
                })

        }
    )
})



router.post('/userUploadInfo', auth, (req, res) => { // User의 upload목록 Mypage에 가지고옴
    let order = "desc";
    let sortBy = "_id";

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "sort") {
                if(req.body.filters[key] !=0 ){
                    sortBy = "price"
                    if(req.body.filters[key]==2)
                        order = "asc"
                }
            }
        }
    }
    

    console.log("정렬기준 : " + sortBy)

    User.findOne(
        { _id: req.user._id },
        (err, userInfo) => {
            let upload = userInfo.upload;
            let array = upload.map(item => {
                console.log("/userUploadInfo upload목록",item.id)
                return item.id
            })


            Product.find({ '_id': { $in: array } })
                .populate('writer')
                .sort([[sortBy, order]])
                .exec((err, uploadDetail) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({ success: true, products : uploadDetail, postSize: uploadDetail.length })
                })

        }
    )
})




router.post('/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {};

    //1.Put brief Payment Information inside User Collection 
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2.Put Payment Information that come from Paypal into Payment Collection 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history


    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err });


            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });

                //3. Increase the amount of number for the sold information 

                //first We need to know how many product were sold in this transaction for 
                // each of products

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })

                // first Item    quantity 2
                // second Item  quantity 3

                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })

            })
        }
    )
})


router.get('/getHistory', auth, (req, res) => {
    User.findOne(
        { _id: req.user._id },
        (err, doc) => {
            let history = doc.history;
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, history })
        }
    )
})

router.post('/addtoupload', auth, (req, res) => {
    User.findOne({_id: req.user._id}, (err, userInfo)=>{
        User.findByIdAndUpdate({ _id:req.user._id},{
            $push: {
                upload: {
                    id: req.body.productId
                }
            }
        },
            {new:true},
            (err, userInfo) => {
                if(err) return res.status(400).json({success : false, err})
                res.status(200).send(userInfo.upload)
            })
    })
})

module.exports = router;