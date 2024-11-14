import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

class DBUserService {

    async createUser(password: string, email: string): Promise<User> {
        const user = await prisma.user.create({
            data: {
                password,
                email,
            },
        });
        return user;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        return user;
    }

    async getAllUsers(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }
}

export default new DBUserService();