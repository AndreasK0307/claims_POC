import { Request, Response } from "npm:express";
import { ClaimService } from "../services/claimService.ts";
import { PaymentService } from "../services/paymentService.ts";
import { AdjusterService } from "../services/adjusterService.ts";

const claimService = new ClaimService();
const adjusterService = new AdjusterService();
const paymentService = new PaymentService();

export class AdjusterController {
  // Functions for managing claims

  // Function to get all claims
  public async getAllClaims(_req: Request, res: Response) {
    try {
      const claims = await claimService.getClaims();
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim");
    }
  }

  // Function to get claims by claim id
  public async getClaimsByClaimId(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const claims = await claimService.getClaimById(claimId);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim");
    }
  }

  // Function to get claim details by claim id
  public async getDetailsByClaimId(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const claim = await claimService.getClaimDetailsById(claimId);
      res.json(claim);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim details");
    }
  }

  // Function to get claims by adjuster user id
  public async getClaimsByAdjusterUserId(req: Request, res: Response) {
    try {
      const { userId, _roleId } = req.body;
      const adjusterUserId = userId;
      const claims = await claimService.getClaimsByAdjusterUserId(
        adjusterUserId,
      );
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  public async getClaimsByStatus(req: Request, res: Response) {
    try {
      const status = req.query.val.toUpperCase();
      const claims = await claimService.getClaimsByStatus(status);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  public async getClaimsByReviewLevel(req: Request, res: Response) {
    try {
      const reviewLevel = req.query.val.toUpperCase();
      const claims = await claimService.getClaimsByReviewLevel(reviewLevel);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Function to handle reviewing claims
  public async handleReviewClaim(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const {
        userId,
        status,
        remarks,
        adjusterIdsToDisconnect,
        reviewLevel,
      } = req.body;
      const adjuster = await adjusterService.getAdjustersByUserId(userId);
      if (!adjuster) {
        return res.status(404).send("Adjuster not found");
      }
      const adjusterIdsToConnect = [adjuster.id];
      const claim = await claimService.handleReviewClaim(
        claimId,
        status,
        remarks,
        adjusterIdsToConnect,
        adjusterIdsToDisconnect,
        reviewLevel,
      );
      res.json(claim);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error reviewing claim");
    }
  }

  // Functions for managing payments
  public async getPaymentsByClaimId(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const payments = await paymentService.getPaymentsByClaimId(claimId);
      res.json(payments);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting payments");
    }
  }

  public async createPayment(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const { amount, method } = req.body;
      const payment = await paymentService.addPayment(amount, method, claimId);
      res.json(payment);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error creating payment");
    }
  }
}
