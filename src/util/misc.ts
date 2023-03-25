/**
 * Miscellaneous shared functions go here.
 */


/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export class Queue<T> {
  private queue: T[] = [];

  public enqueue(item: T): void {
    this.queue.push(item);
  }

  public dequeue(): T | undefined {
    return this.queue.shift();
  }

  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
