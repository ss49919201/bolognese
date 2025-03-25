import React from 'react'
import { TimerType } from '@/types'
import { formatTime } from '@/utils'

interface TimerDisplayProps {
  minutes: number
  seconds: number
  type: TimerType
  sessionCount: number
}

/**
 * タイマー表示コンポーネント
 */
const TimerDisplay: React.FC<TimerDisplayProps> = ({ minutes, seconds, type, sessionCount }) => {
  // タイマータイプに基づいてタイトルを設定
  const getTimerTitle = () => {
    switch (type) {
      case TimerType.POMODORO:
        return 'ポモドーロ'
      case TimerType.SHORT_BREAK:
        return '短い休憩'
      case TimerType.LONG_BREAK:
        return '長い休憩'
      default:
        return 'ポモドーロ'
    }
  }

  // タイマータイプに基づいてCSSクラスを設定
  const getTimerClass = () => {
    switch (type) {
      case TimerType.POMODORO:
        return 'timer-pomodoro'
      case TimerType.SHORT_BREAK:
        return 'timer-short-break'
      case TimerType.LONG_BREAK:
        return 'timer-long-break'
      default:
        return 'timer-pomodoro'
    }
  }

  // 秒数を「分:秒」形式に変換
  const timeString = formatTime(minutes * 60 + seconds)

  return (
    <div className={`timer-display ${getTimerClass()}`}>
      <div className="timer-type">{getTimerTitle()}</div>
      <div className="timer-time">{timeString}</div>
      <div className="timer-session">セッション: {sessionCount}</div>
    </div>
  )
}

export default TimerDisplay
