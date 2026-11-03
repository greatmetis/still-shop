import type { Product } from '../api/types'
import type { ProductCardProps,StockBadgeProps } from '../components/types'
import { discountedPrice, formatPrice } from '../lib/format'

/**
 * TODO 3: map an API Product to the props a ProductCard needs (like Entity → ViewModel in
 * .NET MVC). Use your formatters from TODO 2.
 *
 * - href: "/product/<id>"; image: the thumbnail, with the title as alt text
 * - price: the discounted price; originalPrice and discountLabel ("−13%", rounded, with a real minus
 *   sign U+2212) only when there is a discount
 * - stock: from availabilityStatus + stock → "In stock" / "Low stock: 4 left" / "Out of stock"
 * - categoryName: "home-decoration" → "Home Decoration"
 *
 * How to start: in toCardProps.test.ts change `describe.skip` to `describe`. Finish TODOs 1 and 2 first.
 * You'll learn: mapping data for the UI, string handling, array map.
 * Resource: https://javascript.info/array-methods
 */
export function toCardProps(product: Product, index: number): ProductCardProps {
  let catName = product.category.split("-").map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join(" ");
  
  // show rounded discount on the label
  let showDiscount = 
    product.discountPercentage >= 1 
    ? Math.round(product.discountPercentage)
    : Math.round(product.discountPercentage * 10)/10;

  
  // Only show the label when the number would be printed above 0
  let priceBadge = showDiscount > 0 
    ? { price: formatPrice(discountedPrice(product.price, product.discountPercentage)),  
      originalPrice: formatPrice(product.price), 
      discountLabel: `−${showDiscount}%`
    } 
    :{ price: formatPrice(product.price)};
  
  // let stockStatusSlug =  product.availabilityStatus.toLowerCase().replaceAll(" ","-");
  let stockBadge: StockBadgeProps;
  switch(product.availabilityStatus){
    case("Low Stock"):
      stockBadge = { status: 'low-stock', label: `Low stock: ${product.stock} left` };
      break;
    case("In Stock"):
      stockBadge = { status: 'in-stock', label: "In stock"};
      break;
    case("Out of Stock"):
      stockBadge = {status: 'out-of-stock', label:"Out of stock"}
  }

  return  {
    id: product.id,
    href: `/product/${product.id}`,
    title: product.title,
    categoryName: catName,
    image: { src: product.thumbnail, alt: product.title },
    price: priceBadge,
    rating: product.rating,
    stock: stockBadge,
    index,
  }
}


