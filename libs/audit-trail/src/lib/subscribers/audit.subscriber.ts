import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
  DataSource,
  SoftRemoveEvent,
} from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EventEnum } from '../enums/events.enum';
import { AuditTrailsService } from '../audit-trails.service';
import { ContextProvider } from '../../../../common/src/lib/providers/context.provider';
import { UserTypeEnum } from '@./common/enums/user-type.enum';
import { NullableType } from '@./common/types/nullable.type';

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(AuditSubscriber.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly auditTrailService: AuditTrailsService
  ) {
    this.dataSource.subscribers.push(this); // <---- THIS
  }

  private _isAuditable(entity: any): boolean {
    if (
      entity == null ||
      typeof entity.getId != 'function' ||
      typeof entity.getResource != 'function'
    ) {
      return false;
    }
    return true;
  }

  private _getUserData(): { id: NullableType<number>; userType: UserTypeEnum } {
    if (ContextProvider.getAuthAdmin()) {
      return {
        id: ContextProvider.getAuthAdmin()!.id,
        userType: UserTypeEnum.ADMIN,
      };
    } else if (ContextProvider.getAuthUser()) {
      return {
        id: ContextProvider.getAuthUser()!.id,
        userType: UserTypeEnum.USER,
      };
    }
    return { id: null, userType: UserTypeEnum.SYSTEM };
  }

  private _getRecordData(entity: any): {
    recordId: number;
    recordType: string;
  } {
    return {
      recordId: entity.getId() as number,
      recordType: entity.getResource(),
    };
  }

  // tslint:disable-next-line:no-empty
  afterInsert(event: InsertEvent<any>): Promise<any> | void {
    this.logger.log('After Insert');
    if (!this._isAuditable(event.entity)) return;

    const { id: userId, userType } = this._getUserData();
    const { recordId, recordType } = this._getRecordData(event.entity);
    this.auditTrailService
      .create({
        event: EventEnum.CREATED,
        recordId,
        recordType,
        userId,
        userType,
        newValue: event.entity,
      })
      .then(() => console.log('created'))
      .catch(console.log);
  }

  afterUpdate(event: UpdateEvent<any>): Promise<any> | void {
    this.logger.log('After Update');

    if (!this._isAuditable(event.entity)) return;

    const oldValue: Record<string, any> = {};
    const newValue: Record<string, any> = {};

    const updatedFields = event.updatedColumns;

    // Loop through the updated fields
    for (const columnName of updatedFields) {
      const propertyPath: string = columnName.propertyPath;
      oldValue[propertyPath] =
        event.databaseEntity[columnName.propertyAliasName]; // Old value from the database
      if (event.entity) {
        newValue[propertyPath] = event.entity[columnName.propertyAliasName]; // New value from the updated entity
      }
    }

    const { id: userId, userType } = this._getUserData();
    const { recordId, recordType } = this._getRecordData(event.databaseEntity);
    this.auditTrailService
      .create({
        event: EventEnum.UPDATED,
        recordId,
        recordType,
        userId,
        userType,
        newValue,
        oldValue,
      })
      .then(() => console.log('updated'))
      .catch(console.log);
  }

  // tslint:disable-next-line:no-empty
  afterRemove(event: RemoveEvent<any>) {
    this.logger.log('Remove Event');
    // this.revisionService.createRevisionEntry(revision);
    if (!this._isAuditable(event.databaseEntity)) return;

    const { id: userId, userType } = this._getUserData();
    const { recordId, recordType } = this._getRecordData(event.databaseEntity);

    this.auditTrailService
      .create({
        event: EventEnum.DELETED,
        recordId,
        recordType,
        userId,
        userType,
        oldValue: event.databaseEntity,
      })
      .then(() => console.log('removed'))
      .catch(console.log);
  }

  afterSoftRemove(event: SoftRemoveEvent<any>): void | Promise<any> {
    this.logger.log('Soft Remove');

    if (!this._isAuditable(event.databaseEntity)) return;
    const { id: userId, userType } = this._getUserData();
    const { recordId, recordType } = this._getRecordData(event.databaseEntity);

    this.auditTrailService
      .create({
        event: EventEnum.DELETED,
        recordId,
        recordType,
        userId,
        userType,
        oldValue: event.databaseEntity,
      })
      .then(() => console.log('removed'))
      .catch(console.log);
  }
}
