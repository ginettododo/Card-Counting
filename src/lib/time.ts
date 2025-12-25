export function now(): number {
  return Date.now();
}

export function durationMs(start: number, end: number): number {
  return end - start;
}
