import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CategoryFilter } from '../components/CategoryFilter'
import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProductGrid } from '../components/ProductGrid'
import { ResultCount } from '../components/ResultCount'
import { SearchBox } from '../components/SearchBox'
import { SortSelect } from '../components/SortSelect'
import type { CategoryOption, SortOption, SortValue } from '../components/types'
import { toCardProps } from '../mappers/toCardProps'
import { useProducts } from '../hooks/useProducts'
import { ErrorState } from '../components/ErrorState'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import { EmptyState } from '../components/EmptyState'
import { useCategories } from '../hooks/useCategories'
import { toCategoryOption } from '../mappers/toCategoryOption'
import { useSearchParams } from 'react-router'
import { hrefForPage, parseParams, serializeParams } from '../lib/searchParams'
import { Pagination } from '../components/Pagination'
import { useDebounce } from '../hooks/useDebounce'
import { filterProducts } from '../lib/filterProducts'
import { clampPage, paginate, totalPages } from '../lib/paginate'
import { sortProducts } from '../lib/sortProducts'

const sortOptions: SortOption[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'rating-asc', label: 'Rating: low to high' },
  { value: 'title-asc', label: 'Name: A–Z' },
  { value: 'title-desc', label: 'Name: Z–A' },
]

// Used by the intro: how long (ms) to wait before the catalog fades in / the cards start to reveal.
const TOOLBAR_DELAY = '700ms'
const GRID_DELAY = '1200ms'
const itemsPerPage = 12

/**
 * TODO 13: connect the page to the URL, in three steps. Each step has its own `describe.skip` in
 * HomePage.url.test.tsx; switch them on one at a time.
 *
 * 13a, read: `useSearchParams()` from react-router gives you the URL's values; 
 *  - The result count is the filtered total. 
 *  - The sort and category controls show the URL's values.
 * 13b, write: the sort and category controls change the URL with setSearchParams, and go back to page 1.
 * 13c: match live search text with URL and typing doesn't add Back steps; Add <Pagination> back and focus product heading when the page changes
 * 
 */
