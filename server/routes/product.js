const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const multer = require('multer');

const { auth } = require("../middleware/auth");

var storage = multer.diskStorage({
    destination: (req, file, cb) => { // 파일이 어디에 저장이 되는지
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`) //파일을 어떤이름으로 저장할 것인지
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")


//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => { // 가져온 이미지 저장하는 부분

    upload(req, res, err => {
        if (err) {
            console.log(err)
            return res.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })

});


router.post("/uploadProduct", auth, (req, res) => {
    console.log("writer body", req.body)
    //save all the data we got from the client into the DB 
    const product = new Product(req.body)

    product.save((err) => {
        console.log("product의 id = " + product._id)
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true, productId: product._id })
    })

});


router.post("/getActiveProducts", (req, res) => { // active한 상품만 가지고 오기 

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
   
    }

    if (term) {
        Product.find(findArgs)
            .find({ active :true })
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    } else {
        Product.find(findArgs)
            .find({ active : true })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    }

});



router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if (term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    }

});

//EditProduct.js 수정한 상품정보 update
router.post("/editProduct", auth, (req, res) => {
    console.log("editproduct안 ", req.body)
    Product.findOneAndUpdate({_id: req.body.id},{
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            images: req.body.images,
            continents: req.body.continents,
        
    }, { new: true }).then(function () {
        console.log("product edited");
    }).catch(function (error) {
        console.log(error);
    })
});

/*Mypage.js item 리무브*/
router.get("/deleteItem", auth, (req, res) => {
    console.log("/deleteItem req.query", req.query)
    let productId = req.query.id

    Product.deleteOne({ _id: productId }).then(function () {
        console.log("Data deleted"); // Success 
    }).catch(function (error) {
        console.log(error); // Failure 
    })
    //user의 upload의 상품정보 & cart 상품정보 삭제
    ,User.findOne({ _id: productId }, (err, userInfo) => {
        console.log("upload삭제하기위해 필요한 userid", req.user._id)
        User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $pull: {
                    upload: {
                        id: productId
                    },
                    cart: {
                        id: productId
                    }
                }
            },
            { new: true }
        ).then(function () {
            console.log("upload element deleted");
        }).catch(function (error) {
            console.log(error);
        })
    })
});

//?id=${productId}&type=single
//id=12121212,121212,1212121   type=array 
router.get("/products_by_id", (req, res) => {
    let type = req.query.type
    let productIds = req.query.id

    console.log("/products_by_id: req.query.id", req.query.id)

    if (type === "array") {
        let ids = req.query.id.split(',');
        productIds = [];
        productIds = ids.map(item => {
            return item
        })
    }

    //we need to find the product information that belong to product Id 
    Product.find({ '_id': { $in: productIds } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
});

module.exports = router;