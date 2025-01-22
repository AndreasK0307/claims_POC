import * as argon_ from "jsr:@felix/argon2";
import { Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing user data
export class UserService {
  // Function to get all users
  public async getUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a user by their id
  public async getUserById(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a user by their email
  public async getUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to register a new user and hashes their password
  public async registerNewUser(
    email: string,
    password: string,
    roleName: string,
  ) {
    try {
      const hashedPassword = await argon_.hash(password);
      const role = await prisma.role.findFirst({
        where: {
          name: roleName,
        },
      });
      if (!role) {
        throw new Error("Role not found");
      }
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: {
            connect: {
              id: role?.id,
            },
          },
        },
      });
      return user;
    } catch (error) {
      console.error("Error registering new user: ", error);
    }
  }

  // Function to update a user's information
  public async updateUser(
    userId: number,
    email: string | undefined,
    password: string | undefined,
    roleName: string | undefined,
  ) {
    try {
      const updateData: Prisma.UserUpdateInput = {};

      if (email) {
        updateData.email = email;
      }

      if (password) {
        updateData.password = await argon_.hash(password);
      }

      if (roleName) {
        const role = await prisma.role.findUnique({
          where: { name: roleName.toUpperCase() },
        });

        if (!role) {
          throw new Error(`Role with name ${roleName} not found.`);
        }

        updateData.role = {
          connect: { id: role.id },
        };
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to soft delete a user
  public async softDeleteUser(userId: number) {
    try {
      const _user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Function to hard delete a user
  public async hardDeleteUser(userId: number) {
    try {
      const _user = await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
