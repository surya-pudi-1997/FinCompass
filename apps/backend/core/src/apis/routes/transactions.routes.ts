import { Router, Response, NextFunction } from "express";
import { TransactionsController } from "../controllers/transactions.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";
import { transactionValidation } from "../validations/transactions.validations";

const router: Router = Router();
const transactionsController = new TransactionsController();

router.get("/fetch", authenticate, (req: AuthenticatedRequest, res: Response) =>
  transactionsController.getTransactions(req, res)
);

router.get(
  "/fetch/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await transactionsController.getTransaction(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  authenticate,
  transactionValidation.create,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await transactionsController.createTransaction(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/edit/:id",
  authenticate,
  transactionValidation.update,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await transactionsController.updateTransaction(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:id",
  authenticate,
  (req: AuthenticatedRequest, res: Response) =>
    transactionsController.deleteTransaction(req, res)
);

export default router;
