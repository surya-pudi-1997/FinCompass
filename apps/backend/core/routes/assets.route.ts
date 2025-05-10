import { Router, Response, NextFunction } from "express";
import { AssetsController } from "../controllers/assets.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { assetValidation } from "../validations/assets.validation";

const router: Router = Router();
const assetsController = new AssetsController();

// Protected routes - all routes require authentication
router.get("/fetch", authenticate, (req: AuthenticatedRequest, res: Response) =>
  assetsController.getAssets(req, res)
);

router.get(
  "/fetch/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await assetsController.getAsset(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  authenticate,
  assetValidation.create,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await assetsController.createAsset(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/edit/:id",
  authenticate,
  assetValidation.update,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await assetsController.updateAsset(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) =>
    assetsController.deleteAsset(req, res)
);

export default router;
