import Products from "../models/productModel.js";
import Users from "../models/userModel.js";
import { validateMongoDbId } from "./../utils/validateMongoDB.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import fs from "fs";
import { cloudinaryUploadImg } from "./../utils/cloudinary.js";

const productCtrl = {
  createProduct: asyncHandler(async (req, res) => {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    try {
      const newProduct = await Products.create({
        ...req.body,
        title: req.body.title.toLowerCase(),
        category: req.body.category.toLowerCase(),
        brand: req.body.brand.toLowerCase(),
        color: req.body.color.toLowerCase(),
      });
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findProduct = await Products.findById(id);
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllProducts: asyncHandler(async (req, res) => {
    try {
      // Filtering
      const queryObj = { ...req.query };
      const excludeFiles = ["page", "sort", "limit", "fields"];
      excludeFiles.forEach((el) => delete queryObj[el]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

      //
      let query = Products.find(JSON.parse(queryStr.toLowerCase()));

      // Sorting
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // limiting the fields

      if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }

      // pagination

      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
      if (req.query.page) {
        const productCount = await Products.countDocuments();
        if (skip >= productCount) throw new Error("This Page does not exists");
      }
      const product = await query;
      res.json(product);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Products.findOneAndUpdate({ id }, req.body, { new: true });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const deleteProduct = await Products.findOneAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),

  addToWishList: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { productId } = req.body;
    validateMongoDbId(_id);
    validateMongoDbId(productId);
    try {
      const user = await Users.findById(_id);
      const alreadlyadded = user.wishlist.find((id) => id.toString() === productId.toString());

      if (alreadlyadded) {
        let user = await Users.findByIdAndUpdate(
          _id,
          {
            $pull: { wishlist: productId },
          },
          { new: true }
        );
        res.json(user);
      } else {
        let user = await Users.findByIdAndUpdate(
          _id,
          {
            $push: { wishlist: productId },
          },
          { new: true }
        );
        res.json(user);
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  rating: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, productId, comment } = req.body;
    try {
      const product = await Products.findById(productId);
      let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());

      if (alreadyRated) {
        const updateRating = await Products.updateOne(
          {
            ratings: { $elemMatch: alreadyRated },
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          },
          { new: true }
        );
        // res.json(updateRating);
      } else {
        const rateProduct = await Products.findByIdAndUpdate(
          productId,
          {
            $push: {
              ratings: { star: star, postedby: _id, comment: comment },
            },
          },
          { new: true }
        );
        // res.json(rateProduct);
      }
      const getAllRatings = await Products.findById(productId);
      let totalRating = getAllRatings.ratings.length;
      let ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);

      let actualRating = Math.round(ratingSum / totalRating);
      const finalproduct = await Products.findByIdAndUpdate(productId, { totalrating: actualRating }, { new: true });
      res.json(finalproduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
  uploadImages: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(req.files);

    try {
      const uploader = (path) => cloudinaryUploadImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newpath = await uploader(path);
        console.log(newpath);
        urls.push(newpath);
        fs.unlinkSync(path);
      }

      const findProduct = await Products.findByIdAndUpdate(
        id,
        {
          images: urls.map((file) => {
            return file;
          }),
        },
        {
          new: true,
        }
      );
      res.json(findProduct);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default productCtrl;
