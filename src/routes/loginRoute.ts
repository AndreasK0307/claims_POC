import express, { Request, Response } from "express";
import { AuthService } from "../services/authService.ts";

export class loginRouter {
  public router: express.Router;
  private authService: AuthService;

  constructor() {
    this.router = express.Router();
    this.authService = new AuthService();
    this.router.post("/", this.handleLogin.bind(this));
  }

  private async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const auth = await this.authService.authenticateUser(email, password);
      if (!auth) {
        return res.status(401).send("Invalid username or password");
      }
      localStorage.setItem("token", auth.token);
      switch (auth.roleId) {
        case 1:
          res.redirect("/admin");
          break;
        case 2:
          res.redirect("/user");
          break;
        case 3:
          res.redirect("/adjuster");
          break;

        default:
          return res.status(500).send("Error logging in");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error logging in");
    }
  }
}
