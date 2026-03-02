declare module 'lodash' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; trailing?: boolean; maxWait?: number },
  ): T & { cancel: () => void; flush: () => void };

  export function isEqual(value: unknown, other: unknown): boolean;
}
