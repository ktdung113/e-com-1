import express from "express";
import blogCategoryCtrl from "../controller/blogCategoryCtrl.js";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(blogCategoryCtrl.getAllProdCate).post(authMiddle, isAdmin, blogCategoryCtrl.createBlogCate);

router
  .route("/:id")
  .get(blogCategoryCtrl.getABlogCate)
  .put(authMiddle, isAdmin, blogCategoryCtrl.updateBlogCate)
  .delete(authMiddle, isAdmin, blogCategoryCtrl.deleteBlogCate);

export default router;
