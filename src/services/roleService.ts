import  prismaClient  from '../prismaClient/prismaService.ts';
import { Prisma } from '../../generated/client/deno/edge.ts';

const prisma = prismaClient

export class RoleService {

    //Function to get all roles
    public async getRoles() {
        try {
            const roles = await prisma.role.findMany();
            return roles;
        } catch (error) {
            console.log(error);
        }
    }

    //Function to get a role by its id
    public async getRoleById(roleId: number) {
        try {
            const role = await prisma.role.findUnique({
                where: {
                    id: roleId,
                },
            });
            return role;
        } catch (error) {
            console.log(error);
        }
    }

    //Function to get a role by its name
    public async getRoleByName(name: string) {
        try {
            const role = await prisma.role.findUnique({
                where: {
                    name,
                },
            });
            return role;
        } catch (error) {
            console.log(error);
        }
    }

    //Function to add a new role
    public async addRole(name: string, description: string) {
        try {
            const role: Prisma.RoleCreateInput = {
                name,
                description
            };
            const newRole = await prisma.role.create({
                data: role,
            });
            return newRole;
        } catch (error) {
            console.log(error);
        }
    }

    //Function to update a role
    public async updateRole(name: string, description: string, roleId: number) {
        try {
            const role = await prisma.role.update({
                where: {
                    id: roleId,
                },
                data: {
                    name,
                    description
                },
            });
            return role;
        } catch (error) {
            console.log(error);
        }
    }

    
}