import BlogCategories from "../models/blogCategoryModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDB.js";

const blogCategoryCtrl = {
  createBlogCate: asyncHandler(async (req, res) => {
    try {
      const newCategory = await BlogCategories.create(req.body);
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateBlogCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateProdCate = await BlogCategories.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updateProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteBlogCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteProdCate = await BlogCategories.findByIdAndDelete(id);
      res.json(deleteProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllProdCate: asyncHandler(async (req, res) => {
    try {
      const getAllProdCate = await BlogCategories.find();
      res.json(getAllProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getABlogCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getAProdCate = await BlogCategories.findById(id);
      res.json(getAProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default blogCategoryCtrl;
