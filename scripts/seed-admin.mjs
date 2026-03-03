import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log(`\nUser ${email} already exists. Updating to admin and resetting password...`);
    await prisma.user.update({
      where: { email },
      data: {
        isAdmin: true,
        role: "ADMIN",
        password: hashedPassword
      }
    });
    console.log(`✅ Admin user updated: ${email}`);
  } else {
    console.log(`\nCreating new admin user: ${email}`);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: email,
        password: hashedPassword,
        isAdmin: true,
        role: "ADMIN"
      }
    });
    console.log(`✅ Admin user created: ${email}`);
  }
}

main()
  .catch(e => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("\nDone!");
  });
