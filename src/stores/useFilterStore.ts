import { create } from "zustand";

interface FilterState {
  query: string;
  categoryId: number | null;
  brand: string;
  type: string;
  application: string;
  innerDiameterMin: number;
  innerDiameterMax: number;
  outerDiameterMin: number;
  outerDiameterMax: number;
  widthMin: number;
  widthMax: number;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  sortBy: string;
  page: number;
}

interface FilterStore extends FilterState {
  setQuery: (q: string) => void;
  setCategory: (c: number | null) => void;
  setBrand: (b: string) => void;
  setType: (t: string) => void;
  setApplication: (a: string) => void;
  setInnerDiameter: (min: number, max: number) => void;
  setOuterDiameter: (min: number, max: number) => void;
  setWidth: (min: number, max: number) => void;
  setPriceRange: (min: number, max: number) => void;
  setInStock: (v: boolean) => void;
  setSortBy: (s: string) => void;
  setPage: (p: number) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  query: "",
  categoryId: null,
  brand: "",
  type: "",
  application: "",
  innerDiameterMin: 8,
  innerDiameterMax: 100,
  outerDiameterMin: 22,
  outerDiameterMax: 215,
  widthMin: 7,
  widthMax: 47,
  minPrice: 0,
  maxPrice: 500,
  inStock: false,
  sortBy: "relevance",
  page: 1,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setQuery: (q: string) => set({ query: q, page: 1 }),
  setCategory: (c: number | null) => set({ categoryId: c, page: 1 }),
  setBrand: (b: string) => set({ brand: b, page: 1 }),
  setType: (t: string) => set({ type: t, page: 1 }),
  setApplication: (a: string) => set({ application: a, page: 1 }),
  setInnerDiameter: (min: number, max: number) => set({ innerDiameterMin: min, innerDiameterMax: max, page: 1 }),
  setOuterDiameter: (min: number, max: number) => set({ outerDiameterMin: min, outerDiameterMax: max, page: 1 }),
  setWidth: (min: number, max: number) => set({ widthMin: min, widthMax: max, page: 1 }),
  setPriceRange: (min: number, max: number) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setInStock: (v: boolean) => set({ inStock: v, page: 1 }),
  setSortBy: (s: string) => set({ sortBy: s }),
  setPage: (p: number) => set({ page: p }),
  resetFilters: () => set({ ...initialState }),
}));
