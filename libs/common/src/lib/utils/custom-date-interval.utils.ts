import { DurationLike, Interval } from 'luxon';
import { CustomDate } from './custom-date.utils';

export class CustomDateInterval {
  static createIntervalsByDays(
    start: CustomDate,
    end: CustomDate,
    inclusive = false,
  ) {
    const endDay = inclusive ? end : end.plus({ days: 1 });

    return Interval.fromDateTimes(start.getDateTime(), endDay.getDateTime())
      .splitBy({ days: 1 })
      .map((interval) => CustomDate.parseDateJS(interval.start!.toJSDate()));
  }

  static createIntervals(
    startTime: CustomDate,
    endTime: CustomDate,
    duration: DurationLike,
  ) {
    return Interval.fromDateTimes(
      startTime.getDateTime(),
      endTime.getDateTime(),
    )
      .splitBy(duration)
      .map((interval) => ({
        startTime: new CustomDate(interval.start!),
        endTime: new CustomDate(interval.end!),
      }));
  }

  static createIntervalsByHours(startTime: CustomDate, endTime: CustomDate) {
    return Interval.fromDateTimes(
      startTime.getDateTime(),
      endTime.getDateTime(),
    )
      .splitBy({ hour: 1 })
      .map((interval) => CustomDate.parseDateJS(interval.start!.toJSDate()));
  }
  static intervalContains(
    startTime: CustomDate,
    endTime: CustomDate,
    time: CustomDate,
  ) {
    return Interval.fromDateTimes(
      startTime.getDateTime(),
      endTime.getDateTime(),
    ).contains(time.getDateTime());
  }

  static intervalsIntersect(
    interval1: { startTime: CustomDate; endTime: CustomDate },
    interval2: { startTime: CustomDate; endTime: CustomDate },
  ) {
    const firstInterval = Interval.fromDateTimes(
      interval1.startTime.getDateTime(),
      interval1.endTime.getDateTime(),
    );
    const secondInterval = Interval.fromDateTimes(
      interval2.startTime.getDateTime(),
      interval2.endTime.getDateTime(),
    );
    return firstInterval.overlaps(secondInterval);
  }

  static firstContainsSecond(
    interval1: { startTime: CustomDate; endTime: CustomDate },
    interval2: { startTime: CustomDate; endTime: CustomDate },
  ) {
    const firstInterval = Interval.fromDateTimes(
      interval1.startTime.getDateTime(),
      interval1.endTime.getDateTime(),
    );
    const secondInterval = Interval.fromDateTimes(
      interval2.startTime.getDateTime(),
      interval2.endTime.getDateTime(),
    );
    return firstInterval.engulfs(secondInterval);
  }
}
