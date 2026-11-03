import { useEffect, useRef, type CSSProperties } from 'react'
import { CategoryFilter } from '../components/CategoryFilter'
import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { ProductGrid } from '../components/ProductGrid'
import { ResultCount } from '../components/ResultCount'
import { SearchBox } from '../components/SearchBox'
import { SortSelect } from '../components/SortSelect'
import type { CategoryOption, SortOption } from '../components/types'
import categoriesJson from '../mocks/categories.json'
import { toCardProps } from '../mappers/toCardProps'
import type { Product} from '../api/types'
import { useProducts } from '../hooks/useProducts'
import { ErrorState } from '../components/ErrorState'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import { EmptyState } from '../components/EmptyState'

const sortOptions: SortOption[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'rating-asc', label: 'Rating: low to high' },
  { value: 'title-asc', label: 'Name: A–Z' },
  { value: 'title-desc', label: 'Name: Z–A' },
]

// The mock JSON has extra fields (url); the filter only needs slug + name.
const categoryOptions: CategoryOption[] = categoriesJson.map(({ slug, name }) => ({ slug, name }))

// Used by the intro: how long (ms) to wait before the catalog fades in / the cards start to reveal.
const TOOLBAR_DELAY = '700ms'
const GRID_DELAY = '1200ms'
const itemsPerPage = 12

export function HomePage() {
  const useProductsResult = useProducts(); // Get the product load result from useProducts
  const productHeading = useRef<HTMLHeadingElement>(null);
  const wasRetrying = useRef(useProductsResult.isRetrying);
  const totalProductCount = useProductsResult.data?.total ?? null;
    
  const products : Product[] = useProductsResult.data 
  ? useProductsResult.data.products
  : []

  
  useEffect(()=>{
    // Focus the products heading after retry button is clicked with success result.
    if (wasRetrying.current && useProductsResult.status === "success") {
      productHeading.current?.focus();
    };
    wasRetrying.current = useProductsResult.isRetrying;
  },[useProductsResult.status, useProductsResult.isRetrying]);
  

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
    if(products.length === 0 ) return <EmptyState title="No products..."/>
      return  <>
                <div style={gridStyle}>
                  {/* v0.1: cards are not links until the product page exists. TODO(you) M4: remove `linked={false}`. */}
                  <ProductGrid products={products.slice(0,itemsPerPage).map(toCardProps)} label="Products" linked={false} />
                </div>

                {/* v0.1: pagination is hidden because pages 2+ would show page 1 again.
                    TODO(you) 12/13: bring back <Pagination> with totalPages = Math.ceil(total / itemsPerPage) and real links (M3). */}
              </>    
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
              {/* Toolbar: search, category, sort. Disabled ("coming soon") until M3 (TODO 13): remove the `disabled` props and the note then. */}
              <fieldset
                aria-describedby="toolbar-note"
                aria-label="Search and filters"
                className={`grid min-w-0 grid-cols-2 gap-x-4 gap-y-4 lg:flex lg:items-end lg:gap-6 ${playIntro ? 'intro-fade' : ''}`}
                style={toolbarStyle}
              >
              <div className="col-span-2 lg:max-w-110 lg:flex-1">
                <SearchBox
                  id="search"
                  label="Search products"
                  placeholder="Search by name"
                  value=""
                  // TODO(you) 13: update the search text in state and (debounced) the URL in M3.
                  onChange={() => {}}
                  onClear={() => {}}
                  disabled
                />
              </div>
              <div className="lg:w-55">
                <CategoryFilter
                  id="category"
                  label="Category"
                  options={categoryOptions}
                  value={null}
                  disabled
                  // TODO(you) 13: write the chosen category to the URL in M3.
                  onChange={() => {}}
                />
              </div>
              <div className="lg:ml-auto lg:w-55">
                <SortSelect
                  id="sort"
                  label="Sort by"
                  options={sortOptions}
                  value="default"
                  disabled
                  // TODO(you) 13: write the chosen sort to the URL in M3.
                  onChange={() => {}}
                />
              </div>
              </fieldset>
              <p id="toolbar-note" className={`${playIntro ? 'intro-fade' : ''} my-4 col-span-2 text-small text-text-muted lg:order-last lg:col-span-1 lg:self-center`}>
                Search and filters function coming soon
              </p>
            

            <div
              className={`mt-6 mb-6 ${playIntro ? 'intro-fade' : ''}`}
              style={toolbarStyle}
            >
              { useProductsResult.status !== "error" && <ResultCount count={totalProductCount} />}
            </div>
            {renderContent()}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