export function HomePage() {
  //* get search params on every page re-render */
  // when product retrieve succesfully,read the URL from the page for filtering and sorting, 
  const [searchParams, setSearchParams] = useSearchParams()
  const params = parseParams(searchParams);
  const category : string = params.category ?? '';
  const sort : SortValue = params.sort;
  const [searchQuery,setSearchQuery] = useState(params.q);
  const [prevUrlQ, setPrevUrlQ] = useState(params.q);
  // store current params query as an reactive variable so that we can compare it with params.q when rendering the component. make params query matches search query
  if(prevUrlQ !== params.q){
    setPrevUrlQ(params.q);
    setSearchQuery(params.q)
  }

  const useProductsResult = useProducts(params.category) // Get the product load result from useProducts
  const allProducts = useProductsResult.data?.products ?? []
  const matching = filterProducts(allProducts,params.q) // filterProducts with params.q
  const sorted   = sortProducts(matching,params.sort);    

  const totalProductCount = matching.length;
  const pages = totalPages(totalProductCount)
  const currentPage = clampPage(params.page,pages);
  const products = paginate(sorted,currentPage, itemsPerPage);

  const useCategoriesResult = useCategories(); // Get the category load result from useCategories
  const productHeading = useRef<HTMLHeadingElement>(null);
  const wasRetrying = useRef(useProductsResult.isRetrying);
  const categoryOptions: CategoryOption[] = useCategoriesResult.data
  ? useCategoriesResult.data.map(toCategoryOption)
  : [];
  
  //* search effect *//
  const debouncedQ = useDebounce(searchQuery,300); // the value users typing from searchbox
  
  useEffect(()=>{
    if(searchQuery !== debouncedQ) return; // return early if still typing
    if(params.q === debouncedQ) return; // return if URL already matches
    
    setSearchParams(
      serializeParams({...params,q: debouncedQ,page:1}),
      { replace: true }
    )

  },[debouncedQ,params,setSearchParams,searchQuery])

  //* focus product heading effect AFTER retry button is clicked with success result*//
  useEffect(()=>{
    if (wasRetrying.current && useProductsResult.status === "success") {
      focusProductHeading();
    };
    wasRetrying.current = useProductsResult.isRetrying;
  },[useProductsResult.status, useProductsResult.isRetrying]);
  
  
  //* focus product heading *//
  function focusProductHeading(){
    productHeading.current?.focus();
  }

  //START Animation Setup
  // TODO(you) 19: decide "once per session" with sessionStorage. For now the intro always plays.
  const playIntro = true

  const toolbarStyle = playIntro ? ({ '--delay': TOOLBAR_DELAY } as CSSProperties) : undefined
  const gridStyle = playIntro ? ({ '--intro-delay': GRID_DELAY } as CSSProperties) : undefined

  //END Animation Setup
  function renderContent(){
    if(useProductsResult.status === "loading"){
      return <ProductGridSkeleton />
    } 
    if(useProductsResult.status === "error"){
      return <ErrorState message="We couldn't load the products. Check your connection and try again." onRetry={useProductsResult.retry} isRetrying={useProductsResult.isRetrying}/>
    }
    if(products.length === 0 ) return <EmptyState 
      title = "No products..." 
      action = {{label: "Clear filters", onClick:clearAllState}}
      />
      return  <>
                <div style={gridStyle}>
                  {/* v0.1: cards are not links until the product page exists. TODO(you) M4: remove `linked={false}`. */}
                  <ProductGrid products={products.map(toCardProps)} label="Products" linked={false} />
                </div>
                <div className="mt-12">
                    <Pagination currentPage={currentPage} totalPages={pages} hrefForPage={(p)=> hrefForPage(params,p)} onPageChange={focusProductHeading}/>
                </div>
              </>    
  }
  function clearAllState(){
    setSearchQuery('');
    setSearchParams();
  }
  return (
    <>
      <Header homeHref="/" wordmarkIntro={playIntro} />
      <main>
        <Hero tagline="A quiet catalogue of everyday things." playIntro={playIntro}/>

        <section aria-labelledby="products-heading" className="pt-8 pb-16 lg:pb-24">
          <Container>
            <h2 id="products-heading" className="sr-only" tabIndex={-1} ref={productHeading}>
              Products
            </h2>
              <fieldset
                aria-label="Search and filters"
                className={`grid min-w-0 grid-cols-2 gap-x-4 gap-y-4 lg:flex lg:items-end lg:gap-6 ${playIntro ? 'intro-fade' : ''}`}
                style={toolbarStyle}
              >
              <div className="col-span-2 lg:max-w-110 lg:flex-1">
                <SearchBox
                  id="search"
                  label="Search products"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(q) => {
                    setSearchQuery(q);
                  }}
                  onClear={() => {setSearchQuery('')}}
                />
              </div>
              <div className="lg:w-55">
                <CategoryFilter
                  id="category"
                  label="Category"
                  options={categoryOptions}
                  value={category}
                  loading={useCategoriesResult.status === "loading"}
                  onChange={(value) => {
                    // change params
                    setSearchParams(serializeParams({...params, category:value, page:1}));
                  }}
                />
              </div>
              <div className="lg:ml-auto lg:w-55">
                <SortSelect
                  id="sort"
                  label="Sort by"
                  options={sortOptions}
                  value={sort}
                  onChange={(value) => {
                    // change params
                    setSearchParams(serializeParams({...params, sort:value, page:1}));
                  }
                    
                  }
                />
              </div>
              </fieldset>
            <div
              className={`mt-6 mb-6 ${playIntro ? 'intro-fade' : ''}`}
              style={toolbarStyle}
            >
              { useProductsResult.status !== "error" && <ResultCount count={useProductsResult.status === "loading" ? null : totalProductCount} query={params.q} categoryName={
                category.slice(0,1).toUpperCase() + category.slice(1).toLowerCase()
                } onClearFilters={clearAllState}/>}
            </div>
            {renderContent()}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
