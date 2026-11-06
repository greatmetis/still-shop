import type { Category } from '../api/types'
import { getCategories } from '../api/categories';
import { useEffect, useState } from 'react';

export type CategoriesState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: Category[]; error: null }
  | { status: 'error'; data: null; error: Error }

export type UseCategoriesResult = CategoriesState & {
  /** Fetch again. */
  retry: () => void
}

/**
 * TODO 7 (part 3): load the categories with getCategories. 
 * 
 * Same shape as useProducts, without `isRetrying`, because the category filter has no error screen to keep on show.
 *
 * Before you copy useProducts, notice how much of it would be identical. You may pull the shared part
 * into a generic hook if you want to, but it isn't required: talk it through first.
 *
 * How to start: in useCategories.test.tsx change `describe.skip` to `describe`. Finish part 1 first.
 * You'll learn: custom hooks as reusable logic, when duplication is worth removing.
 * Resource: https://react.dev/learn/reusing-logic-with-custom-hooks
 */
export function useCategories(): UseCategoriesResult {
  // start for the loading state
  const [categoriesState,setCategoriesState] = useState<CategoriesState>({ status: 'loading', data: null, error: null })
  const [numberToTry, setNumberToTry] = useState(0);
  const retry = ()=>{
    setCategoriesState({ status: 'loading', data: null, error: null });
    setNumberToTry(n=>n+1);
  };

  useEffect(()=>{
    const controller = new AbortController();
    (async()=>{
      try{
        const response = await getCategories({signal:controller.signal});
        setCategoriesState({
          status:'success',
          data:response,
          error:null
        })
      }catch(error){
        // never show error when it's abortError, so we can use status to change UI
        if(error instanceof Error && error.name === "AbortError") return;

        setCategoriesState({ 
          status: 'error', 
          data: null, 
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    })();
    return ()=>controller.abort();
  },[numberToTry]);

  
  return {...categoriesState,retry};

}
