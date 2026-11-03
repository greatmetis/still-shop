/**
 * TODO 0 (warm-up): keep `n` between `min` and `max`.
 *
 *   clamp(5, 1, 10)  → 5
 *   clamp(-3, 1, 10) → 1
 *   clamp(42, 1, 10) → 10
 *
 * How to start: in src/lib/clamp.test.ts change `describe.skip` to `describe`,
 * run `npm test`, watch it go red, then make it green.
 * You'll learn: how Vitest runs and the red/green loop.
 * Resources: https://vitest.dev/guide/ and MDN Math.min / Math.max.
 */
export function clamp(n: number, min: number, max: number): number {
  if(n < min) return min;

  if(n > max){
    return max;
  }else{
    return n;
  }
}
