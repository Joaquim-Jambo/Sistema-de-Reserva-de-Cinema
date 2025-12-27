import prisma from "../src/config/prismaClient";

const truncateBD = async () => {
    try {
        await Promise.all([
            prisma.user.deleteMany(),
            prisma.client.deleteMany()
        ])
        console.log("Tabelas truncadas com sucesso !");
    } catch (error: any) {
        console.error(error.message);
    }
}
await truncateBD();