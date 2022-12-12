import express from "express";
import productCategoryCtrl from "../controller/productCategoryCtrl.js";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(productCategoryCtrl.getAllProdCate)
  .post(authMiddle, isAdmin, productCategoryCtrl.createProductCate);

router
  .route("/:id")
  .get(productCategoryCtrl.getAProductCate)
  .put(authMiddle, isAdmin, productCategoryCtrl.updateProductCate)
  .delete(authMiddle, isAdmin, productCategoryCtrl.deleteProductCate);

export default router;
