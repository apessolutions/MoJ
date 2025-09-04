import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import {
  AdminPermission,
  BannerPermission,
  CampaignPermission,
  DashboardPermission,
  RolePermission,
  UserPermission,
} from '../types/permission-type.type';

@ValidatorConstraint({ name: 'isPermissionTypeConstraint', async: false })
export class IsPermissionTypeConstraint
  implements ValidatorConstraintInterface
{
  private validPermissions: Set<string>;

  constructor() {
    this.validPermissions = new Set([
      ...Object.values(AdminPermission),
      ...Object.values(RolePermission),
      ...Object.values(DashboardPermission),
      ...Object.values(UserPermission),
      ...Object.values(BannerPermission),
      ...Object.values(CampaignPermission),
    ]);
  }

  validate(permission: any, args: ValidationArguments) {
    return this.validPermissions.has(permission);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid permission type';
  }
}

export function IsPermissionType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPermissionTypeConstraint,
    });
  };
}
