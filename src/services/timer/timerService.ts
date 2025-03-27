import { EVENTS } from '@/constants'
import { TimerState, TimerStatus, TimerType } from '@/types'
import { minutesToSeconds } from '@/utils'

/**
 * タイマーイベントのコールバック関数の型
 */
type TimerEventCallback = (state: TimerState) => void

/**
 * タイマーサービス - ポモドーロタイマーの中核機能を提供
 */
export class TimerService {
  private state: TimerState
  private timerId: number | null = null
  private lastTimestamp: number = 0
  private eventListeners: Map<string, TimerEventCallback[]> = new Map()

  /**
   * タイマーサービスのコンストラクタ
   * @param initialState 初期状態（オプション）
   */
  constructor(initialState?: Partial<TimerState>) {
    this.state = {
      status: TimerStatus.IDLE,
      remainingTime: minutesToSeconds(25), // デフォルト: 25分
      totalTime: minutesToSeconds(25),
      type: TimerType.POMODORO,
      sessionCount: 0,
      ...initialState,
    }
  }

  /**
   * 現在のタイマー状態を取得
   */
  getState(): TimerState {
    return { ...this.state }
  }

  /**
   * タイマーを開始
   */
  start(): void {
    if (this.state.status === TimerStatus.RUNNING) {
      return
    }

    this.state.status = TimerStatus.RUNNING
    this.lastTimestamp = Date.now()
    this.emitEvent(EVENTS.TIMER_START, this.state)
    this.tick()
  }

  /**
   * タイマーを一時停止
   */
  pause(): void {
    if (this.state.status !== TimerStatus.RUNNING) {
      return
    }

    this.state.status = TimerStatus.PAUSED
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId)
      this.timerId = null
    }
    this.emitEvent(EVENTS.TIMER_PAUSE, this.state)
  }

  /**
   * タイマーを再開
   */
  resume(): void {
    if (this.state.status !== TimerStatus.PAUSED) {
      return
    }

    this.start()
  }

  /**
   * タイマーをリセット
   */
  reset(): void {
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId)
      this.timerId = null
    }

    this.state.status = TimerStatus.IDLE
    this.state.remainingTime = this.state.totalTime
    this.emitEvent(EVENTS.TIMER_RESET, this.state)
  }

  /**
   * 次のタイマーにスキップ
   * @param pomodoroTime ポモドーロ時間（分）
   * @param shortBreakTime 短い休憩時間（分）
   * @param longBreakTime 長い休憩時間（分）
   * @param longBreakInterval 長い休憩までのポモドーロセット数
   */
  skip(
    pomodoroTime: number = 25,
    shortBreakTime: number = 5,
    longBreakTime: number = 15,
    longBreakInterval: number = 4
  ): void {
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId)
      this.timerId = null
    }

    // 現在のタイマータイプに基づいて次のタイプを決定
    switch (this.state.type) {
      case TimerType.POMODORO:
        // ポモドーロ完了としてカウント
        this.state.sessionCount++

        // 長い休憩の条件を満たしているかチェック
        if (this.state.sessionCount % longBreakInterval === 0) {
          this.state.type = TimerType.LONG_BREAK
          this.state.totalTime = minutesToSeconds(longBreakTime)
        } else {
          this.state.type = TimerType.SHORT_BREAK
          this.state.totalTime = minutesToSeconds(shortBreakTime)
        }
        break

      case TimerType.SHORT_BREAK:
      case TimerType.LONG_BREAK:
        this.state.type = TimerType.POMODORO
        this.state.totalTime = minutesToSeconds(pomodoroTime)
        break
    }

    this.state.status = TimerStatus.IDLE
    this.state.remainingTime = this.state.totalTime
    this.emitEvent(EVENTS.TIMER_SKIP, this.state)
  }

  /**
   * タイマーの更新処理（内部メソッド）
   */
  private tick(): void {
    if (this.state.status !== TimerStatus.RUNNING) {
      return
    }

    const now = Date.now()
    const elapsed = Math.floor((now - this.lastTimestamp) / 1000)
    this.lastTimestamp = now

    if (elapsed > 0) {
      this.state.remainingTime = Math.max(0, this.state.remainingTime - elapsed)
      this.emitEvent(EVENTS.TIMER_TICK, this.state)

      if (this.state.remainingTime <= 0) {
        this.complete()
        return
      }
    }

    this.timerId = requestAnimationFrame(() => this.tick())
  }

  /**
   * タイマー完了時の処理（内部メソッド）
   */
  private complete(): void {
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId)
      this.timerId = null
    }

    this.state.status = TimerStatus.IDLE
    this.emitEvent(EVENTS.TIMER_COMPLETE, this.state)
  }

  /**
   * イベントリスナーを登録
   * @param event イベント名
   * @param callback コールバック関数
   */
  addEventListener(event: string, callback: TimerEventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback)
  }

  /**
   * イベントリスナーを削除
   * @param event イベント名
   * @param callback コールバック関数
   */
  removeEventListener(event: string, callback: TimerEventCallback): void {
    if (!this.eventListeners.has(event)) {
      return
    }

    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * イベントを発行（内部メソッド）
   * @param event イベント名
   * @param state 現在の状態
   */
  private emitEvent(event: string, state: TimerState): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback({ ...state }))
    }
  }
}
