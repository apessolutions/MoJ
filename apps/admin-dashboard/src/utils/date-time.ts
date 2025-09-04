import dayjs from "dayjs";

export const isDate = (date: any): date is Date => dayjs(date).isValid()
