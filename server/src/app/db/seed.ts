import config from '../config';
import { User } from '../modules/user/user.model';

const superAdmin = {
  id: '0001',
  email: config.super_admin_email,
  password: config.super_admin_password,
  needsPasswordChange: true,
  role: 'superAdmin',
  status: 'in-progress',
  isDeleted: false,
};

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({ role: 'superAdmin' });

    if (!isSuperAdminExist) {
      await User.create(superAdmin);
    }
  } catch (error) {
    console.info(error);
  }
};
