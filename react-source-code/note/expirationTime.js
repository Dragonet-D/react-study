const UNIT_SIZE = 10
const MAGIC_NUMBER_OFFSET = 2

export function msToExpirationTime(ms) {
  return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET
}

export function expirationTimeToMs(expirationTime) {
  return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE
}

function ceiling(num, precision) {
  return (((num / precision) | 0) + 1) * precision
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return (
      MAGIC_NUMBER_OFFSET +
      ceiling(
          currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE,
          bucketSizeMs / UNIT_SIZE
      )
  )
}


export const LOW_PRIORITY_EXPIRATION = 5000
export const LOW_PRIORITY_BATCH_SIZE = 250

export function computeAsyncExpiration(currentTime) {
  return computeExpirationBucket(
      currentTime,
      LOW_PRIORITY_EXPIRATION,
      LOW_PRIORITY_BATCH_SIZE
  )
}

export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150
export const HIGH_PRIORITY_BATCH_SIZE = 100

export function computeInteractiveExpiration(currentTime) {
  return computeExpirationBucket(
      currentTime,
      HIGH_PRIORITY_EXPIRATION,
      HIGH_PRIORITY_BATCH_SIZE
  )
}