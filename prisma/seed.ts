import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@aurahr.com" },
    update: {},
    create: {
      email: "admin@aurahr.com",
      name: "Alisha Khanna",
      password: "password123", // Using plain text for now as per auth.js config
      role: "ADMIN",
    },
  })

  // 2. Create Candidate
  const candidate = await prisma.user.upsert({
    where: { email: "candidate@aurahr.com" },
    update: {},
    create: {
      email: "candidate@aurahr.com",
      name: "Riyan Kothari",
      password: "password123",
      role: "CANDIDATE",
    },
  })

  console.log({ admin, candidate })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
