import { Category } from "./category";

type Product = {
    id: number
    name: string;
    description: string | null;
    price: number;
    discountPercent: number;
    imageUrls: string[]
    averageRating: number;
    isFlashSale: boolean;
    category: Category
}