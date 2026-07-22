import { ApiError } from "../utils/api-error";

type QueueItem<T> = {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

/**
 * A small in-process queue keeps a single API instance from overwhelming Judge0.
 * Deployments that need cross-instance coordination can replace this boundary with
 * a Redis-backed worker without changing controllers or domain services.
 */
export class ExecutionQueue {
  private readonly items: QueueItem<unknown>[] = [];
  private active = 0;

  constructor(
    private readonly concurrency: number,
    private readonly maxQueued: number,
  ) {}

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    if (this.items.length >= this.maxQueued) {
      return Promise.reject(new ApiError(503, "The execution queue is busy. Please retry shortly.", "EXECUTION_QUEUE_FULL"));
    }

    return new Promise<T>((resolve, reject) => {
      this.items.push({
        task: task as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.drain();
    });
  }

  private drain() {
    while (this.active < this.concurrency && this.items.length > 0) {
      const item = this.items.shift();
      if (!item) return;
      this.active += 1;

      void item.task()
        .then(item.resolve, item.reject)
        .finally(() => {
          this.active -= 1;
          this.drain();
        });
    }
  }
}
