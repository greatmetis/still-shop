import {useEffect, useState} from "react";
import { getProducts } from '../api/products';
import type { ProductsResponse } from '../api/types'

/**
 * What the hook returns: one of three states. TypeScript calls this a "discriminated union":
 * check `status` first, and TypeScript knows which other fields exist.
 *
 *   if (state.status === 'success') state.data.products   // ✅ data is there
 *   if (state.status === 'error')   state.error.message   // ✅ error is there
 */
export type ProductsState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: ProductsResponse; error: null }
  | { status: 'error'; data: null; error: Error }

export type UseProductsResult = ProductsState & {
  /** Fetch again (the "Try again" button calls this). */
  retry: () => void,
  isRetrying: boolean
}


/**
 *  Load the products with getProducts.
 *
 * - Start in 'loading'. Call getProducts inside useEffect.
 * - Create an AbortController in the effect, pass its signal, and abort it in the cleanup function
 *   (so a request is cancelled when the component unmounts, or when the effect runs again).
 * - An AbortError is not a real error (you cancelled it yourself): don't show it as 'error'.
 * - retry(): make the effect run again. Hint: what could you add to the dependency array that
 *   retry() changes?
 *
 * How to start: in useProducts.test.tsx change `describe.skip` to `describe`. Finish TODO 4 first.
 * You'll learn: useEffect, dependency arrays, cleanup, race conditions, why StrictMode runs effects twice.
 * Resources: https://react.dev/learn/synchronizing-with-effects
 *            https://react.dev/learn/you-might-not-need-an-effect
 *
 * TODO 10 (part 3): take a `category` (null = All categories) and pass it to getProducts.
 * - When the category changes, the effect must run again and load the new category.
 * - Rename `_category` to `category` when you use it (the underscore only quiets "unused" warnings).
 *
 * How to start: in useProducts.test.tsx change the second `describe.skip` to `describe`. Finish part 2 first.
 * Resource: https://react.dev/learn/lifecycle-of-reactive-effects
 */
//* LEARNING NOTE: Use try/catch here so the page can show status.
export function useProducts(category: string | null = null): UseProductsResult {
  const [numberToTry, setNumberToTry] = useState(0);
  const [state, setState] = useState<ProductsState>({
    status:"loading",
    data: null,
    error: null
  });
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Retry button will trigger this
  const retry = ()=>{
    setNumberToTry(n=>n+1);
    setIsRetrying(true);
  }

  useEffect(()=>{
    const controller = new AbortController();
    async function fetchProducts(){
      try{
        const response = await getProducts({signal:controller.signal, category:category});
        setState({status: 'success', data:response, error: null });
        setIsRetrying(false);
      }catch(error){
        // never show error when it's abortError, so when can use status to change UI
        if(error instanceof Error && error.name === "AbortError") return;
        // set error state if it's not AbortError
        setState({
          status: 'error', 
          data:null, 
          error: error instanceof Error ? error : new Error(String(error)), // turn the non real error to message if it's not an real error
        });
        setIsRetrying(false);
      }
    }
    fetchProducts();
    return () => controller.abort();
    
  },[numberToTry,category]);

  return {...state,retry,isRetrying};
}
