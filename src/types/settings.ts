/**
 * アラーム音の種類を表す列挙型
 */
export enum AlarmSound {
  BELL = 'bell',
  DIGITAL = 'digital',
  GENTLE = 'gentle',
}

/**
 * アプリケーション設定を表すインターフェース
 */
export interface Settings {
  pomodoroTime: number // ポモドーロの時間（分）
  shortBreakTime: number // 短い休憩の時間（分）
  longBreakTime: number // 長い休憩の時間（分）
  longBreakInterval: number // 長い休憩までのポモドーロセット数
  autoStartBreak: boolean // ポモドーロ後に自動的に休憩を開始するか
  autoStartPomodoro: boolean // 休憩後に自動的にポモドーロを開始するか
  alarmSound: AlarmSound // アラーム音の種類
  alarmVolume: number // アラーム音量（0-100）
  notifications: boolean // ブラウザ通知を使用するか
}

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: Settings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
  autoStartBreak: false,
  autoStartPomodoro: false,
  alarmSound: AlarmSound.BELL,
  alarmVolume: 70,
  notifications: true,
}
