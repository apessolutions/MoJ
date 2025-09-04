import { DateTime, DurationLike } from 'luxon';

export class DateOperations {
  static timePassed(date: Date) {
    const customDate = DateTime.fromJSDate(date);
    const now = DateTime.now();
    return now > customDate;
  }

  static timePassedDuration(date: Date, durationLike: DurationLike) {
    const customDate = DateTime.fromJSDate(date).plus(durationLike);
    const now = DateTime.now();
    return now > customDate;
  }

  static addTimeToDate(date: Date, durationLike: DurationLike) {
    return DateTime.fromJSDate(date).plus(durationLike).toJSDate();
  }
}
