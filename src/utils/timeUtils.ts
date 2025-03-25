/**
 * 秒数を「分:秒」形式の文字列に変換する
 * @param seconds 秒数
 * @returns 「分:秒」形式の文字列（例: "25:00"）
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * 分を秒に変換する
 * @param minutes 分
 * @returns 秒
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60
}

/**
 * 秒を分に変換する（小数点以下切り捨て）
 * @param seconds 秒
 * @returns 分
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60)
}
