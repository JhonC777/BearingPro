import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, X, Star, Plus, Check,
  ChevronDown, Grid3X3, LayoutList, RotateCcw
} from "lucide-react";
import { localProducts, brands, bearingTypes, applications, dimensionsRanges } from "@/data/products";
import { useCartStore } from "@/stores/useCartStore";
import { useFilterStore } from "@/stores/useFilterStore";
import { trpc } from "@/providers/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function parseDimension(specs: Record<string, string>, key: string): number {
  const val = specs[key];
  if (!val) return 0;
  const match = val.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function Shop() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlQuery = queryParams.get("q") || "";
  const urlCategory = queryParams.get("categoria") || "";

  const {
    query, setQuery, categoryId, setCategory, brand, setBrand,
    application, setApplication, innerDiameterMin, innerDiameterMax,
    outerDiameterMin, outerDiameterMax, widthMin, widthMax,
    minPrice, maxPrice, setPriceRange, inStock, setInStock, sortBy, setSortBy, page, setPage, resetFilters
  } = useFilterStore();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (urlQuery) setQuery(urlQuery);
    if (urlCategory) setCategory(parseInt(urlCategory));
  }, [urlQuery, urlCategory]);

  const { data: trpcData, isLoading: trpcLoading } = trpc.products.list.useQuery({
    query: query || undefined,
    categoryId: categoryId || undefined,
    brand: brand || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    inStock: inStock || undefined,
    sortBy: sortBy || undefined,
    page,
    limit: 12,
  }, { retry: false });

  // Fallback to local data if trpc fails
  const allProducts = trpcData?.products || localProducts;

  // Apply dimension filters locally on top of trpc/local data
  const filteredProducts = allProducts.filter((p) => {
    const inner = parseDimension(p.specs, "Diámetro interior");
    const outer = parseDimension(p.specs, "Diámetro exterior");
    const width = parseDimension(p.specs, "Ancho") || parseDimension(p.specs, "Ancho total");

    if (inner && (inner < innerDiameterMin || inner > innerDiameterMax)) return false;
    if (outer && (outer < outerDiameterMin || outer > outerDiameterMax)) return false;
    if (width && (width < widthMin || width > widthMax)) return false;

    if (application && !p.tags.includes(application)) return false;

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / 12) || 1;
  const paginated = filteredProducts.slice((page - 1) * 12, page * 12);

  const addItem = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.addItem);
  const cartItems = useCartStore((s: import("@/stores/useCartStore").CartStoreType) => s.items);
  const isInCart = (id: number) => cartItems.some((i) => i.productId === id);

  const handleAdd = (product: { id: number; sku: string; name: string; price: number; imageUrl: string; slug: string; brand: string }) => {
    addItem({
      productId: product.id, sku: product.sku, name: product.name,
      price: product.price, imageUrl: product.imageUrl, slug: product.slug, brand: product.brand,
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#f0f0f5] mb-1">Catálogo Industrial</h1>
            <p className="text-sm text-[#a0a0b0]">{filteredProducts.length} productos disponibles</p>
          </div>
          <div className="flex items-center gap-3">
            <form onSubmit={(e) => { e.preventDefault(); }} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b7b]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar SKU, modelo..."
                className="w-[260px] h-10 pl-9 pr-4 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm text-[#f0f0f5] placeholder-[#6b6b7b] outline-none focus:border-[#2563eb]"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-[#6b6b7b]" />
                </button>
              )}
            </form>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 h-10 px-4 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-xl text-sm text-[#a0a0b0] hover:text-[#f0f0f5] transition-colors md:hidden">
              <SlidersHorizontal className="w-4 h-4" /> Filtros
            </button>
            <div className="hidden md:flex items-center gap-1 bg-[#22222e] rounded-xl p-1">
              <button onClick={() => setViewMode("grid")} className={cn("w-8 h-8 flex items-center justify-center rounded-lg transition-colors", viewMode === "grid" ? "bg-[#2563eb] text-white" : "text-[#6b6b7b]")}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("w-8 h-8 flex items-center justify-center rounded-lg transition-colors", viewMode === "list" ? "bg-[#2563eb] text-white" : "text-[#6b6b7b]")}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-[320px] bg-[#111118] border-r border-[rgba(255,255,255,0.06)] p-6 overflow-auto transition-transform md:static md:w-[260px] md:bg-transparent md:border-0 md:p-0 md:overflow-visible",
            showFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h3 className="text-lg font-semibold text-[#f0f0f5]">Filtros</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-[#a0a0b0]" /></button>
            </div>

            {/* Reset */}
            <button onClick={resetFilters} className="flex items-center gap-2 text-xs text-[#ef4444] hover:text-[#f87171] mb-6 transition-colors">
              <RotateCcw className="w-3 h-3" /> Restablecer filtros
            </button>

            {/* Category */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#f0f0f5] uppercase tracking-wider mb-3">Categoría</h4>
              <div className="space-y-2">
                {bearingTypes.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer group">
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", categoryId === b.id ? "bg-[#2563eb] border-[#2563eb]" : "border-[#6b6b7b] group-hover:border-[#a0a0b0]")}>
                      {categoryId === b.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="radio" name="category" className="hidden" checked={categoryId === b.id} onChange={() => setCategory(b.id)} />
                    <span className={cn("text-sm", categoryId === b.id ? "text-[#f0f0f5]" : "text-[#a0a0b0]")}>{b.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#f0f0f5] uppercase tracking-wider mb-3">Marca</h4>
              <div className="space-y-2">
                {brands.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer group">
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", brand === b ? "bg-[#2563eb] border-[#2563eb]" : "border-[#6b6b7b] group-hover:border-[#a0a0b0]")}>
                      {brand === b && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="radio" name="brand" className="hidden" checked={brand === b} onChange={() => setBrand(b)} />
                    <span className={cn("text-sm", brand === b ? "text-[#f0f0f5]" : "text-[#a0a0b0]")}>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Application */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#f0f0f5] uppercase tracking-wider mb-3">Aplicación</h4>
              <div className="space-y-2">
                {applications.map((a) => (
                  <label key={a.id} className="flex items-center gap-2 cursor-pointer group">
                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", application === a.id ? "bg-[#2563eb] border-[#2563eb]" : "border-[#6b6b7b] group-hover:border-[#a0a0b0]")}>
                      {application === a.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input type="radio" name="application" className="hidden" checked={application === a.id} onChange={() => setApplication(a.id)} />
                    <span className={cn("text-sm", application === a.id ? "text-[#f0f0f5]" : "text-[#a0a0b0]")}>{a.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#f0f0f5] uppercase tracking-wider mb-3">Dimensiones</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-[#6b6b7b] mb-1">
                    <span>Ø Interior</span>
                    <span>{innerDiameterMin}-{innerDiameterMax} mm</span>
                  </div>
                  <input type="range" min={dimensionsRanges.innerMin} max={dimensionsRanges.innerMax} value={innerDiameterMax} onChange={(e) => useFilterStore.getState().setInnerDiameter(innerDiameterMin, parseInt(e.target.value))} className="w-full accent-[#2563eb]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#6b6b7b] mb-1">
                    <span>Ø Exterior</span>
                    <span>{outerDiameterMin}-{outerDiameterMax} mm</span>
                  </div>
                  <input type="range" min={dimensionsRanges.outerMin} max={dimensionsRanges.outerMax} value={outerDiameterMax} onChange={(e) => useFilterStore.getState().setOuterDiameter(outerDiameterMin, parseInt(e.target.value))} className="w-full accent-[#2563eb]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#6b6b7b] mb-1">
                    <span>Ancho</span>
                    <span>{widthMin}-{widthMax} mm</span>
                  </div>
                  <input type="range" min={dimensionsRanges.widthMin} max={dimensionsRanges.widthMax} value={widthMax} onChange={(e) => useFilterStore.getState().setWidth(widthMin, parseInt(e.target.value))} className="w-full accent-[#2563eb]" />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-[#f0f0f5] uppercase tracking-wider mb-3">Precio</h4>
              <div className="flex items-center gap-2 mb-2">
                <input type="number" value={minPrice} onChange={(e) => setPriceRange(parseInt(e.target.value) || 0, maxPrice)} className="w-full h-9 px-3 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-[#f0f0f5] outline-none" />
                <span className="text-[#6b6b7b]">-</span>
                <input type="number" value={maxPrice} onChange={(e) => setPriceRange(minPrice, parseInt(e.target.value) || 500)} className="w-full h-9 px-3 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-[#f0f0f5] outline-none" />
              </div>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", inStock ? "bg-[#2563eb] border-[#2563eb]" : "border-[#6b6b7b]")}>
                  {inStock && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                <span className="text-sm text-[#a0a0b0]">Solo en stock</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#6b6b7b]">Mostrando {paginated.length} de {filteredProducts.length} productos</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6b6b7b]">Ordenar:</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none h-9 pl-3 pr-8 bg-[#22222e] border border-[rgba(255,255,255,0.06)] rounded-lg text-xs text-[#f0f0f5] outline-none cursor-pointer">
                    <option value="relevance">Relevancia</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorados</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b6b7b] pointer-events-none" />
                </div>
              </div>
            </div>

            {trpcLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Search className="w-10 h-10 text-[#22222e] mb-3" />
                <p className="text-sm text-[#a0a0b0] mb-2">No se encontraron productos</p>
                <button onClick={resetFilters} className="text-xs text-[#2563eb] hover:underline">Limpiar filtros</button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="group bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden hover:border-[rgba(37,99,235,0.3)] transition-all">
                      <Link to={`/producto/${product.slug}`} className="block relative bg-[#22222e] aspect-square overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        {product.bestSeller && (
                          <span className="absolute top-3 left-3 bg-[#f59e0b] text-[#0a0a0f] text-[10px] font-bold px-2 py-1 rounded">TOP</span>
                        )}
                        <span className="absolute bottom-3 left-3 bg-[#10b981] text-white text-[10px] font-semibold px-2 py-1 rounded">{product.stock} en stock</span>
                      </Link>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-[11px] text-[#6b6b7b]">{product.sku}</span>
                          <span className="text-[10px] text-[#a0a0b0] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">{product.brand}</span>
                        </div>
                        <Link to={`/producto/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-[#f0f0f5] mb-2 line-clamp-2 group-hover:text-[#3b82f6] transition-colors">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-3">
                          {Array.from({ length: 5 }, (_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#22222e]"}`} />
                          ))}
                          <span className="text-[10px] text-[#6b6b7b] ml-1">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-[#2563eb]">€{product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                              <span className="text-xs text-[#6b6b7b] line-through ml-2">€{product.oldPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAdd(product)}
                            disabled={isInCart(product.id)}
                            className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", isInCart(product.id) ? "bg-[#10b981] text-white" : "bg-[#22222e] text-[#f0f0f5] hover:bg-[#2563eb]")}
                          >
                            {isInCart(product.id) ? <><Check className="w-3 h-3" /> Añadido</> : <><Plus className="w-3 h-3" /> Añadir</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginated.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link to={`/producto/${product.slug}`} className="group flex gap-4 p-4 bg-[rgba(17,17,24,0.7)] border border-[rgba(255,255,255,0.06)] rounded-2xl hover:border-[rgba(37,99,235,0.3)] transition-all">
                      <div className="w-24 h-24 shrink-0 bg-[#22222e] rounded-xl overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] text-[#6b6b7b]">{product.sku}</span>
                          <span className="text-[10px] text-[#a0a0b0] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded">{product.brand}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#f0f0f5] group-hover:text-[#3b82f6] transition-colors">{product.name}</h3>
                        <p className="text-xs text-[#a0a0b0] mt-1 line-clamp-2">{product.shortDescription}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, j) => (
                              <Star key={j} className={`w-3 h-3 ${j < Math.floor(product.rating) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-[#22222e]"}`} />
                            ))}
                          </div>
                          <span className="text-xs text-[#6b6b7b]">{product.stock} en stock</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end justify-between">
                        <div className="text-right">
                          <span className="text-lg font-bold text-[#2563eb]">€{product.price.toFixed(2)}</span>
                          {product.oldPrice && <span className="block text-xs text-[#6b6b7b] line-through">€{product.oldPrice.toFixed(2)}</span>}
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(product); }}
                          disabled={isInCart(product.id)}
                          className={cn("flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", isInCart(product.id) ? "bg-[#10b981] text-white" : "bg-[#22222e] text-[#f0f0f5] hover:bg-[#2563eb]")}
                        >
                          {isInCart(product.id) ? <><Check className="w-3 h-3" /> Añadido</> : <><Plus className="w-3 h-3" /> Añadir</>}
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#22222e] text-[#a0a0b0] hover:bg-[#2563eb] hover:text-white disabled:opacity-40 transition-colors">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={cn("w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors", page === p ? "bg-[#2563eb] text-white" : "bg-[#22222e] text-[#a0a0b0] hover:text-[#f0f0f5]")}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#22222e] text-[#a0a0b0] hover:bg-[#2563eb] hover:text-white disabled:opacity-40 transition-colors">
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
