import { Router, Response, NextFunction } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { categoryValidation } from "../validations/categories.validation";

const router: Router = Router();
const categoriesController = new CategoriesController();

// Protected routes - all routes require authentication
router.get("/fetch", authenticate, (req: AuthenticatedRequest, res: Response) =>
  categoriesController.getCategories(req, res)
);

router.get(
  "/fetch/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await categoriesController.getCategory(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  authenticate,
  categoryValidation.create,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await categoriesController.createCategory(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/edit/:id",
  authenticate,
  categoryValidation.update,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await categoriesController.updateCategory(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) =>
    categoriesController.deleteCategory(req, res)
);

export default router;
