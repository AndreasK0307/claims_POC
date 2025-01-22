import express, { Request, Response } from "npm:express";
import { join } from "jsr:@std/path";
import { config as pathConfig } from "../config/config.ts";
import { UserController } from "../controllers/userController.ts";

export class UserRouter {
  public router: express.Router;
  public userController;
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (_req: Request, res: Response) => {
      return res.sendFile(join(pathConfig.dirname, "..", "views", "userview.html"));
    });
    this.router.get("/claims", this.userController.getClaimsByEmployeeUserId);
    this.router.post("/claims", this.userController.addClaim);
    this.router.put("/claims/:id", this.userController.handleEditClaim);
    this.router.delete(
      "/claims/:id",
      this.userController.handleHardDeleteClaim,
    );
    this.router.get(
      "/claims/:id/payments",
      this.userController.getPaymentsByClaimId,
    );
    this.router.get(
      "/claims/:id/documents",
      this.userController.getDocumentsByClaimId,
    );
    this.router.get(
      "/claims/:id/items",
      this.userController.getClaimItemsByClaimId,
    );
    // this.router.get("/payments", this.userController.getPaymentsByEmployeeId);
  }
}
