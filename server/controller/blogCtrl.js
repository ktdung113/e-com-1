import Blogs from "../models/blogModel.js";
import Users from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { validateMongoDbId } from "../utils/validateMongoDB.js";

const blogCtrl = {
  createBlog: asyncHandler(async (req, res) => {
    try {
      const newBlog = await Blogs.create(req.body);
      res.json(newBlog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAllBlogs: asyncHandler(async (req, res) => {
    try {
      const getAllBlogs = await Blogs.find();
      res.json(getAllBlogs);
    } catch (error) {
      throw new Error(error);
    }
  }),
  updateBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updateBlog = await Blogs.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updateBlog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteBlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const deleteBlog = await Blogs.findByIdAndDelete(id);
      res.json(deleteBlog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getABlog: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const getABlog = await Blogs.findById(id).populate("likes").populate("dislikes");
      // $inc: tang len 1
      const updateView = await Blogs.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });

      res.json(getABlog);
    } catch (error) {
      throw new Error(error);
    }
  }),
  likeBlog: asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    try {
      const blog = await Blogs.findById(blogId);
      // find user want like blog
      const loginUserId = req.user._id;
      // find if the user has liked the blog
      const isLike = blog.isLiked;

      // find if the user has disliked the blog
      const alreadyDisliked = blog.dislikes.find((userId) => userId.toString() === loginUserId.toString());
      if (alreadyDisliked) {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
        res.json(blog);
      }

      if (isLike) {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
        res.json(blog);
      } else {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $push: { likes: loginUserId },
            isLiked: true,
          },
          { new: true }
        );
        res.json(blog);
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
  disLikeBlog: asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    try {
      const blog = await Blogs.findById(blogId);
      // find user want dislike blog
      const loginUserId = req.user._id;
      // find if the user has disliked the blog
      const isDisLike = blog.isDisliked;

      // find if the user has disliked the blog
      const alreadyLiked = blog.likes.find((userId) => userId.toString() === loginUserId.toString());
      if (alreadyLiked) {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
        res.json(blog);
      }

      if (isDisLike) {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
          },
          { new: true }
        );
        res.json(blog);
      } else {
        const blog = await Blogs.findByIdAndUpdate(
          blogId,
          {
            $push: { dislikes: loginUserId },
            isDisliked: true,
          },
          { new: true }
        );
        res.json(blog);
      }
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default blogCtrl;
