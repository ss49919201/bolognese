import { STORAGE_KEYS } from '@/constants'

/**
 * ローカルストレージを使用したデータ永続化サービス
 */
export class StorageService {
  /**
   * データをローカルストレージに保存する
   * @param key ストレージキー
   * @param data 保存するデータ
   * @returns 保存に成功したかどうか
   */
  static save<T>(key: string, data: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Storage save error:', error)
      return false
    }
  }

  /**
   * ローカルストレージからデータを読み込む
   * @param key ストレージキー
   * @param defaultValue デフォルト値（データが存在しない場合に返される）
   * @returns 読み込んだデータまたはデフォルト値
   */
  static load<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : defaultValue
    } catch (error) {
      console.error('Storage load error:', error)
      return defaultValue
    }
  }

  /**
   * ローカルストレージからデータを削除する
   * @param key ストレージキー
   * @returns 削除に成功したかどうか
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  /**
   * ローカルストレージが利用可能かどうかを確認する
   * @returns ローカルストレージが利用可能な場合はtrue
   */
  static isAvailable(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      return false
    }
  }
}

// 設定の保存と読み込みのためのヘルパー関数
export const saveSettings = <T>(settings: T): boolean => {
  return StorageService.save(STORAGE_KEYS.SETTINGS, settings)
}

export const loadSettings = <T>(defaultSettings: T): T => {
  return StorageService.load(STORAGE_KEYS.SETTINGS, defaultSettings) as T
}

// 統計情報の保存と読み込みのためのヘルパー関数
export const saveStats = <T>(stats: T): boolean => {
  return StorageService.save(STORAGE_KEYS.STATS, stats)
}

export const loadStats = <T>(defaultStats: T): T => {
  return StorageService.load(STORAGE_KEYS.STATS, defaultStats) as T
}

// タイマー状態の保存と読み込みのためのヘルパー関数
export const saveTimerState = <T>(timerState: T): boolean => {
  return StorageService.save(STORAGE_KEYS.TIMER_STATE, timerState)
}

export const loadTimerState = <T>(defaultTimerState: T): T => {
  return StorageService.load(STORAGE_KEYS.TIMER_STATE, defaultTimerState) as T
}
