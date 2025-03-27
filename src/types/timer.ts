/**
 * タイマーの状態を表す列挙型
 */
export enum TimerStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  RESTING = 'resting',
}

/**
 * タイマーのタイプを表す列挙型
 */
export enum TimerType {
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak',
}

/**
 * タイマーの状態を表すインターフェース
 */
export interface TimerState {
  status: TimerStatus
  remainingTime: number // 残り時間（秒）
  totalTime: number // 合計時間（秒）
  type: TimerType
  sessionCount: number // 完了したポモドーロセッション数
}
