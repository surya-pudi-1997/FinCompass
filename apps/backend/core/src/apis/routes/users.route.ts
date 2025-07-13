import express, { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/users.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { userValidation } from "../validations/user.validation";

const router: Router = express.Router();
const userController = new UserController();

// Public routes
router.post(
  "/register",
  userValidation.signup,
  (req: Request, res: Response, next: NextFunction) =>
    void userController.signup(req, res)
);
router.post(
  "/login",
  userValidation.login,
  (req: Request, res: Response, next: NextFunction) =>
    void userController.login(req, res)
);
router.get(
  "/all",
  (req: Request, res: Response, next: NextFunction) =>
    void userController.getAllUsers(req, res)
);

// Protected routes - require authentication
router.get(
  "/fetch",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    void userController.getProfile(req as AuthenticatedRequest, res)
);

router.put(
  "/edit",
  authenticate,
  userValidation.update,
  (req: Request, res: Response, next: NextFunction) =>
    void userController.updateProfile(req as AuthenticatedRequest, res)
);

router.delete(
  "/remove/:id",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    void userController.deleteAccount(req as AuthenticatedRequest, res)
);

export default router;
