import { Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing payment data
export class PaymentService {
  // Function to get all payments
  public async getPayments() {
    try {
      const payments = await prisma.payment.findMany();
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get a payment by its id
  public async getPaymentById(paymentId: number) {
    try {
      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });
      return payment;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get payments by claim id
  public async getPaymentsByClaimId(claimId: number) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          claim_id: claimId,
        },
      });
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get payments by employee id
  public async getPaymentsByEmployeeId(employeeId: number) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          claim: {
            employees: {
              some: {
                id: employeeId,
              },
            },
          },
        },
      });
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get payments by employee name
  public async getPaymentByEmployeeName(first_name: string, last_name: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          claim: {
            employees: {
              some: {
                first_name: first_name,
                last_name: last_name,
              },
            },
          },
        },
      });
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get payments by employee email
  public async getPaymentsByEmployeeEmail(email: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          claim: {
            employees: {
              some: {
                user: {
                  email: email,
                },
              },
            },
          },
        },
      });
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get payments by payment method
  public async getPaymentByMethod(method: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: {
          method,
        },
      });
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to create a new payment
  public async addPayment(amount: number, method: string, claimId: number) {
    try {
      const payment: Prisma.PaymentCreateInput = {
        amount,
        method,
        claim: {
          connect: {
            id: claimId,
          },
        },
      };
      const createPayment = await prisma.payment.create({
        data: payment,
      });
      return createPayment;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to update a payment (maybe unnecessary)
  public async updatePayment(
    amount: number,
    method: string,
    paymentId: number,
  ) {
    try {
      const payment = await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          amount: amount ? amount : undefined,
          method: method ? method : undefined,
        },
      });
      return payment;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete a payment
  public async deletePayment(paymentId: number) {
    try {
      const _payment = await prisma.payment.delete({
        where: {
          id: paymentId,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
