import { Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing document data
export class DocumentService {
  // Function to get all documents
  public async getDocuments() {
    try {
      const documents = await prisma.document.findMany();
      return documents;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a document by its id
  public async getDocumentById(documentId: number) {
    try {
      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
        },
      });
      return document;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get documents by claim id
  public async getDocumentsByClaimId(claimId: number) {
    try {
      const documents = await prisma.document.findMany({
        where: {
          claim_id: claimId,
        },
      });
      return documents;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add a new document
  public async addDocument(
    title: string,
    description: string,
    url: string,
    document_type: string,
    claim_id: number,
  ) {
    try {
      const document: Prisma.DocumentCreateInput = {
        title,
        description,
        url,
        document_type,
        claim: {
          connect: {
            id: claim_id,
          },
        },
      };
      const createDocument = await prisma.document.create({
        data: document,
      });
      return createDocument;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to update a document
  public async updateDocument(
    documentId: number,
    title: string,
    description: string,
    url: string,
    document_type: string,
  ) {
    try {
      const document = await prisma.document.update({
        where: {
          id: documentId,
        },
        data: {
          title: title ? title : undefined,
          description: description ? description : undefined,
          url: url ? url : undefined,
          document_type: document_type ? document_type : undefined,
        },
      });
      return document;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete a document
  public async deleteDocument(documentId: number) {
    try {
      const _document = await prisma.document.delete({
        where: {
          id: documentId,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
