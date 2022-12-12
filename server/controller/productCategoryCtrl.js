import ProductCategories from "../models/prodCategoryModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDB.js";

const productCategoryCtrl = {
  createProductCate: asyncHandler(async (req, res) => {
    try {
      const newCategory = await ProductCategories.create(req.body);
      res.json(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateProductCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateProdCate = await ProductCategories.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updateProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteProductCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteProdCate = await ProductCategories.findByIdAndDelete(id);
      res.json(deleteProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllProdCate: asyncHandler(async (req, res) => {
    try {
      const getAllProdCate = await ProductCategories.find();
      res.json(getAllProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAProductCate: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getAProdCate = await ProductCategories.findById(id);
      res.json(getAProdCate);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default productCategoryCtrl;
