import { useEffect, useState } from "react";

/**
 * TODO 8: return `value`, but only after it has stopped changing for `delayMs`.
 *
 * The first render returns `value` straight away. Search will use 300 ms, so typing "phone" updates
 * the result once, after the last key, instead of five times.
 *
 * Clear the timer when `value` changes and when the component unmounts.
 *
 * How to start: in useDebounce.test.tsx change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: setTimeout, effect cleanup, fake timers, closures.
 * Resources: https://react.dev/learn/removing-effect-dependencies and MDN setTimeout.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  // keep the value in a state
  const [val, setVal] = useState(value);

  // use effect and clearn function set and stop a timer then return the value it's passed
  useEffect(()=>{
    const timer = setTimeout(()=>setVal(value),delayMs);
    
    return ()=>clearTimeout(timer);
  },[value,delayMs]);

  return val;
}
