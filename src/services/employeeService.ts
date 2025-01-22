import { EmploymentType, Prisma } from "../../generated/client/deno/edge.ts";
import PrismaService from "../prismaClient/prismaService.ts";

const prisma = PrismaService;

// This service is responsible for managing employee data
export class EmployeeService {
  // Function to get all employees
  public async getEmployees() {
    try {
      const employees = await prisma.employee.findMany();
      return employees;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get an employee by their id
  public async getEmployeeById(employeeId: number) {
    try {
      const employee = await prisma.employee.findUnique({
        where: {
          id: employeeId,
        },
      });
      return employee;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get an employee by their email
  public async getEmployeeByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      const employee = await prisma.employee.findUnique({
        where: {
          user_id: user.id,
        },
      });
      return employee;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get an employee by their name
  public async getEmployeeByName(first_name: string, last_name: string) {
    try {
      const employee = await prisma.employee.findFirst({
        where: {
          first_name,
          last_name,
        },
      });
      return employee;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to create a new employee
  public async addEmployee(
    first_name: string,
    last_name: string,
    department: string,
    employment_type: EmploymentType,
    position: string,
    userId: number,
  ) {
    try {
      const employee: Prisma.EmployeeCreateInput = {
        first_name,
        last_name,
        department,
        employment_type,
        position,
        user: {
          connect: {
            id: userId,
          },
        },
      };

      const createEmployee = await prisma.employee.create({
        data: employee,
      });
      return createEmployee;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to update an employee
  public async updateEmployee(
    employeeId: number,
    first_name: string,
    last_name: string,
    department: string,
    employment_type: EmploymentType,
    position: string,
  ) {
    try {
      const employee = await prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          first_name: first_name ? first_name : undefined,
          last_name: last_name ? last_name : undefined,
          department: department ? department : undefined,
          employment_type: employment_type ? employment_type : undefined,
          position: position ? position : undefined,
        },
      });
      return employee;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete an employee
  public async handleHardDeleteEmployee(employeeId: number) {
    try {
      const _employee = await prisma.employee.delete({
        where: {
          id: employeeId,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to soft delete an employee
  public async handleSoftDeleteEmployee(employeeId: number) {
    try {
      const _employee = await prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          deleted: true,
        },
      });
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
