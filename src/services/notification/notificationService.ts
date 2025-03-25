/**
 * ブラウザ通知を管理するサービス
 */
export class NotificationService {
  private static isSupported = typeof Notification !== 'undefined'
  private static isPermissionGranted = false

  /**
   * 通知サービスを初期化し、必要に応じて権限を要求する
   * @returns 通知が利用可能かどうか
   */
  static async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser')
      return false
    }

    if (Notification.permission === 'granted') {
      this.isPermissionGranted = true
      return true
    } else if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission()
        this.isPermissionGranted = permission === 'granted'
        return this.isPermissionGranted
      } catch (error) {
        console.error('Error requesting notification permission:', error)
        return false
      }
    }

    return false
  }

  /**
   * 通知が利用可能かどうかを確認する
   * @returns 通知が利用可能な場合はtrue
   */
  static isAvailable(): boolean {
    return this.isSupported && this.isPermissionGranted
  }

  /**
   * 通知を表示する
   * @param title 通知のタイトル
   * @param options 通知オプション
   * @returns 通知オブジェクトまたはnull（通知が利用できない場合）
   */
  static notify(title: string, options: NotificationOptions = {}): Notification | null {
    if (!this.isAvailable()) {
      console.warn('Notifications are not available')
      return null
    }

    try {
      return new Notification(title, options)
    } catch (error) {
      console.error('Error creating notification:', error)
      return null
    }
  }

  /**
   * ポモドーロ完了通知を表示する
   */
  static notifyPomodoroComplete(): Notification | null {
    return this.notify('ポモドーロ完了', {
      body: '休憩時間です。少し休憩しましょう。',
      icon: '/favicon.svg',
    })
  }

  /**
   * 短い休憩完了通知を表示する
   */
  static notifyShortBreakComplete(): Notification | null {
    return this.notify('休憩終了', {
      body: '次のポモドーロを開始しましょう。',
      icon: '/favicon.svg',
    })
  }

  /**
   * 長い休憩完了通知を表示する
   */
  static notifyLongBreakComplete(): Notification | null {
    return this.notify('長い休憩終了', {
      body: '次のポモドーロセットを開始しましょう。',
      icon: '/favicon.svg',
    })
  }
}
