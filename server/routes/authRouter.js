import express from "express";
import authCtrl from "./../controller/authCtrl.js";

const router = express.Router();

router.post("/register", authCtrl.createUser);
router.post("/login", authCtrl.loginUser);

export default router;
