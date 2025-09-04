import type { Time } from 'src/types/time';

import dayjs from 'dayjs';

export const formatTime = (time: Time) => {
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(+hours, +minutes);
  return dayjs(date).format('hh:mm A');
};
