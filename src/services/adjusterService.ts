import { Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing adjuster data
export class AdjusterService {
  
  // Function for getting all adjusters
  public async getAdjusters() {
    try {
      const adjusters = await prisma.adjuster.findMany(
        {
          include: {
            employee: true,
          },
        },
      );
      return adjusters;
    } catch (error) {
      console.log(error);
    }
  }

  // Function for getting an adjuster by their id
  public async getAdjusterById(adjusterId: number) {
    try {
      const adjuster = await prisma.adjuster.findUnique({
        where: {
          id: adjusterId,
        },
        include: {
          employee: true,
        },
      });
      return adjuster;
    } catch (error) {
      console.log(error);
    }
  }

  // Function for getting an adjuster by their employee id
  public async getAdjusterByEmployeeId(employeeId: number) {
    try {
      const adjuster = await prisma.adjuster.findFirst({
        where: {
          employee_id: employeeId,
        },
        include: {
          employee: true,
        },
      });
      return adjuster;
    } catch (error) {
      console.log(error);
    }
  }

  // Function for getting adjusters by their user id
  public async getAdjustersByUserId(userId: number) {
    try {
      const adjusters = await prisma.adjuster.findFirst({
        where: {
          employee: {
            user_id: userId,
          },
        }
      });
      return adjusters;
    } catch (error) {
      console.log(error);
    }
  }

  // Function for adding an adjuster
  public async addAdjusterByEmployeeId(employeeId: number) {
    try {
      const adjuster: Prisma.AdjusterCreateInput = {
        employee: {
          connect: {
            id: employeeId,
          },
        },
      };

      const createAdjuster = await prisma.adjuster.create({
        data: adjuster,
      });
      return createAdjuster;
    } catch (error) {
      console.log(error);
    }
  }


  // Function for hard deleting an adjuster
  public async hardDeleteAdjuster(adjusterId: number) {
    try {
      const _adjuster = await prisma.adjuster.delete({
        where: {
          id: adjusterId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
