import express, { Request, Response } from "npm:express";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { loginRouter } from "./routes/loginRoute.ts";
import { join } from "jsr:@std/path";
import {
  adjusterMiddleware,
  adminMiddleware,
  authMiddleware,
  userMiddleware,
} from "./middleware/authMiddleware.ts";
import { config as pathConfig} from "./config/config.ts";
import { AdminRouter } from "./routes/adminRoute.ts";
import { UserRouter } from "./routes/userRoute.ts";
import { AdjusterRouter } from "./routes/adjusterRoute.ts";

const { APP_PORT } = config();

const app = express();
const PORT = APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/login", new loginRouter().router);
app.use("/admin", authMiddleware, adminMiddleware, new AdminRouter().router);
app.use("/user", authMiddleware, userMiddleware, new UserRouter().router);
app.use(
  "/adjuster",
  authMiddleware,
  adjusterMiddleware,
  new AdjusterRouter().router,
);

app.get("/", (_req: Request, res: Response) => {
  res.redirect("/login");
});

app.get("/login", (_req: Request, res: Response) => {
  res.sendFile(join(pathConfig.dirname, "..", "views", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
