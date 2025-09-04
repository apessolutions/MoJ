import { DateTime, DurationLike, DateTimeUnit, Settings } from 'luxon';
import {
  ISO_DATE_FORMAT,
  TIME_12_HOUR_FORMAT,
  TIME_24_HOUR_FORMAT,
  WEEKDAY,
} from '../constants/date-formats.constants';
import { WeekdayEnum } from '../enums/weekday.enum';

export class CustomDate {
  static initializeZone(zone: string) {
    Settings.defaultZone = zone;
  }
  constructor(private date: DateTime) {}
  isAfter(other: CustomDate): boolean {
    return this.date > other.getDateTime();
  }

  isAfterOrEqual(other: CustomDate): boolean {
    return this.date >= other.getDateTime();
  }

  getWeekday(): WeekdayEnum {
    return this.format(WEEKDAY) as WeekdayEnum;
  }

  getDateTime(): DateTime {
    return this.date;
  }

  isBefore(other: CustomDate, unit?: 'day'): boolean {
    if (unit == 'day') {
      return this.date.startOf('day') < other.date.startOf('day');
    }
    return this.date < other.date;
  }

  isBeforeOrEqual(other: CustomDate, unit?: 'day'): boolean {
    if (unit == 'day') {
      return this.date.startOf('day') <= other.date.startOf('day');
    }
    return this.date <= other.date;
  }

  getHour(): number {
    return this.date.hour;
  }

  clone(): CustomDate {
    return new CustomDate(DateTime.fromJSDate(this.toDate()));
  }

  plus(duration: DurationLike): CustomDate {
    const newObject = this.clone();
    newObject.date = newObject.date.plus(duration);
    return newObject;
  }

  minusHour(hour: number): CustomDate {
    if (this.getHour() == 0) {
      return this.minus({ hour: 0 });
    }
    if (this.getHour() > hour) {
      return this.minus({ hour });
    } else {
      return this.minus({ hour: this.getHour() - 1 });
    }
  }

  minus(duration: DurationLike): CustomDate {
    const newObject = this.clone();
    newObject.date = newObject.date.minus(duration);
    return newObject;
  }

  toUTC(): CustomDate {
    const newObject = this.clone();
    newObject.date = newObject.date.toUTC();
    return newObject;
  }

  toISO(): string {
    return this.date.toISO()!;
  }

  toISOTime(): string {
    return this.date.toISOTime()!;
  }

  toISODate(): string {
    return this.format(ISO_DATE_FORMAT);
  }
  to12TimeFormat(): string {
    return this.format(TIME_12_HOUR_FORMAT);
  }

  toTime(): string {
    return this.format(TIME_24_HOUR_FORMAT);
  }

  isSameDay(other: CustomDate) {
    return this.date.hasSame(other.getDateTime(), 'day');
  }

  isSameHour(other: CustomDate) {
    return this.date.hasSame(other.getDateTime(), 'hour');
  }

  setEndOfDay(): CustomDate {
    this.date = this.date.endOf('day');
    return this;
  }

  getMinute(): number {
    return this.date.minute;
  }

  startOf(unit: DateTimeUnit) {
    return new CustomDate(this.date.startOf(unit));
  }

  endOf(unit: DateTimeUnit) {
    return new CustomDate(this.date.endOf(unit));
  }

  toDateTimeString(): string {
    return this.date.toFormat('yyyy-MM-dd HH:mm:ss');
  }

  format(format: string): string {
    return this.date.toFormat(format);
  }

  yearsDiff(other: CustomDate) {
    return Math.ceil(this.date.diff(other.date, 'year').toObject().years!);
  }

  hoursDiff(other: CustomDate) {
    return Math.ceil(this.date.diff(other.date, 'hour').toObject().hours!);
  }

  minutesDiff(other: CustomDate): number {
    return this.date.diff(other.date, 'minute').toObject().minutes!;
  }

  secondsDiff(other: CustomDate): number {
    if (this.isAfter(other)) {
      return 0;
    }
    return this.date.diff(other.date, 'seconds').toObject().seconds!;
  }

  static parseTime(time: string, format?: string) {
    if (format) {
      return new CustomDate(
        DateTime.fromFormat(time, format).set({
          second: 0,
          millisecond: 0,
        })
      );
    } else {
      return new CustomDate(
        DateTime.fromISO(time).set({
          second: 0,
          millisecond: 0,
        })
      );
    }
  }

  static parseDateJS(date: Date) {
    return new CustomDate(
      DateTime.fromJSDate(date).set({ second: 0, millisecond: 0 })
    );
  }

  static now() {
    return new CustomDate(
      DateTime.fromJSDate(new Date(Date.now())).set({
        second: 0,
        millisecond: 0,
      })
    );
  }
  static parseDate(date: string, format?: string) {
    if (format) {
      return new CustomDate(
        DateTime.fromFormat(date, format).set({
          second: 0,
          millisecond: 0,
        })
      );
    } else {
      return new CustomDate(
        DateTime.fromISO(date).set({
          second: 0,
          millisecond: 0,
        })
      );
    }
  }

  static parseDateTime(date: string, time: string) {
    const dateObject = DateTime.fromISO(date).set({
      second: 0,
      millisecond: 0,
    });
    const timeObject = DateTime.fromISO(time).set({
      second: 0,
      millisecond: 0,
    });
    return new CustomDate(
      dateObject.set({
        hour: timeObject.hour,
        minute: timeObject.minute,
        second: 0,
        millisecond: 0,
      })
    );
  }

  public toDate() {
    return this.date.toJSDate();
  }

  public setStartOfDay(): CustomDate {
    this.date = this.date.startOf('day');
    return this;
  }
}
