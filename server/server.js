import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import connectDB from "./config/dbConnect.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import productCategoryRouter from "./routes/productCategoryRouter.js";

import blogRouter from "./routes/blogRouter.js";
import blogCategoryRouter from "./routes/blogCategoryRouter.js";

import brandRouter from "./routes/brandRouter.js";
import couponRouter from "./routes/couponRouter.js";
import { errorrHandle, notFound } from "./middlewares/errorHandle.js";
dotenv.config();

// connect mongodb
connectDB();
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/user", userRouter);

app.use("/api/product", productRouter);
app.use("/api/prodcategory", productCategoryRouter);
app.use("/api/blog", blogRouter);
app.use("/api/blogcategory", blogCategoryRouter);

app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorrHandle);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=>Server is running on port: ${PORT}`);
});
