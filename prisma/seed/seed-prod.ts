import { PrismaClient, RoleEnum, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const createSuperAdminUser = async (): Promise<User | null> => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'admin@mail.com',
    },
  });

  if (existingUser) {
    console.log("L'utilisateur admin existe déjà");
    return existingUser;
  }

  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      role: RoleEnum.SuperAdmin,
      password: await bcrypt.hash('Azerty1234!', 10),
      status: 'Active',
    },
  });

  console.log('Utilisateur admin créé avec succès');
  return superAdmin;
};

async function bootstrap() {
  const superAdmin = await createSuperAdminUser();
  await prisma.$disconnect();
}

bootstrap();
