import type { ReactNode } from 'react'
import { Button } from '../components/Button'
import { ButtonLink } from '../components/ButtonLink'
import { CategoryFilter } from '../components/CategoryFilter'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Pagination } from '../components/Pagination'
import { PriceTag } from '../components/PriceTag'
import { ProductCard } from '../components/ProductCard'
import { ProductGrid } from '../components/ProductGrid'
import { ProductGridSkeleton } from '../components/ProductGridSkeleton'
import { RatingStars } from '../components/RatingStars'
import { ResultCount } from '../components/ResultCount'
import { SearchBox } from '../components/SearchBox'
import { SortSelect } from '../components/SortSelect'
import { StockBadge } from '../components/StockBadge'
import type { SortOption } from '../components/types'
import { mockCardProps } from '../mocks/cardProps'

// A showcase of every component in every state, for looking at (and to learn from).
// Nothing here fetches or remembers anything: every callback is a no-op.
const noop = () => {}
const hrefForPage = (page: number) => `/dev/components?page=${page}`

const sortOptions: SortOption[] = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'title-asc', label: 'Name: A–Z' },
]
const categories = [
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'smartphones', name: 'Smartphones' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="mb-6 font-serif text-h2 lg:text-h2-lg">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-caption font-medium tracking-[0.06em] text-text-muted uppercase">{label}</p>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

export function DevComponentsPage() {
  const sample = mockCardProps[3]
  const sampleCards = [
    { ...sample, id: 1001, index: 0 },
    { ...sample, id: 1002, index: 1, price: { price: '$899.99' }, title: 'No discount' },
    {
      ...sample,
      id: 1003,
      index: 2,
      stock: { status: 'low-stock' as const, label: 'Low stock: 4 left' },
      title: 'Low stock',
    },
    {
      ...sample,
      id: 1004,
      index: 3,
      stock: { status: 'out-of-stock' as const, label: 'Out of stock' },
      title: 'Out of stock',
    },
    {
      ...sample,
      id: 1005,
      index: 4,
      image: { src: 'https://invalid.example/broken.webp', alt: 'Broken image' },
      title: 'Broken image shows initial',
    },
    {
      ...sample,
      id: 1006,
      index: 5,
      title: 'A very long product title that has to be cut after two lines of text',
    },
  ]

  return (
    <>
      <Header homeHref="/" />
      <main>
        <Container className="py-10">
          <h1 className="font-serif text-h1 lg:text-h1-lg">Components</h1>
          <p className="mt-2 text-body text-text-muted">Every component, every state. Development page.</p>

          <Section title="Button">
            <Row label="Primary / secondary / link">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="link">Link</Button>
              <ButtonLink href="/">Primary link</ButtonLink>
            </Row>
            <Row label="Small, disabled, loading">
              <Button size="sm">Small</Button>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button loading>Trying again…</Button>
            </Row>
          </Section>

          <Section title="PriceTag, RatingStars, StockBadge">
            <Row label="PriceTag sm">
              <PriceTag price="$8.99" />
              <PriceTag price="$8.99" originalPrice="$9.99" discountLabel="−10%" />
            </Row>
            <Row label="PriceTag lg">
              <PriceTag price="$8.99" size="lg" />
              <PriceTag price="$8.99" originalPrice="$9.99" discountLabel="−10%" size="lg" />
            </Row>
            <Row label="RatingStars: 0, 2.83, 5 / md with reviews">
              <RatingStars rating={0} />
              <RatingStars rating={2.83} />
              <RatingStars rating={5} />
              <RatingStars rating={4.37} reviewCount={3} size="md" />
            </Row>
            <Row label="StockBadge">
              <StockBadge status="in-stock" label="In stock" />
              <StockBadge status="low-stock" label="Low stock: 4 left" />
              <StockBadge status="out-of-stock" label="Out of stock" />
            </Row>
          </Section>

          <Section title="Header, Hero">
            <Row label="Hero without intro (still). Reload the page to replay the home intro on /.">
              <div className="w-full">
                <Hero tagline="A quiet catalogue of everyday things." playIntro={false} />
              </div>
            </Row>
          </Section>

          <Section title="Toolbar">
            <div className="grid max-w-3xl grid-cols-2 gap-4">
              <div className="col-span-2">
                <SearchBox id="dev-search-empty" label="Search products (empty)" placeholder="Search by name" value="" onChange={noop} onClear={noop} />
              </div>
              <div className="col-span-2">
                <SearchBox id="dev-search-filled" label="Search products (with text)" value="cream" onChange={noop} onClear={noop} />
              </div>
              <CategoryFilter id="dev-cat" label="Category" options={categories} value={null} onChange={noop} />
              <CategoryFilter id="dev-cat-selected" label="Category (selected)" options={categories} value="laptops" onChange={noop} />
              <CategoryFilter id="dev-cat-loading" label="Category (loading)" options={[]} value={null} onChange={noop} loading />
              <SortSelect id="dev-sort" label="Sort by" options={sortOptions} value="default" onChange={noop} />
            </div>
            <Row label="ResultCount: plain / filtered / one / zero">
              <ResultCount count={24} />
              <ResultCount count={3} query="cream" categoryName="Beauty" onClearFilters={noop} />
              <ResultCount count={1} />
              <ResultCount count={0} />
            </Row>
          </Section>

          <Section title="ProductCard (hover them, tab to them)">
            <ProductGrid products={sampleCards} label="Sample cards" />
            <Row label="Single card, narrow (160px)">
              <div className="w-40">
                <ProductCard {...mockCardProps[0]} />
              </div>
            </Row>
          </Section>

          <Section title="ProductGridSkeleton (4 cards)">
            <ProductGridSkeleton count={4} />
          </Section>

          <Section title="Pagination">
            <Row label="Page 1 of 17">
              <Pagination currentPage={1} totalPages={17} hrefForPage={hrefForPage} label="Pagination, start" />
            </Row>
            <Row label="Page 5 of 17">
              <Pagination currentPage={5} totalPages={17} hrefForPage={hrefForPage} label="Pagination, middle" />
            </Row>
            <Row label="Page 17 of 17">
              <Pagination currentPage={17} totalPages={17} hrefForPage={hrefForPage} label="Pagination, end" />
            </Row>
          </Section>

          <Section title="EmptyState, ErrorState">
            <EmptyState
              title="Nothing matches “xyz”."
              message="Try a different word, or look in all categories."
              action={{ label: 'Clear filters', onClick: noop }}
            />
            <EmptyState title="We couldn't find that product." action={{ label: 'Back to catalog', href: '/' }} />
            <ErrorState message="We couldn't load the products. Check your connection and try again." onRetry={noop} />
            <ErrorState message="We couldn't load the products." onRetry={noop} isRetrying />
          </Section>
        </Container>
      </main>
      <Footer />
    </>
  )
}
