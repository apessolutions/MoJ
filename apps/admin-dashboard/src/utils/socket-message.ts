export function generateMessageId(channelId: string, messageNumber: number) {
  return `${channelId}_${messageNumber}`;
}

export function generateStreamId(
  channelId: string,
  messageNumber: number,
  sequenceNumber: number
) {
  return `${generateMessageId(channelId, messageNumber)}_${sequenceNumber}`;
}
