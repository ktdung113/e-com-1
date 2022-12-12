import express from "express";
import productCtrl from "../controller/productCtrl.js";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewares/uploadImage.js";

const router = express.Router();

router.route("/").get(productCtrl.getAllProducts).post(authMiddle, isAdmin, productCtrl.createProduct);
router.put("/wishlist", authMiddle, productCtrl.addToWishList);
router.put("/rating", authMiddle, productCtrl.rating);

router.put(
  "/upload/:id",
  authMiddle,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  productCtrl.uploadImages
);
router
  .route("/:id")
  .get(productCtrl.getProduct)
  .put(authMiddle, isAdmin, productCtrl.updateProduct)
  .delete(authMiddle, isAdmin, productCtrl.deleteProduct);

export default router;
