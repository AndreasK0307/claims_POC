import express, { Request, Response } from "npm:express";
import { join } from "jsr:@std/path";
import { config as pathConfig } from "../config/config.ts";
import { AdjusterController } from "../controllers/adjusterController.ts";

export class AdjusterRouter {
  public router: express.Router;
  public adjusterController;
  constructor() {
    this.router = express.Router();
    this.adjusterController = new AdjusterController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (_req: Request, res: Response) => {
      return res.sendFile(join(pathConfig.dirname, "..", "views", "adjusterview.html"));
    });
    this.router.get("/claims", this.handleShowClaims.bind(this));
    this.router.get("/claims/:id", this.adjusterController.getClaimsByClaimId);
    this.router.get(
      "/claims/:id/details",
      this.adjusterController.getDetailsByClaimId,
    );
    this.router.put(
      "/claims/:id/reviews",
      this.adjusterController.handleReviewClaim,
    );
    this.router.get(
      "/claims/:id/payments",
      this.adjusterController.getPaymentsByClaimId,
    );
    this.router.post(
      "/claims/:id/payments",
      this.adjusterController.createPayment,
    );
  }

  private async handleShowClaims(req: Request, res: Response): Promise<void> {
    try {
      const { filter, val } = req.query;

      // Validate required parameters
      if (!filter || !val) {
        return await this.adjusterController.getClaimsByAdjusterUserId(
          req,
          res,
        );
      }

      // Validate and handle different filter types
      switch (filter) {
        case "status":
          return await this.adjusterController.getClaimsByStatus(req, res);
        case "reviewlvl":
          return await this.adjusterController.getClaimsByReviewLevel(req, res);
        default:
          return res.status(400).json({
            error: "Invalid filter type",
            validFilters: [
              "adjuster",
              "status",
              "reviewlvl",
            ],
          });
      }
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error
          ? error.message
          : "Unknown error occurred",
      });
    }
  }
}
