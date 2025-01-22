import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { JWT_SECRET } = config();

// Middleware to verify the token
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = localStorage.getItem("token");
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (error: Error, decoded: string | jwt.JWTPayload | undefined) => {
      if (error) {
        return res.status(403).send("Invalid token");
      }
      req.userId = decoded.id;
      req.roleId = decoded.role;
      next();
    },
  );
}

// Middleware to verify the user's role is an admin
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.roleId !== 1) {
    return res.status(403).send("Access Denied");
  }
  next();
}

// Middleware to verify the user's role is a user
export function userMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const acceptedRoles = [1, 2, 3];
  if (!acceptedRoles.includes(req.roleId)) {
    return res.status(403).send("Access Denied");
  }
  next();
}

// Middleware to verify the user's role is an adjuster
export function adjusterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const acceptedRoles = [1, 3];
  if (!acceptedRoles.includes(req.roleId)) {
    return res.status(403).send("Access Denied");
  }
  next();
}
