import express, { Request, Response } from "express";
import { join } from "jsr:@std/path";
import { config as pathConfig } from "../config/config.ts";
import { AdminController } from "../controllers/adminController.ts";

export class AdminRouter {
  public router: express.Router;
  public adminController: AdminController;

  constructor() {
    this.router = express.Router();
    this.adminController = new AdminController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (_req: Request, res: Response) => {
      return res.sendFile(join(pathConfig.dirname, "..", "views", "adminview.html"));
    });
    this.router.post("/register", this.adminController.addNewUserAndEmployee);
    this.router.get("/claims", this.handleShowClaims.bind(this));
    this.router.delete(
      "/claims/:id",
      this.adminController.handleSoftDeleteClaim,
    );
    this.router.get("/users", this.handleShowUsers.bind(this));
    this.router.put("/users/:id", this.adminController.handleUpdateUser);
    this.router.delete("/users/:id", this.handleDeleteUsers.bind(this));
    this.router.get("/employees", this.adminController.getAllEmployees);
    this.router.get("/employees/:id", this.adminController.getEmployeeById);
    this.router.put(
      "/employees/:id",
      this.adminController.handleUpdateEmployee,
    );
    this.router.delete("/employees/:id", this.handleDeleteEmployees.bind(this));
    this.router.get("/adjusters", this.adminController.getAllAdjusters);
    this.router.get("/adjusters/:id", this.adminController.getAdjusterById);
    this.router.post("/adjusters", this.adminController.addAdjusterByUserEmail);
    this.router.delete(
      "/adjusters/:id",
      this.adminController.hardDeleteAdjuster,
    );
    this.router.get("/documents", this.adminController.getAllDocuments);
    this.router.get("/documents/:id", this.adminController.getDocumentById);
    this.router.get(
      "/claims/:id/documents",
      this.adminController.getDocumentsByClaimId,
    );
    this.router.get("/items", this.adminController.getAllClaimItems);
    this.router.get("/items/:id", this.adminController.getClaimItemById);
  }

  private async handleShowClaims(req: Request, res: Response): Promise<void> {
    try {
      const { filter, val } = req.query;
      if (!filter && !val) {
        return await this.adminController.getAllClaims(req, res);
      }

      // Validate required parameters
      if (!filter || !val) {
        return res.status(400).json({
          error:
            "Both filter and id parameters are required when using filters",
        });
      }

      // Validate and handle different filter types
      switch (filter) {
        case "claim":
          return await this.adminController.getClaimById(req, res);
        case "employee":
          return await this.adminController.getClaimsByEmployeeId(req, res);
        case "admin":
          return await this.adminController.getClaimsByAdjusterId(req, res);
        case "status":
          return await this.adminController.getClaimsByStatus(req, res);
        case "reviewlvl":
          return await this.adminController.getClaimsByReviewLevel(req, res);
        default:
          return res.status(400).json({
            error: "Invalid filter type",
            validFilters: [
              "claim",
              "employee",
              "admin",
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

  public async handleShowUsers(req: Request, res: Response): Promise<void> {
    try {
      const { filter, val } = req.query;
      if (!filter && !val) {
        return await this.adminController.getAllUsers(req, res);
      }

      // Validate required parameters
      if (!filter || !val) {
        return res.status(400).json({
          error:
            "Both filter and id parameters are required when using filters",
        });
      }

      // Validate and handle different filter types
      switch (filter) {
        case "id":
          return await this.adminController.getUserById(req, res);
        case "email":
          return await this.adminController.getUserByEmail(req, res);
        default:
          return res.status(400).json({
            error: "Invalid filter type",
            validFilters: [
              "id",
              "email",
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

  private async handleDeleteEmployees(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { mode } = req.query;
      if (!mode) {
        return res.status(400).json({
          error: "Mode parameter is required",
        });
      }

      switch (mode) {
        case "hard":
          return await this.adminController.handleHardDeleteUser(req, res);
        case "soft":
          return await this.adminController.handleSoftDeleteUser(req, res);
        default:
          return res.status(400).json({
            error: "Invalid mode",
            validModes: [
              "hard",
              "soft",
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

  private async handleDeleteUsers(req: Request, res: Response): Promise<void> {
    try {
      const { mode } = req.query;
      if (!mode) {
        return res.status(400).json({
          error: "Mode parameter is required",
        });
      }

      switch (mode) {
        case "hard":
          return await this.adminController.handleHardDeleteUser(req, res);
        case "soft":
          return await this.adminController.handleSoftDeleteUser(req, res);
        default:
          return res.status(400).json({
            error: "Invalid mode",
            validModes: [
              "hard",
              "soft",
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
