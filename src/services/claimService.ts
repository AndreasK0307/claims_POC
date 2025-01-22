import {
  Prisma,
  ReviewLevel,
  Status,
} from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing claim data
export class ClaimService {
  // Function to get all claims
  public async getClaims() {
    try {
      const claims = await prisma.claim.findMany(
        {
          where: {
            deleted: false,
          },
        },
      );
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a claim by its id
  public async getClaimById(claimId: number) {
    try {
      const claim = await prisma.claim.findUnique({
        where: {
          id: claimId,
          deleted: false,
        },
      });
      return claim;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get details of a claim by its id
  public async getClaimDetailsById(claimId: number) {
    try {
      const claim = await prisma.claim.findUnique({
        where: {
          id: claimId,
          deleted: false,
        },
        include: {
          employees: true,
          claim_items: true,
          documents: true,
          payments: true,
          adjuster: {
            include: {
              employee: true,
            },
          },
        },
      });
      return claim;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get claims by employee id
  public async getClaimsByEmployeeId(employeeId: number) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          employees: {
            some: {
              id: employeeId,
            },
          },
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get claims by employee user id
  public async getClaimsByEmployeeUserId(userId: number) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          employees: {
            some: {
              user_id: userId,
            },
          },
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get claims by adjuster id
  public async getClaimsByAdjusterId(adjusterId: number) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          employees: {
            some: {
              id: adjusterId,
            },
          },
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  public async getClaimsByAdjusterUserId(userId: number) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          adjuster: {
            some: {
              employee: {
                user_id: userId,
              },
            },
          },
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }
  // Function to get claims by status
  public async getClaimsByStatus(status: Status) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          status: status,
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get claims by review level
  public async getClaimsByReviewLevel(reviewLevel: ReviewLevel) {
    try {
      const claims = await prisma.claim.findMany({
        where: {
          review_level: reviewLevel,
          deleted: false,
        },
      });
      return claims;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to create a new claim
  public async addClaim(
    description: string,
    employeeIds: number[],
    claimItems: { name: string; description: string; amount: number }[],
    documents: {
      title: string;
      description: string;
      url: string;
      document_type: string;
    }[] | undefined,
  ) {
    try {
      const claim: Prisma.ClaimCreateInput = {
        description,
        employees: {
          connect: employeeIds.map((id: number) => ({ id })),
        },
        claim_items: {
          create: claimItems.map((
            item: { name: string; description: string; amount: number },
          ) => ({
            name: item.name,
            description: item.description,
            amount: item.amount,
          })),
        },
        documents: documents
          ? {
            create: documents.map((
              doc: {
                title: string;
                description: string;
                url: string;
                document_type: string;
              },
            ) => ({
              title: doc.title,
              description: doc.description,
              url: doc.url,
              document_type: doc.document_type,
            })),
          }
          : undefined,
      };
      const createClaim = await prisma.claim.create({
        data: claim,
      });
      return createClaim;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to update a claim (does not include editing claim items data or documents data)
  public async handleEditClaim(
    claimId: number,
    description: string | undefined,
    employeeIdsToConnect: number[] | undefined,
    employeeIdsToDisconnect: number[],
    claimItemsToConnect:
      | { name: string; description: string; amount: number }[]
      | undefined,
    claimItemsToDelete: number[] | undefined,
    documentsToConnect: {
      title: string;
      description: string;
      url: string;
      document_type: string;
    }[] | undefined,
    documentsToDelete: number[] | undefined,
  ) {
    try {
      // If there are documents to remove from the claim, delete them
      if (documentsToDelete) {
        await prisma.document.deleteMany({
          where: {
            id: {
              in: documentsToDelete,
            },
          },
        });
      }

      // If there are claim items to remove from the claim, delete them
      if (claimItemsToDelete) {
        await prisma.claimItem.deleteMany({
          where: {
            id: {
              in: claimItemsToDelete,
            },
          },
        });
      }

      const claim = await prisma.claim.update({
        where: {
          id: claimId,
          status: "OPEN",
        },
        data: {
          description: description ? description : undefined,
          employees: {
            connect: employeeIdsToConnect
              ? employeeIdsToConnect.map((id: number) => ({ id }))
              : undefined,
            disconnect: employeeIdsToDisconnect
              ? employeeIdsToDisconnect.map((id: number) => ({ id }))
              : undefined,
          },
          // For creating new claim items and adding them to the claim
          claim_items: {
            create: claimItemsToConnect
              ? claimItemsToConnect.map((
                item: { name: string; description: string; amount: number },
              ) => ({
                name: item.name,
                description: item.description,
                amount: item.amount,
              }))
              : undefined,
          },
          // For creating new documents and adding them to the claim
          documents: {
            create: documentsToConnect
              ? documentsToConnect.map((
                doc: {
                  title: string;
                  description: string;
                  url: string;
                  document_type: string;
                },
              ) => ({
                title: doc.title,
                description: doc.description,
                url: doc.url,
                document_type: doc.document_type,
              }))
              : undefined,
          },
        },
      });
      if (!claim) {
        throw new Error("Claim not found or is not open");
      }
      return claim;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to review a claim (edit status, remarks, adjusters, and review level)
  public async handleReviewClaim(
    claimId: number,
    status: Status,
    remarks: string | undefined,
    adjusterIdsToConnect: number[] | undefined,
    adjusterIdsToDisconnect: number[] | undefined,
    reviewLevel: ReviewLevel,
  ) {
    try {
      const claim = await prisma.claim.update({
        where: {
          id: claimId,
        },
        data: {
          status,
          remarks: remarks ? remarks : undefined,
          adjuster: {
            connect: adjusterIdsToConnect
              ? adjusterIdsToConnect.map((id: number) => ({ id }))
              : undefined,
            disconnect: adjusterIdsToDisconnect
              ? adjusterIdsToDisconnect.map((id: number) => ({ id }))
              : undefined,
          },
          review_level: reviewLevel,
        },
      });
      return claim;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle a soft delete of a claim
  public async handleSoftDeleteClaim(claimId: number) {
    try {
      const _claim = await prisma.claim.update({
        where: {
          id: claimId,
        },
        data: {
          deleted: true,
          claim_items: {
            updateMany: {
              where: {
                claim_id: claimId,
              },
              data: {
                deleted: true,
              },
            },
          },
          documents: {
            updateMany: {
              where: {
                claim_id: claimId,
              },
              data: {
                deleted: true,
              },
            },
          },
          payments: {
            updateMany: {
              where: {
                claim_id: claimId,
              },
              data: {
                deleted: true,
              },
            },
          },
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle a hard delete of a claim
  public async handleHardDeleteClaim(claimId: number) {
    try {
      const _claim = await prisma.claim.delete({
        where: {
          id: claimId,
          status: "OPEN",
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
