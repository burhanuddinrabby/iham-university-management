import config from "../config"
import { USER_ROLES } from "../modules/user/user.constant"
import { UserModel } from "../modules/user/user.model"

const superUser = {
    id: '0001',
    password: config.super_admin_pass,
    email: 'bunnub5683@gmail.com',
    role: USER_ROLES.superAdmin,
    status: 'in-progress'
}

const seedSuperAdmin = async () => {
    const isSuperAdminExist = await UserModel.findOne({ role: USER_ROLES.superAdmin });
    if (!isSuperAdminExist) {
        await UserModel.create(superUser);
    }
};

export default seedSuperAdmin;