/**
 * イベントコールバック関数の型定義
 */
type EventCallback<T = unknown> = (data: T) => void

/**
 * イベントバスサービス
 * アプリケーション全体でのイベント発行・購読を管理する
 */
export class EventBusService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, EventCallback<any>[]> = new Map()

  /**
   * イベントを購読する
   * @param event イベント名
   * @param callback コールバック関数
   * @returns アンサブスクライブ関数
   */
  subscribe<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.listeners.get(event)?.push(callback as EventCallback<any>)

    // アンサブスクライブ関数を返す
    return () => this.unsubscribe(event, callback)
  }

  /**
   * イベント購読を解除する
   * @param event イベント名
   * @param callback コールバック関数
   */
  unsubscribe<T>(event: string, callback: EventCallback<T>): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const index = callbacks.indexOf(callback as EventCallback<any>)
      if (index !== -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * イベントを発行する
   * @param event イベント名
   * @param data イベントデータ
   */
  publish<T>(event: string, data: T): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }
}

// シングルトンインスタンスを作成してエクスポート
export const eventBus = new EventBusService()
