import { Request, Response } from "npm:express";
import { ClaimService } from "../services/claimService.ts";
import { PaymentService } from "../services/paymentService.ts";
import { DocumentService } from "../services/documentService.ts";
import { ClaimItemService } from "../services/claimItemService.ts";

const claimService = new ClaimService();
const paymentService = new PaymentService();
const documentService = new DocumentService();
const claimItemService = new ClaimItemService();

export class UserController {
  // Functions for managing claims

  // Get claims by employee id
  public async getClaimsByEmployeeId(req: Request, res: Response) {
    const employeeId = parseInt(req.query.val);
    try {
      const claims = await claimService.getClaimsByEmployeeId(employeeId);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Get claims by employee user id
  public async getClaimsByEmployeeUserId(req: Request, res: Response) {
    const { userId, _roleId } = req.body;
    try {
      const claims = await claimService.getClaimsByEmployeeUserId(userId);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Create a new claim
  public async addClaim(req: Request, res: Response) {
    try {
      const { description, employeeIds, claimItems, documents } = req.body;

      const createClaim = await claimService.addClaim(
        description,
        employeeIds,
        claimItems,
        documents,
      );
      res.status(201).json(createClaim);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error creating claim");
    }
  }

  // Allows user to update claims if the claim has not been reviewed
  public async handleEditClaim(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const {
        description,
        employeeIdsToConnect,
        employeeIdsToDisconnect,
        claimItemsToConnect,
        claimItemsToDelete,
        documentsToConnect,
        documentsToDelete,
      } = req.body;
      const claim = await claimService.handleEditClaim(
        claimId,
        description,
        employeeIdsToConnect,
        employeeIdsToDisconnect,
        claimItemsToConnect,
        claimItemsToDelete,
        documentsToConnect,
        documentsToDelete,
      );
      if (!claim) {
        return res.status(404).send("Claim not found or not editable");
      }
      res.json(claim);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating claim");
    }
  }

  // Allows users to hard delete claims if the claim has not been reviewed
  public async handleHardDeleteClaim(req: Request, res: Response) {
    const claimId = parseInt(req.params.id);
    try {
      const _claim = await claimService.handleHardDeleteClaim(claimId);
      res.status(204).send("Claim permanently deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting claim");
    }
  }

  // Functions for managing payments
  // Get payments by claim id
  public async getPaymentsByClaimId(req: Request, res: Response) {
    const claimId = parseInt(req.params.id);
    try {
      const payments = await paymentService.getPaymentsByClaimId(claimId);
      res.json(payments);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting payments");
    }
  }

  // ----------------------------------------------------------------
  // Functions to get supporting data for claims
  // Get documents by claim id
  public async getDocumentsByClaimId(req: Request, res: Response) {
    const claimId = parseInt(req.params.id);
    try {
      const documents = await documentService.getDocumentsByClaimId(claimId);
      res.json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting documents");
    }
  }

  // Get claim items by claim id
  public async getClaimItemsByClaimId(req: Request, res: Response) {
    const claimId = parseInt(req.params.id);
    try {
      const claimItems = await claimItemService.getClaimItemsByClaimId(claimId);
      res.json(claimItems);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim items");
    }
  }
}
