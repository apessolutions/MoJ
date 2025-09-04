export const TRANSACTION_TYPES = [
  // { label: "Session", value: "session" },
  // { label: "Workshop", value: "workshop" },
  { label: 'Settlement', value: 'settlement' },
  { label: 'Refund', value: 'refund' },
] as const;

export const TRANSACTION_TYPES_VALIDATION = [
  // { label: "Workshop", value: "workshop" },
  { label: 'Session', value: 'session' },
  { label: 'Settlement', value: 'settlement' },
  { label: 'Refund', value: 'refund' },
] as const;

export const TRANSACTION_STATUS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Partially Paid', value: 'partially_paid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Failed', value: 'failed' },
  { label: 'Partially Refunded', value: 'partially_refunded' },
  { label: 'Refunded', value: 'refunded' },
] as const;

export const TRANSACTION_DIRECTIONS = [
  { label: 'Incoming', value: 'incoming' },
  { label: 'Outgoing', value: 'outgoing' },
] as const;

export const GENDER = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
] as const;

export const MARTIAL_STATUS = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
] as const;

export const USER_STATUS = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 },
] as const;
