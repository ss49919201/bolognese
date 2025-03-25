import React from 'react'
import { TimerStatus } from '@/types'

interface TimerControlsProps {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

/**
 * タイマーコントロールコンポーネント
 */
const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  onStart,
  onPause,
  onReset,
  onSkip,
}) => {
  // 開始/一時停止ボタンのテキストとハンドラーを設定
  const getStartPauseButton = () => {
    if (status === TimerStatus.RUNNING) {
      return (
        <button className="timer-button pause-button" onClick={onPause}>
          一時停止
        </button>
      )
    } else {
      return (
        <button className="timer-button start-button" onClick={onStart}>
          開始
        </button>
      )
    }
  }

  return (
    <div className="timer-controls">
      {getStartPauseButton()}

      <button
        className="timer-button reset-button"
        onClick={onReset}
        disabled={status === TimerStatus.IDLE}
      >
        リセット
      </button>

      <button className="timer-button skip-button" onClick={onSkip}>
        スキップ
      </button>
    </div>
  )
}

export default TimerControls
