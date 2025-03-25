/**
 * 日別の統計記録を表すインターフェース
 */
export interface DailyStats {
  date: string // YYYY-MM-DD形式の日付
  completedPomodoros: number // 完了したポモドーロ数
  totalFocusTime: number // 総集中時間（分）
}

/**
 * 統計情報全体を表すインターフェース
 */
export interface Stats {
  completedPomodoros: number // 完了したポモドーロの合計数
  totalFocusTime: number // 総集中時間（分）
  dailyStats: Record<string, DailyStats> // 日付ごとの統計情報
}

/**
 * 初期統計情報
 */
export const INITIAL_STATS: Stats = {
  completedPomodoros: 0,
  totalFocusTime: 0,
  dailyStats: {},
}
