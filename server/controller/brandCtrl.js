import Brands from "../models/brandModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDB.js";

const brandCtrl = {
  createBand: asyncHandler(async (req, res) => {
    try {
      const newBrand = await Brands.create(req.body);
      res.json(newBrand);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateBrand: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateBrand = await Brands.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updateBrand);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteBrand: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteBrand = await Brands.findByIdAndDelete(id);
      res.json(deleteBrand);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllBrand: asyncHandler(async (req, res) => {
    try {
      const getAllBrands = await Brands.find();
      res.json(getAllBrands);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getABrand: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getABrand = await Brands.findById(id);
      res.json(getABrand);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default brandCtrl;
