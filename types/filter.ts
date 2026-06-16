export type ProductFilters = {
  search?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isFlashSale?: boolean;
};
