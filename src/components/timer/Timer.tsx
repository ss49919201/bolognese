import React, { useEffect, useState } from 'react'
import './Timer.css'
import { TimerService } from '@/services/timer'
import { NotificationService } from '@/services/notification'
import { DEFAULT_SETTINGS, TimerState, TimerType } from '@/types'
import TimerDisplay from './TimerDisplay'
import TimerControls from './TimerControls'
import { EVENTS } from '@/constants'

/**
 * タイマーコンポーネント
 */
const Timer: React.FC = () => {
  // タイマーサービスのインスタンスを作成
  const [timerService] = useState(() => new TimerService())

  // タイマーの状態を管理
  const [timerState, setTimerState] = useState<TimerState>(() => timerService.getState())

  // 通知の初期化
  useEffect(() => {
    NotificationService.initialize()
  }, [])

  // タイマーイベントのリスナーを設定
  useEffect(() => {
    const handleTimerUpdate = (state: TimerState) => {
      setTimerState({ ...state })
    }

    const handleTimerComplete = (state: TimerState) => {
      // タイマー完了時の通知
      switch (state.type) {
        case TimerType.POMODORO:
          NotificationService.notifyPomodoroComplete()
          break
        case TimerType.SHORT_BREAK:
          NotificationService.notifyShortBreakComplete()
          break
        case TimerType.LONG_BREAK:
          NotificationService.notifyLongBreakComplete()
          break
      }
    }

    // イベントリスナーを登録
    timerService.addEventListener(EVENTS.TIMER_TICK, handleTimerUpdate)
    timerService.addEventListener(EVENTS.TIMER_START, handleTimerUpdate)
    timerService.addEventListener(EVENTS.TIMER_PAUSE, handleTimerUpdate)
    timerService.addEventListener(EVENTS.TIMER_RESET, handleTimerUpdate)
    timerService.addEventListener(EVENTS.TIMER_SKIP, handleTimerUpdate)
    timerService.addEventListener(EVENTS.TIMER_COMPLETE, handleTimerComplete)

    // クリーンアップ関数
    return () => {
      timerService.removeEventListener(EVENTS.TIMER_TICK, handleTimerUpdate)
      timerService.removeEventListener(EVENTS.TIMER_START, handleTimerUpdate)
      timerService.removeEventListener(EVENTS.TIMER_PAUSE, handleTimerUpdate)
      timerService.removeEventListener(EVENTS.TIMER_RESET, handleTimerUpdate)
      timerService.removeEventListener(EVENTS.TIMER_SKIP, handleTimerUpdate)
      timerService.removeEventListener(EVENTS.TIMER_COMPLETE, handleTimerComplete)
    }
  }, [timerService])

  // タイマーの残り時間を分と秒に変換
  const minutes = Math.floor(timerState.remainingTime / 60)
  const seconds = timerState.remainingTime % 60

  // タイマー操作ハンドラー
  const handleStart = () => {
    timerService.start()
  }

  const handlePause = () => {
    timerService.pause()
  }

  const handleReset = () => {
    timerService.reset()
  }

  const handleSkip = () => {
    timerService.skip(
      DEFAULT_SETTINGS.pomodoroTime,
      DEFAULT_SETTINGS.shortBreakTime,
      DEFAULT_SETTINGS.longBreakTime,
      DEFAULT_SETTINGS.longBreakInterval
    )
  }

  return (
    <div className="timer">
      <TimerDisplay
        minutes={minutes}
        seconds={seconds}
        type={timerState.type}
        sessionCount={timerState.sessionCount}
      />
      <TimerControls
        status={timerState.status}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />
    </div>
  )
}

export default Timer
