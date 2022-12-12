import express from "express";
import blogCtrl from "../controller/blogCtrl.js";
import { authMiddle, isAdmin } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(blogCtrl.getAllBlogs).post(authMiddle, isAdmin, blogCtrl.createBlog);
router.put("/likes", authMiddle, blogCtrl.likeBlog);
router.put("/dislikes", authMiddle, blogCtrl.disLikeBlog);

router
  .route("/:id")
  .get(blogCtrl.getABlog)
  .put(authMiddle, isAdmin, blogCtrl.updateBlog)
  .delete(authMiddle, isAdmin, blogCtrl.deleteBlog);

export default router;
