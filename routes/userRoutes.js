import express from "express";
import {updateUserController } from "../controllers/userController.js";
import userAuth  from "../middlewares/authMiddleware.js";

// router objct
const router = express.Router();

// routes 
// get users  || get

// update user || put
router.put("/update-user",userAuth,updateUserController);

export default router;
