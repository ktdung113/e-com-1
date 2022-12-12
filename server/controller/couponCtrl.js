import Coupons from "../models/couponModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDB.js";

const couponCtrl = {
  createCoupon: asyncHandler(async (req, res) => {
    try {
      const newCoupon = await Coupons.create(req.body);
      res.json(newCoupon);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllCoupon: asyncHandler(async (req, res) => {
    try {
      const coupons = await Coupons.find();
      res.json(coupons);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateCoupon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatecoupon = await Coupons.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatecoupon);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteCoupon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deletecoupon = await Coupons.findByIdAndDelete(id);
      res.json(deletecoupon);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default couponCtrl;
