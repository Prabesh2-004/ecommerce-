import express from 'express';
import upload from '../middleware/multer.js';
import { v2 as cloudinary } from 'cloudinary';
import productModel from '../model/product.model.js';
import jwt from 'jsonwebtoken';
import adminAuth from '../middleware/admin.middleware.js';

const router = express.Router();

router.post(
  '/create', adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        category,
        subCategory,
        sizes,
        bestSeller,
      } = req.body;
      const image1 = req.files.image1?.[0];
      const image2 = req.files.image2?.[0];
      const image3 = req.files.image3?.[0];
      const image4 = req.files.image4?.[0];

      const images = [image1, image2, image3, image4].filter(
        (item) => item !== undefined
      );

      const imageURL = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image',
          });
          return result.secure_url;
        })
      );

      const productData = {
        title,
        description,
        price: Number(price),
        category,
        subCategory,
        sizes: req.body["sizes[]"] || req.body.sizes,
        bestSeller: bestSeller === "true" ? true : false,
        image: imageURL,
        date: Date.now()
      };

      const product = new productModel(productData);
      await product.save();

      res.json({success: true, message: 'Product Added'});

      res.json({});
    } catch (error) {
      console.error(error.message);
      res.json({ success: false, message: error.message });
    }
  }
);
router.get('/', async (req,res) => {
    try {
        const products = await productModel.find({});
        res.json({success: true, products})
    } catch (error) {
        console.error(error.message);
        res.json({success:false, message:error.message})
        
    }
})

router.delete('/:id', adminAuth,async (req,res) => {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.json({success: true, message: 'successfully deleted'})
    } catch (error) {
        console.error(error.message);
        res.json({message: 'Failed to delete', success: false})
    }
});

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id)
        res.json({success: true, product});
    } catch (error) {
        console.error(error.message);
        res.json({message: 'Failed to fetch single data', success: false})
    }
})

router.post('/admin', (req,res) => {
    try {
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else{
            res.json({success:false, message: 'invalid credential'})
        }
    } catch (error) {
        console.error(error.message);
        res.json({message: 'Error while login to admin', success: false})
    }
})

export default router;
