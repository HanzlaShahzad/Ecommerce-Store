import express from "express";
import { UserController, GetUsers, Signin } from "../Controller/UserController.js";
import uploads from "../Multer/uploadFiles.js";
import { deleteProduct, deletedProduct, GetProducts, inActiveProduct, ProductController, UpdateProduct } from "../Controller/productController.js";
import VerifyEmail from "../Controller/verifyEmail.js";
import { ResendVerificationEmail } from "../Utils/resendVerificationEmail.js";
import createCheckoutSession, { getCheckoutSessionStatus } from "../Controller/CreateCheckoutSession.js";
import { getMyOrders, getUserOrders, getOneOrder, OrderController, totalOrders, deleteOrders } from "../Controller/orderController.js";
import AuthMiddleware from "../Services/AuthMiddleware.js";
import isAdmin from "../isAdmin.js";
const router = express.Router();

//Get
router.get("/products", GetProducts);
router.delete("/products/:id", AuthMiddleware, isAdmin, deleteProduct);
router.get("/verify-email/:token", VerifyEmail);
router.get("/users", AuthMiddleware, isAdmin, GetUsers);
router.get("/users/:id/orders", AuthMiddleware, isAdmin, getUserOrders);
router.get("/totalOrders", AuthMiddleware, isAdmin, totalOrders);
router.get("/myOrders", AuthMiddleware, getMyOrders);
router.get("/specificOrder/:id", AuthMiddleware, isAdmin, getOneOrder);
//Post
router.post("/create-orders", AuthMiddleware, OrderController);
router.post("/resend-verification", ResendVerificationEmail);
router.post("/signup", UserController);
router.post("/signin", Signin);
router.post("/createProducts", AuthMiddleware, isAdmin, uploads.single("image"), ProductController);
router.post("/create-checkout-session", AuthMiddleware, createCheckoutSession);
router.get("/checkout-session/:sessionId", AuthMiddleware, getCheckoutSessionStatus);
//Patch
router.patch("/deletedProduct/:id", AuthMiddleware, isAdmin, deletedProduct);
router.patch("/inActive/:id", AuthMiddleware, isAdmin, inActiveProduct);
router.patch("/updateProducts", AuthMiddleware, isAdmin, uploads.single("image"), UpdateProduct);
//Delete
router.delete("/deleteOrder/:id", AuthMiddleware, isAdmin, deleteOrders);

export default router;