import {
  RoleEnum,
  User
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const createSuperAdminUser = async (): Promise<User> => {
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      role: RoleEnum.SuperAdmin,
      password: await bcrypt.hash('Azerty1234!', 10),
      status: 'Inactive',
    },
  });
  return superAdmin;
};

async function bootstrap() {
  const superAdmin = await createSuperAdminUser();
}
bootstrap();