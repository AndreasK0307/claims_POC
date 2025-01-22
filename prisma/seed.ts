import { PrismaClient } from "../generated/client/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { UserService } from "../src/services/userService.ts";

const userService = new UserService();

const { DATABASE_URL } = config();

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
});
const _seedRoles = await prisma.role.createMany({
  data: [
    {
      name: "ADMIN",
      description: "Admin role has full access to all resources",
    },
    {
      name: "USER",
      description: "User role can manage personal claims and create new claims",
    },
    {
      name: "ADJUSTER",
      description: "Adjuster role can manage claims and approve or reject them",
    },
  ],
});

const seedUsers = [
  {
    email: "admin@example.com",
    password: "admin",
    role: "ADMIN",
  },
  {
    email: "john@example.com",
    password: "john",
    role: "USER",
  },
  {
    email: "jane@example.com",
    password: "jane",
    role: "ADJUSTER",
  },
  {
    email: "james@example.com",
    password: "james",
    role: "USER",
  },
];

for (const user of seedUsers) {
  await userService.registerNewUser(user.email, user.password, user.role);
}

const _seedEmployees = await prisma.employee.createMany({
  data: [{
    user_id: 2,
    first_name: "John",
    last_name: "Doe",
    department: "IT",
    employment_type: "CONTRACT",
    position: "Software Engineer",
  }, {
    user_id: 3,
    first_name: "Jane",
    last_name: "Doe",
    department: "HR",
    employment_type: "FULLTIME",
    position: "HR Manager",
  }, {
    user_id: 4,
    first_name: "James",
    last_name: "Doe",
    department: "IT",
    employment_type: "FULLTIME",
    position: "Project Manager",
  }],
});

const _seedAdjuster = await prisma.adjuster.create({
  data: {
    employee_id: 2,
  },
});

console.log("Seeding finished.");

await prisma.$disconnect();
