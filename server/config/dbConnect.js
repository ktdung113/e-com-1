import mongoose from "mongoose";

const connectDB = () => {
  try {
    const URL = process.env.MONG0_URL;
    mongoose.connect(URL);
    console.log("=>Connect success mongoDB.");
  } catch (error) {
    console.log("-->Error connect db." + error);
  }
};

export default connectDB;
