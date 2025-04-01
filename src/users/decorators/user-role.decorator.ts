import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/utils/enums';

// methods decorator
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
