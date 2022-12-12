import Users from "./../models/userModel.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateMongoDbId } from "../utils/validateMongoDB.js";
import sendEmail from "./emailCtrl.js";

const userCtrl = {
  // admin
  getAllUsers: asyncHandler(async (req, res) => {
    try {
      const getUsers = await Users.find().select("-password");
      res.json(getUsers);
    } catch (error) {
      throw new Error(error);
    }
  }),
  getAUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const getUser = await Users.findById(_id);
      res.json({ getUser });
    } catch (error) {
      throw new Error(error);
    }
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const findUser = await Users.findById(id);
      if (!findUser) return res.status(404).json({ message: "This user does not exists." });
      const deleteUser = await Users.findByIdAndDelete(req.params.id);
      res.json({ deleteUser, message: "Delete User success." });
    } catch (error) {
      throw new Error(error);
    }
  }),
  blockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
      const blockUser = await Users.findByIdAndUpdate(
        id,
        {
          isBlocked: true,
        },
        { new: true }
      );
      res.json({ message: "User blocked success." });
    } catch (error) {
      throw new Error(error);
    }
  }),
  unBlockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const unBlockUser = await Users.findByIdAndUpdate(
        id,
        {
          isBlocked: false,
        },
        { new: true }
      );
      res.json({ message: "User un-blocked success." });
    } catch (error) {
      throw new Error(error);
    }
  }),
  // user
  updateUser: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
      const updateUser = await Users.findByIdAndUpdate(
        _id,
        {
          firstname: req?.body?.firstname,
          lastname: req?.body?.lastname,
          mobile: req?.body?.mobile,
        },
        { new: true }
      );
      res.json(updateUser);
    } catch (error) {
      throw new Error(error);
    }
  }),
  // refresh token
  refreshToken: asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No refresh Token in Cookies.");

    const refreshToken = cookie.refreshToken;
    const user = await Users.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh token present in database or not found.");

    jwt.verify(refreshToken, process.env.JWT_TOKEN, (err, decoded) => {
      if (err || user.id !== decoded.id) throw new Error("There is something wrong with refresh token.");
      const accessToken = generateToken(user.id);
      res.json({ accessToken });
    });
  }),
  logout: asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No refresh Token in Cookies.");

    const refreshToken = cookie.refreshToken;
    const user = await Users.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204); // forbiden
    }

    await Users.findOneAndUpdate({ refreshToken }, { refreshToken: "" }, { new: true });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbiden
  }),
  updatePassword: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    const { password } = req.body;
    const user = await Users.findById(_id);
    if (password) {
      user.password = password;
      const updatePassword = await user.save();
      res.json(updatePassword);
    } else {
      res.json(user);
    }
  }),
  forgotPasswordToken: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (!user) throw new Error(`User not found with ${email}`);

    try {
      const token = await user.createPasswordResetToken();
      await user.save();

      const resetURL = `Hi, Please follow this link to reset Your Password. 
        This link is valid till 10 minutes from now. 
        <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
      const data = {
        to: email,
        subject: "Forgot password ?",
        text: `Hey ${user.firstname} ${user.lastname}`,
        html: resetURL,
      };

      sendEmail(data, req, res);
      // sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default userCtrl;
