import { Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing claim item data
export class ClaimItemService {
  public async getClaimItems() {
    try {
      const claimItems = await prisma.claimItem.findMany();
      return claimItems;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a claim item by its id
  public async getClaimItemById(claimItemId: number) {
    try {
      const claimItem = await prisma.claimItem.findUnique({
        where: {
          id: claimItemId,
        },
      });
      return claimItem;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get claim items by claim id
  public async getClaimItemsByClaimId(claimId: number) {
    try {
      const claimItems = await prisma.claimItem.findMany({
        where: {
          claim_id: claimId,
        },
      });
      return claimItems;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add a new claim item (claim item is linked to a claim)
  public async addClaimItem(
    name: string,
    description: string,
    amount: number,
    claimId: number,
  ) {
    try {
      const claimItem: Prisma.ClaimItemCreateInput = {
        name,
        description,
        amount,
        claim: {
          connect: {
            id: claimId,
          },
        },
      };
      const createClaimItem = await prisma.claimItem.create({
        data: claimItem,
      });
      return createClaimItem;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to update a claim item
  public async updateClaimItem(
    claimItemId: number,
    name: string,
    description: string,
    amount: number,
  ) {
    try {
      const claimItem = await prisma.claimItem.update({
        where: {
          id: claimItemId,
        },
        data: {
          name: name ? name : undefined,
          description: description ? description : undefined,
          amount: amount ? amount : undefined,
        },
      });
      return claimItem;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete a claim item
  public async deleteClaimItem(claimItemId: number) {
    try {
      const _claimItem = await prisma.claimItem.delete({
        where: {
          id: claimItemId,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
