/**
 * 現在の日付をYYYY-MM-DD形式の文字列で取得する
 * @returns YYYY-MM-DD形式の日付文字列
 */
export const getCurrentDateString = (): string => {
  const now = new Date()
  return formatDateToString(now)
}

/**
 * Date オブジェクトをYYYY-MM-DD形式の文字列に変換する
 * @param date Date オブジェクト
 * @returns YYYY-MM-DD形式の日付文字列
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * YYYY-MM-DD形式の文字列からDate オブジェクトを作成する
 * @param dateString YYYY-MM-DD形式の日付文字列
 * @returns Date オブジェクト
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * 指定された日数前の日付をYYYY-MM-DD形式で取得する
 * @param daysAgo 何日前か
 * @returns YYYY-MM-DD形式の日付文字列
 */
export const getDateDaysAgo = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return formatDateToString(date)
}
