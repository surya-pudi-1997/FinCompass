import { Router, Request, Response, NextFunction } from "express";
import { AccountsController } from "../controllers/accounts.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { accountValidation } from "../validations/accounts.validation";

const router: Router = Router();
const accountsController = new AccountsController();

// Protected routes - all routes require authentication
router.get("/fetch", authenticate, (req: AuthenticatedRequest, res: Response) =>
  accountsController.getAccounts(req, res)
);

router.get(
  "/fetch/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await accountsController.getAccount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  authenticate,
  accountValidation.create,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await accountsController.createAccount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/edit/:id",
  authenticate,
  accountValidation.update,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await accountsController.updateAccount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) =>
    accountsController.deleteAccount(req, res)
);

export default router;
