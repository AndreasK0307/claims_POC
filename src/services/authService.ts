import jwt from "jsonwebtoken";
import * as argon_ from "jsr:@felix/argon2";
import PrismaService from "../prismaClient/prismaService.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const { JWT_SECRET } = config();

const prisma = PrismaService;

// This service is responsible for managing authentication
export class AuthService {
  // Function to create a token that includes the user's id and role
  public createToken(userId: number, roleId: number) {
    const token = jwt.sign({ id: userId, role: roleId }, JWT_SECRET, {
      expiresIn: "12h",
    });
    return token;
  }

  // Function to authenticate a user by their email and password
  public async authenticateUser(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // If the user is not found, throw an error
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = argon_.verify(user.password, password);

      // If the password is invalid, throw an error
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const token = this.createToken(user.id, user.role_id);
      const roleId = user.role_id;
      return { token, roleId };
    } catch (error) {
      console.error("Error in authenticating user", error);
    }
  }
}
