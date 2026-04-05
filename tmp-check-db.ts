import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"

async function main() {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const users = await prisma.user.findMany()
    console.log("Users in DB:", users.map(u => ({ email: u.email, role: u.role, password: u.password })))
  } catch (error) {
    console.error("Error fetching users:", error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
