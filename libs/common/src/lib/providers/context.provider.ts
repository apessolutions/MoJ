/* eslint-disable @nx/enforce-module-boundaries */
import { ClsServiceManager } from 'nestjs-cls';
import { IParamRequest } from '../interfaces/IParam.interface';
import { LanguageCode } from '@./common/constants/language-code.constants';
import { Admin } from '@./admin/domain/admin';
import { User } from '@./user/domain/user';
import { UserAddress } from '@./user/domain/user-address';

export class ContextProvider {
  private static readonly nameSpace = 'request';
  private static readonly languageKey = 'language_key';
  private static readonly userAddressKey = 'user_address_key';
  private static readonly authUserKey = 'user_key';
  private static readonly authAdminKey = 'admin_key';
  private static readonly paramKey = 'param_key';
  private static readonly ipAddressKey = 'ip_address';
  private static readonly userAgentKey = 'user_agent';

  private static get<T>(key: string) {
    const store = ClsServiceManager.getClsService();

    return store.get<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    const store = ClsServiceManager.getClsService();

    store.set(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static setIPAddress(ipAddress: string): void {
    ContextProvider.set(ContextProvider.ipAddressKey, ipAddress);
  }

  static getIPAddress(): string | undefined {
    return ContextProvider.get<string>(ContextProvider.ipAddressKey);
  }

  static setUserAgent(userAgent: string): void {
    ContextProvider.set(ContextProvider.userAgentKey, userAgent);
  }

  static getUserAgent(): string | undefined {
    return ContextProvider.get<string>(ContextProvider.userAgentKey);
  }

  static setParams(params: IParamRequest[]) {
    ContextProvider.set(ContextProvider.paramKey, params);
  }

  static getParams(): IParamRequest[] {
    return ContextProvider.get<IParamRequest[]>(ContextProvider.paramKey) || [];
  }

  static setAuthAdmin(admin: Admin): void {
    ContextProvider.set(ContextProvider.authAdminKey, admin);
  }

  static getAuthAdmin(): Admin | undefined {
    return ContextProvider.get<Admin>(ContextProvider.authAdminKey);
  }

  static setAuthUser(user: User): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static getAuthUser(): User | undefined {
    return ContextProvider.get<User>(ContextProvider.authUserKey);
  }

  static setUserAddress(userAddress: UserAddress): void {
    ContextProvider.set(ContextProvider.userAddressKey, userAddress);
  }

  static getUserAddress(): UserAddress | undefined {
    return ContextProvider.get<UserAddress>(ContextProvider.userAddressKey);
  }
}
