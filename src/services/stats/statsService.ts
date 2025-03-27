import { loadStats, saveStats } from '@/services/storage'
import { DailyStats, INITIAL_STATS, Stats, TimerType } from '@/types'
import { getCurrentDateString } from '@/utils'

/**
 * 統計サービス - ポモドーロの使用統計を管理
 */
export class StatsService {
  private stats: Stats

  /**
   * 統計サービスのコンストラクタ
   */
  constructor() {
    this.stats = loadStats(INITIAL_STATS)
  }

  /**
   * 現在の統計情報を取得
   */
  getStats(): Stats {
    return { ...this.stats }
  }

  /**
   * 完了したポモドーロを記録
   * @param focusTime 集中時間（秒）
   * @param type タイマーのタイプ
   */
  recordCompletedTimer(focusTime: number, type: TimerType): void {
    // ポモドーロタイマーの場合のみカウント
    if (type !== TimerType.POMODORO) {
      return
    }

    const today = getCurrentDateString()
    const focusTimeInMinutes = Math.floor(focusTime / 60)

    // 全体の統計を更新
    this.stats.completedPomodoros += 1
    this.stats.totalFocusTime += focusTimeInMinutes

    // 日別統計を更新
    if (!this.stats.dailyStats[today]) {
      this.stats.dailyStats[today] = {
        date: today,
        completedPomodoros: 0,
        totalFocusTime: 0,
      }
    }

    this.stats.dailyStats[today].completedPomodoros += 1
    this.stats.dailyStats[today].totalFocusTime += focusTimeInMinutes

    // 統計を保存
    this.saveStats()
  }

  /**
   * 指定した日付の統計を取得
   * @param date 日付（YYYY-MM-DD形式）
   */
  getDailyStats(date: string) {
    return this.stats.dailyStats[date] || null
  }

  /**
   * 過去n日間の統計を取得
   * @param days 日数
   */
  getRecentStats(days: number): Record<string, DailyStats> {
    const result: Record<string, DailyStats> = {}
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dateString = getCurrentDateString()
      result[dateString] = this.stats.dailyStats[dateString] || {
        date: dateString,
        completedPomodoros: 0,
        totalFocusTime: 0,
      }
    }

    return result
  }

  /**
   * 統計をリセット
   */
  resetStats(): void {
    this.stats = { ...INITIAL_STATS }
    this.saveStats()
  }

  /**
   * 統計を保存（内部メソッド）
   */
  private saveStats(): void {
    saveStats(this.stats)
  }
}

// シングルトンインスタンス
export const statsService = new StatsService()
