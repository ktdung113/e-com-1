import express from "express";
import couponCtrl from "../controller/couponCtrl.js";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/", authMiddle, isAdmin).post(couponCtrl.createCoupon).get(couponCtrl.getAllCoupon);

router.route("/:id", authMiddle, isAdmin).put(couponCtrl.updateCoupon).delete(couponCtrl.deleteCoupon);

export default router;
