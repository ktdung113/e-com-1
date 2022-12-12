import express from "express";
import { authMiddle, isAdmin } from "../middlewares/authMiddleware.js";
import userCtrl from "./../controller/userCtrl.js";

const router = express.Router();

router.get("/refresh", authMiddle, userCtrl.refreshToken);
router.get("/logout", userCtrl.logout);
router.post("/forgot-password-token", userCtrl.forgotPasswordToken);

router.put("/edit-user", authMiddle, userCtrl.updateUser);
router.put("/password", authMiddle, userCtrl.updatePassword);

router.get("/all-users", authMiddle, isAdmin, userCtrl.getAllUsers);
router.route("/:id", authMiddle, isAdmin).get(userCtrl.getAUser).delete(userCtrl.deleteUser);

router.put("/block-user/:id", authMiddle, isAdmin, userCtrl.blockUser);
router.put("/unblock-user/:id", authMiddle, isAdmin, userCtrl.unBlockUser);

export default router;
