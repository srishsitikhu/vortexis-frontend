import { Product } from "./product";

export type CartItem = {
    id: number;
    product: Product
    quantity: number
}