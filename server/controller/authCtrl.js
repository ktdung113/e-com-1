import Users from "./../models/userModel.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";

const authCtrl = {
  createUser: asyncHandler(async (req, res) => {
    const { firstname, lastname, email, mobile, password } = req.body;
    const findUser = await Users.findOne({ email });
    if (!findUser) {
      const newUser = await Users.create({ firstname, lastname, email, mobile, password });
      res.status(200).json(newUser);
    } else {
      throw new Error(`${findUser.email} already exists.`);
    }
  }),

  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await Users.findOne({ email });
    if (findUser.isBlocked) {
      throw new Error(`${findUser.email} has been locked.`);
    }
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser.id);
      const updateUser = await Users.findByIdAndUpdate(findUser._id, { refreshToken: refreshToken }, { new: true });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        role: findUser.role,
        isBlocked: findUser.isBlocked,
        token: generateToken(findUser._id),
      });
    } else {
      throw new Error("Invalid Crendentials");
    }
  }),
};

export default authCtrl;
