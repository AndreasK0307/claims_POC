import { Request, Response } from "npm:express";
import { ClaimService } from "../services/claimService.ts";
import { AdjusterService } from "../services/adjusterService.ts";
import { DocumentService } from "../services/documentService.ts";
import { EmployeeService } from "../services/employeeService.ts";
import { ClaimItemService } from "../services/claimItemService.ts";
import { UserService } from "../services/userService.ts";

const claimService = new ClaimService();
const adjusterService = new AdjusterService();
const documentService = new DocumentService();
const employeeService = new EmployeeService();
const claimItemService = new ClaimItemService();
const userService = new UserService();

export class AdminController {
  // Functions for managing claims

  // Create a new user and employee together
  public async addNewUserAndEmployee(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        roleName,
        firstName,
        lastName,
        department,
        employmentType,
        position,
      } = req.body;
      const user = await userService.registerNewUser(email, password, roleName);
      if (user) {
        const employee = await employeeService.addEmployee(
          firstName,
          lastName,
          department,
          employmentType,
          position,
          user.id,
        );
        res.json({ user, employee });
      } else {
        throw new Error("Error creating user");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding user and employee");
    }
  }

  // Get all claims
  public async getAllClaims(_req: Request, res: Response) {
    try {
      const claims = await claimService.getClaims();
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Get claim by id
  public async getClaimById(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.query.val);
      const claim = await claimService.getClaimById(claimId);
      res.json(claim);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim");
    }
  }

  // Get claims by employee id
  public async getClaimsByEmployeeId(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.query.val);
      const claims = await claimService.getClaimsByEmployeeId(employeeId);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Get claims by adjuster id
  public async getClaimsByAdjusterId(req: Request, res: Response) {
    try {
      const adjusterId = parseInt(req.query.val);
      const claims = await claimService.getClaimsByAdjusterId(adjusterId);
      res.json(claims);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claims");
    }
  }

  // Get claim by status
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

  // Get claim by review level
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

  // Soft delete claim
  public async handleSoftDeleteClaim(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.params.id);
      const _claim = await claimService.handleSoftDeleteClaim(claimId);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting claim");
    }
  }

  //--------------------------------------------------------------------------------

  // Functions for managing users
  // Get all users
  public async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting users");
    }
  }

  // Get user by id
  public async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.query.val);
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting user");
    }
  }

  // Get user by email
  public async getUserByEmail(req: Request, res: Response) {
    try {
      const email = req.query.val;
      const user = await userService.getUserByEmail(email);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting user");
    }
  }

  // Add user
  public async addUser(req: Request, res: Response) {
    try {
      const { email, password, roleName } = req.body;
      const user = await userService.registerNewUser(email, password, roleName);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding user");
    }
  }

  // Update user
  public async handleUpdateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const { email, password, roleName } = req.body;
      const user = await userService.updateUser(
        userId,
        email,
        password,
        roleName,
      );
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating user");
    }
  }

  public async handleSoftDeleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.softDeleteUser(userId);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting user");
    }
  }

  public async handleHardDeleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.hardDeleteUser(userId);
      res.json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting user");
    }
  }

  //--------------------------------------------------------------------------------

  // Functions for managing employees
  // Get all employees
  public async getAllEmployees(_req: Request, res: Response) {
    try {
      const employees = await employeeService.getEmployees();
      res.json(employees);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting employees");
    }
  }

  // Get employee by id
  public async getEmployeeById(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.query.val);
      const employee = await employeeService.getEmployeeById(employeeId);
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting employee");
    }
  }

  // Add employee by user email
  public async addEmployeeByUserEmail(req: Request, res: Response) {
    try {
      const {
        email,
        firstName,
        lastName,
        department,
        employmentType,
        position,
      } = req.body;
      const user = await userService.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      const employee = await employeeService.addEmployee(
        firstName,
        lastName,
        department,
        employmentType,
        position,
        user.id,
      );
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding employee");
    }
  }

  // Update employee
  public async handleUpdateEmployee(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.params.id);
      const { first_name, last_name, department, employment_type, position } =
        req.body;
      const employee = await employeeService.updateEmployee(
        employeeId,
        first_name,
        last_name,
        department,
        employment_type,
        position,
      );
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error updating employee");
    }
  }

  // Soft delete employee
  public async handleSoftDeleteEmployee(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.params.id);
      const employee = await employeeService.handleSoftDeleteEmployee(
        employeeId,
      );
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting employee");
    }
  }

  // Hard delete employee
  public async handleHardDeleteEmployee(req: Request, res: Response) {
    try {
      const employeeId = parseInt(req.params.id);
      const employee = await employeeService.handleHardDeleteEmployee(
        employeeId,
      );
      res.json(employee);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting employee");
    }
  }

  //--------------------------------------------------------------------------------

  // Functions for managing adjusters
  // Get all adjusters
  public async getAllAdjusters(_req: Request, res: Response) {
    try {
      const adjusters = await adjusterService.getAdjusters();
      res.json(adjusters);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting adjusters");
    }
  }

  // Get adjuster by id
  public async getAdjusterById(req: Request, res: Response) {
    try {
      const adjusterId = parseInt(req.query.val);
      const adjuster = await adjusterService.getAdjusterById(adjusterId);
      res.json(adjuster);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting adjuster");
    }
  }

  // Add adjuster by employee id
  public async addAdjusterByEmployeeId(req: Request, res: Response) {
    try {
      const { employee_id } = req.body;
      const adjuster = await adjusterService.addAdjusterByEmployeeId(employee_id);
      res.json(adjuster);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding adjuster");
    }
  }

  // Add adjuster by email
  public async addAdjusterByUserEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const employee = await employeeService.getEmployeeByEmail(email);
      if (!employee) {
        throw new Error("User not found");
      }
      const adjuster = await adjusterService.addAdjusterByEmployeeId(employee.id);
      res.json(adjuster);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding adjuster");
    }
  }

  // Hard delete adjuster
  public async hardDeleteAdjuster(req: Request, res: Response) {
    try {
      const adjusterId = parseInt(req.params.id);
      const adjuster = await adjusterService.hardDeleteAdjuster(adjusterId);
      res.json(adjuster);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error deleting adjuster");
    }
  }

  //--------------------------------------------------------------------------------

  // Functions for managing documents
  // Get all documents
  public async getAllDocuments(_req: Request, res: Response) {
    try {
      const documents = await documentService.getDocuments();
      res.json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting documents");
    }
  }

  // Get document by id
  public async getDocumentById(req: Request, res: Response) {
    try {
      const documentId = parseInt(req.query.val);
      const document = await documentService.getDocumentById(documentId);
      res.json(document);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting document");
    }
  }

  // Get documents by claim id
  public async getDocumentsByClaimId(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.query.val);
      const documents = await documentService.getDocumentsByClaimId(claimId);
      res.json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting documents");
    }
  }

  //--------------------------------------------------------------------------------

  // Functions for managing claim items
  // Get all claim items
  public async getAllClaimItems(_req: Request, res: Response) {
    try {
      const claimItems = await claimItemService.getClaimItems();
      res.json(claimItems);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim items");
    }
  }

  // Get claim item by id
  public async getClaimItemById(req: Request, res: Response) {
    try {
      const claimItemId = parseInt(req.query.val);
      const claimItem = await claimItemService.getClaimItemById(claimItemId);
      res.json(claimItem);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim item");
    }
  }

  // Get claim item by claim id
  public async getClaimItemByClaimId(req: Request, res: Response) {
    try {
      const claimId = parseInt(req.query.val);
      const claimItem = await claimItemService.getClaimItemsByClaimId(claimId);
      res.json(claimItem);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error getting claim item");
    }
  }
}
