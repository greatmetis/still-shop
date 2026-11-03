/**
 * TODO 1: API types for DummyJSON products.
 *
 * Replace each `unknown` placeholder with a real interface or type, written from the real JSON in
 * src/mocks/products.json and https://dummyjson.com/docs/products.
 * - Use `?` for fields that some products don't have (look at several products, e.g. groceries).
 * - `availabilityStatus` is a union of the three values you see in the data, not just `string`.
 * - `reviews` is an array of `Review`. No `any`.
 *
 * How to start: rename src/api/types.test.ts.todo to types.test.ts and run `npm test`.
 * You'll learn: interfaces vs types, optional properties, unions.
 * Resource: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 */

export type Review =  {
  "rating": number,
  "comment": string,
  "date": string,
  "reviewerName": string,
  "reviewerEmail": string
}
export type Product = {
  "id": number,
  "title": string,
  "description":  string,
  "category":  string,
  "price": number,
  "discountPercentage": number,
  "rating": number,
  "stock": number,
  "tags": Array<string>
  "brand"?:  string,
  "sku":  string,
  "weight": number,
  "dimensions": {
    "width": number,
    "height": number,
    "depth": number
  },
  "warrantyInformation": string,
  "shippingInformation": string,
  "availabilityStatus": 'In Stock'|'Low Stock'|'Out of Stock',
  "reviews": Array<Review>,
  "returnPolicy": string,
  "minimumOrderQuantity": number,
  "meta": {
    "createdAt": string,
    "updatedAt": string,
    "barcode":string,
    "qrCode": string
  },
  "thumbnail": string,
  "images": Array<string>
}
export type ProductsResponse = {
  "products": Array<Product>,
  "total": number,
  "skip": number,
  "limit": number
}
export type Category = {
  "slug":string,
  "name":string,
  "url":string
}
