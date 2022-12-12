import express from "express";
import brandCtrl from "../controller/brandCtrl.js";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(brandCtrl.getAllBrand).post(authMiddle, isAdmin, brandCtrl.createBand);

router
  .route("/:id")
  .get(brandCtrl.getABrand)
  .put(authMiddle, isAdmin, brandCtrl.updateBrand)
  .delete(authMiddle, isAdmin, brandCtrl.deleteBrand);

export default router;
