import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Eye,
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Grid3X3,
  LayoutGrid,
  RotateCcw
} from 'lucide-react';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/brandData';
import { formatPrice } from '../utils/formatCurrency';
import { fetchMedusaProducts } from '../services/medusa';

const CATEGORIES = [
  { id: 'all', label: 'All Creations' },
  { id: 'outerwear', label: 'Trenches & Outerwear' },
  { id: 'jackets', label: 'Tailored Jackets & Suits' },
  { id: 'dresses', label: 'Dresses & Skirts' },
  { id: 'pants', label: 'Pants, Shorts & Bermudas' },
  { id: 'blouses', label: 'Blouses, Shirts & Tops' },
  { id: 'accessories', label: 'Accessories & Leather Goods' }
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Price Tiers', min: 0, max: Infinity },
  { id: 'under-800', label: 'Under €800', min: 0, max: 799 },
  { id: '800-1400', label: '€800 – €1,400', min: 800, max: 1400 },
  { id: '1400-2000', label: '€1,400 – €2,000', min: 1401, max: 2000 },
  { id: 'over-2000', label: '€2,000 & Above', min: 2001, max: Infinity }
];

const COLOR_SWATCH_MAP = {
  black: '#141418',
  white: '#f5f5f2',
  red: '#b92b27',
  blue: '#2563eb',
  'navy blue': '#1e293b',
  green: '#15803d',
  beige: '#d6c7b2',
  brown: '#6b4423',
  ivory: '#fffff0',
  gold: '#dfc47d',
  'golden beige': '#c8ad7f',
  silver: '#c0c0c8',
  pink: '#ec4899',
  yellow: '#eab308',
  turquoise: '#0d9488',
  violet: '#7c3aed',
  malva: '#9d6b84',
  grey: '#6b7280',
  gray: '#6b7280'
};

function getSwatchColor(colorName) {
  const lower = (colorName || '').toLowerCase();
  if (COLOR_SWATCH_MAP[lower]) return COLOR_SWATCH_MAP[lower];
  for (const [key, hex] of Object.entries(COLOR_SWATCH_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return '#dfc47d';
}

export default function ShopPage({
  currency,
  initialCategory = 'all',
  onSelectProduct,
  onAddToCart,
  onBackToHome
}) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const ITEMS_PER_PAGE = 18;

  useEffect(() => {
    setSelectedCategory(initialCategory || 'all');
  }, [initialCategory]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const live = await fetchMedusaProducts();
        if (mounted && live && live.length > 0) {
          setProducts(live);
        }
      } catch (e) {
        console.warn('Could not load store products:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Reset pagination when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedSizes, selectedColors, onlyInStock, sortBy]);

  // Extract available sizes and colors dynamically with counts
  const { allSizes, allColors, categoryCounts, inStockCount } = useMemo(() => {
    const sizeCounts = new Map();
    const colorCounts = new Map();
    const catCounts = { all: products.length };
    let stockCount = 0;

    for (const p of products) {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      if (p.inStock) stockCount += 1;

      for (const sz of p.sizes || []) {
        const clean = String(sz).trim();
        if (clean && clean.toLowerCase() !== 'default title') {
          sizeCounts.set(clean, (sizeCounts.get(clean) || 0) + 1);
        }
      }
      for (const col of p.availableColors || []) {
        const clean = String(col).trim();
        if (clean && clean.toLowerCase() !== 'default title') {
          colorCounts.set(clean, (colorCounts.get(clean) || 0) + 1);
        }
      }
    }

    const sizeOrder = ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56', 'XS', 'S', 'M', 'L', 'XL'];
    const sortedSizes = [...sizeCounts.entries()]
      .sort((a, b) => {
        const ia = sizeOrder.indexOf(a[0].toUpperCase());
        const ib = sizeOrder.indexOf(b[0].toUpperCase());
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return b[1] - a[1];
      })
      .slice(0, 16)
      .map(([value, count]) => ({ value, count }));

    const sortedColors = [...colorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([value, count]) => ({ value, count }));

    return {
      allSizes: sortedSizes,
      allColors: sortedColors,
      categoryCounts: catCounts,
      inStockCount: stockCount
    };
  }, [products]);

  // Apply all filters & sorting
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const priceObj = PRICE_RANGES.find((r) => r.id === selectedPriceRange) || PRICE_RANGES[0];

    let list = products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (onlyInStock && !p.inStock) return false;
      if (p.priceEUR < priceObj.min || p.priceEUR > priceObj.max) return false;

      if (q) {
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchCat = (p.categoryLabel || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      if (selectedSizes.length > 0) {
        const pSizes = (p.sizes || []).map((s) => String(s).toLowerCase());
        const hasSize = selectedSizes.some((s) => pSizes.includes(s.toLowerCase()));
        if (!hasSize) return false;
      }

      if (selectedColors.length > 0) {
        const pColors = (p.availableColors || []).map((c) => String(c).toLowerCase());
        const hasColor = selectedColors.some((c) =>
          pColors.some((pc) => pc.includes(c.toLowerCase()) || c.toLowerCase().includes(pc))
        );
        if (!hasColor) return false;
      }

      return true;
    });

    if (sortBy === 'in-stock') {
      list = [...list].sort((a, b) => Number(b.inStock) - Number(a.inStock) || (b.totalStock || 0) - (a.totalStock || 0));
    } else if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.priceEUR - b.priceEUR);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.priceEUR - a.priceEUR);
    } else if (sortBy === 'title-asc') {
      list = [...list].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedSizes, selectedColors, onlyInStock, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSize = (sz) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((item) => item !== sz) : [...prev, sz]
    );
  };

  const toggleColor = (col) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((item) => item !== col) : [...prev, col]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length;

  const renderFilterSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.85rem' }}>
      {/* Search Box */}
      <div>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-serif-display)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold-primary)',
          marginBottom: '0.65rem'
        }}>
          Search Boutique
        </label>
        <div style={{ position: 'relative' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Trench, jacket, dress, suede..."
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(223, 196, 125, 0.22)',
              borderRadius: '3px',
              padding: '0.65rem 2.2rem 0.65rem 2.4rem',
              color: '#f5f4f0',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.6rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Availability Toggle */}
      <div style={{
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-serif-display)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold-primary)',
          marginBottom: '0.75rem'
        }}>
          Availability
        </span>

        <button
          onClick={() => setOnlyInStock(!onlyInStock)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.7rem 0.9rem',
            borderRadius: '3px',
            background: onlyInStock ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: onlyInStock ? '1px solid rgba(16, 185, 129, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: onlyInStock ? '#34d399' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: onlyInStock ? '#10b981' : 'rgba(255,255,255,0.25)'
            }} />
            <span>Ready to Ship (In Stock)</span>
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-serif-display)',
            opacity: 0.85
          }}>
            {inStockCount}
          </span>
        </button>
      </div>

      {/* Category Filter */}
      <div style={{
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-serif-display)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold-primary)',
          marginBottom: '0.75rem'
        }}>
          Collections
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '3px',
                  background: active ? 'rgba(223, 196, 125, 0.16)' : 'transparent',
                  border: active ? '1px solid rgba(223, 196, 125, 0.35)' : '1px solid transparent',
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  color: active ? 'var(--gold-primary)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-serif-display)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div style={{
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-serif-display)',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold-primary)',
          marginBottom: '0.75rem'
        }}>
          Price Tier
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {PRICE_RANGES.map((range) => {
            const active = selectedPriceRange === range.id;
            return (
              <button
                key={range.id}
                onClick={() => setSelectedPriceRange(range.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '3px',
                  background: active ? 'rgba(223, 196, 125, 0.16)' : 'transparent',
                  border: active ? '1px solid rgba(223, 196, 125, 0.35)' : '1px solid transparent',
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{range.label}</span>
                {active && <Check size={13} color="var(--gold-primary)" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div style={{
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)'
          }}>
            Size
          </span>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => setSelectedSizes([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
          {allSizes.map(({ value }) => {
            const active = selectedSizes.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleSize(value)}
                style={{
                  padding: '0.45rem 0.25rem',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-serif-display)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  background: active ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.03)',
                  color: active ? '#0d0d12' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.18s ease'
                }}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)'
          }}>
            Leather Shade
          </span>
          {selectedColors.length > 0 && (
            <button
              onClick={() => setSelectedColors([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Reset
            </button>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {allColors.map(({ value, count }) => {
            const active = selectedColors.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleColor(value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.38rem 0.65rem',
                  borderRadius: '3px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  background: active ? 'rgba(223, 196, 125, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: active ? 'var(--gold-light)' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.18s ease'
                }}
              >
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: getSwatchColor(value),
                  border: '1px solid rgba(255,255,255,0.35)',
                  flexShrink: 0
                }} />
                <span>{value}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear All Action */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.7rem',
            borderRadius: '3px',
            background: 'rgba(223, 196, 125, 0.08)',
            border: '1px solid rgba(223, 196, 125, 0.3)',
            color: 'var(--gold-light)',
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} />
          <span>Reset All Filters ({activeFilterCount})</span>
        </button>
      )}
    </div>
  );

  return (
    <section style={{
      minHeight: '100vh',
      paddingTop: '105px',
      paddingBottom: '6rem',
      background: '#08080c',
      position: 'relative'
    }}>
      <div className="container" style={{ maxWidth: '1440px' }}>
        {/* Boutique Top Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.92) 0%, rgba(10, 10, 15, 0.98) 100%)',
          border: '1px solid rgba(223, 196, 125, 0.22)',
          borderRadius: '4px',
          padding: '2.25rem 2.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Breadcrumb & Back Link */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <button
              onClick={onBackToHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(223, 196, 125, 0.25)',
                color: 'var(--gold-light)',
                padding: '0.45rem 0.95rem',
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.7rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase'
              }}
            >
              <ArrowLeft size={14} />
              <span>Return to The House</span>
            </button>

            <div style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)'
            }}>
              Rovaniemi Atelier • Direct Worldwide Dispatch
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
                fontWeight: 400,
                color: '#ffffff',
                letterSpacing: '0.04em',
                marginBottom: '0.4rem'
              }}>
                The Online <span className="text-gold-gradient" style={{ fontWeight: 600 }}>Boutique</span>
              </h1>
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                maxWidth: '680px'
              }}>
                Explore our complete collection of {products.length} handcrafted Arctic reindeer leather creations. Filter by silhouette, size, shade, or immediate availability.
              </p>
            </div>

            {/* Quick Category Pills Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-serif-display)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      background: active ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.04)',
                      color: active ? '#0d0d12' : 'var(--text-secondary)',
                      border: active ? 'none' : '1px solid rgba(223, 196, 125, 0.2)',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label} ({categoryCounts[cat.id] || 0})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Store Layout: Sidebar + Product Grid */}
        <div className="boutique-layout" style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '2.25rem',
          alignItems: 'start'
        }}>
          {/* Left Sticky Sidebar (Desktop) */}
          <aside
            className="boutique-sidebar-desktop"
            style={{
              background: 'rgba(14, 14, 20, 0.9)',
              border: '1px solid rgba(223, 196, 125, 0.18)',
              borderRadius: '4px',
              padding: '1.5rem',
              position: 'sticky',
              top: '95px',
              maxHeight: 'calc(100vh - 115px)',
              overflowY: 'auto'
            }}
          >
            {renderFilterSidebarContent()}
          </aside>

          {/* Right Column: Toolbar + Active Filters + Grid + Pagination */}
          <div>
            {/* Top Toolbar */}
            <div style={{
              background: 'rgba(14, 14, 20, 0.85)',
              border: '1px solid rgba(223, 196, 125, 0.16)',
              borderRadius: '4px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Mobile Filter Trigger */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="boutique-mobile-filter-btn"
                  style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.9rem',
                    background: 'var(--gold-gradient)',
                    color: '#0d0d12',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>

                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: 'var(--text-primary)'
                }}>
                  Showing <strong style={{ color: 'var(--gold-light)' }}>{filteredProducts.length}</strong> of {products.length} Creations
                </span>
              </div>

              {/* Right Controls: Sort & Grid Columns */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-serif-display)'
                  }}>
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(223, 196, 125, 0.28)',
                      color: 'var(--gold-light)',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '3px',
                      fontFamily: 'var(--font-serif-display)',
                      fontSize: '0.74rem',
                      letterSpacing: '0.08em',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="featured" style={{ background: '#12121a' }}>Featured Curated</option>
                    <option value="in-stock" style={{ background: '#12121a' }}>Ready to Ship First</option>
                    <option value="price-asc" style={{ background: '#12121a' }}>Price: Low to High</option>
                    <option value="price-desc" style={{ background: '#12121a' }}>Price: High to Low</option>
                    <option value="title-asc" style={{ background: '#12121a' }}>Alphabetical: A – Z</option>
                  </select>
                </div>

                {/* Desktop Grid Density Toggle */}
                <div className="boutique-grid-toggle" style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => setGridCols(3)}
                    title="3 Columns View"
                    style={{
                      padding: '0.4rem',
                      background: gridCols === 3 ? 'rgba(223, 196, 125, 0.2)' : 'transparent',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      color: gridCols === 3 ? 'var(--gold-primary)' : 'var(--text-muted)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    title="4 Columns Compact View"
                    style={{
                      padding: '0.4rem',
                      background: gridCols === 4 ? 'rgba(223, 196, 125, 0.2)' : 'transparent',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      color: gridCols === 4 ? 'var(--gold-primary)' : 'var(--text-muted)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Grid3X3 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '1.25rem'
              }}>
                {selectedCategory !== 'all' && (
                  <span style={chipStyle} onClick={() => setSelectedCategory('all')}>
                    Collection: {CATEGORIES.find((c) => c.id === selectedCategory)?.label} <X size={12} />
                  </span>
                )}
                {onlyInStock && (
                  <span style={chipStyle} onClick={() => setOnlyInStock(false)}>
                    Ready to Ship Only <X size={12} />
                  </span>
                )}
                {selectedPriceRange !== 'all' && (
                  <span style={chipStyle} onClick={() => setSelectedPriceRange('all')}>
                    {PRICE_RANGES.find((r) => r.id === selectedPriceRange)?.label} <X size={12} />
                  </span>
                )}
                {selectedSizes.map((sz) => (
                  <span key={sz} style={chipStyle} onClick={() => toggleSize(sz)}>
                    Size: {sz} <X size={12} />
                  </span>
                ))}
                {selectedColors.map((col) => (
                  <span key={col} style={chipStyle} onClick={() => toggleColor(col)}>
                    Shade: {col} <X size={12} />
                  </span>
                ))}
                {searchQuery.trim() && (
                  <span style={chipStyle} onClick={() => setSearchQuery('')}>
                    “{searchQuery}” <X size={12} />
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold-primary)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-serif-display)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    marginLeft: '0.4rem'
                  }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div style={{
                background: 'rgba(14, 14, 20, 0.7)',
                border: '1px solid rgba(223, 196, 125, 0.2)',
                borderRadius: '4px',
                padding: '4rem 2rem',
                textAlign: 'center'
              }}>
                <Sparkles size={28} color="var(--gold-primary)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.35rem',
                  color: '#ffffff',
                  marginBottom: '0.5rem'
                }}>
                  No Creations Match Your Current Filter Selection
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Try removing one of your active size, shade, or price filters to explore more handcrafted pieces.
                </p>
                <button onClick={clearAllFilters} className="btn-primary">
                  <RotateCcw size={14} />
                  <span>Reset All Boutique Filters</span>
                </button>
              </div>
            ) : (
              <>
                {/* Product Cards Grid */}
                <div
                  className="boutique-products-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: gridCols === 4
                      ? 'repeat(auto-fill, minmax(235px, 1fr))'
                      : 'repeat(auto-fill, minmax(290px, 1fr))',
                    gap: '1.75rem',
                    marginBottom: '3rem'
                  }}
                >
                  {paginatedProducts.map((product) => {
                    const isHovered = hoveredProductId === product.id;
                    const displayImg = isHovered && product.secondImage ? product.secondImage : product.image;

                    return (
                      <div
                        key={product.id}
                        className="glass-card"
                        onMouseEnter={() => setHoveredProductId(product.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        onClick={() => onSelectProduct(product)}
                        style={{
                          borderRadius: '4px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'transform 0.35s ease, box-shadow 0.35s ease'
                        }}
                      >
                        {/* Image Container */}
                        <div style={{
                          position: 'relative',
                          height: gridCols === 4 ? '330px' : '380px',
                          overflow: 'hidden',
                          background: '#12121a'
                        }}>
                          <img
                            src={displayImg}
                            alt={product.title}
                            loading="lazy"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                              transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                            }}
                          />

                          {/* Availability / Couture Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '0.85rem',
                            left: '0.85rem',
                            background: 'rgba(9, 9, 13, 0.88)',
                            backdropFilter: 'blur(8px)',
                            border: product.inStock
                              ? '1px solid rgba(16, 185, 129, 0.45)'
                              : '1px solid rgba(223, 196, 125, 0.3)',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '2px',
                            fontFamily: 'var(--font-serif-display)',
                            fontSize: '0.62rem',
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            color: product.inStock ? '#34d399' : 'var(--gold-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            {product.inStock && (
                              <span style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#10b981'
                              }} />
                            )}
                            <span>{product.inStock ? 'In Stock' : product.badge}</span>
                          </div>

                          {/* Quick View Eye Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProduct(product);
                            }}
                            title="Quick View Creation"
                            style={{
                              position: 'absolute',
                              bottom: '0.85rem',
                              right: '0.85rem',
                              background: 'rgba(9, 9, 13, 0.88)',
                              backdropFilter: 'blur(8px)',
                              border: '1px solid rgba(223, 196, 125, 0.35)',
                              borderRadius: '50%',
                              width: '38px',
                              height: '38px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--gold-light)',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </div>

                        {/* Card Details */}
                        <div style={{
                          padding: '1.35rem',
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          justifyContent: 'space-between',
                          gap: '0.9rem'
                        }}>
                          <div>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '0.35rem'
                            }}>
                              <span style={{
                                fontSize: '0.64rem',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'var(--text-muted)'
                              }}>
                                {product.categoryLabel}
                              </span>

                              {product.availableColors?.length > 0 && (
                                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                  {product.availableColors.slice(0, 4).map((col) => (
                                    <span
                                      key={col}
                                      title={col}
                                      style={{
                                        width: '9px',
                                        height: '9px',
                                        borderRadius: '50%',
                                        background: getSwatchColor(col),
                                        border: '1px solid rgba(255,255,255,0.3)'
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            <h3 style={{
                              fontFamily: 'var(--font-serif-display)',
                              fontSize: '1.08rem',
                              color: '#ffffff',
                              lineHeight: 1.25,
                              marginBottom: '0.45rem'
                            }}>
                              {product.title}
                            </h3>

                            {/* Available Sizes Preview */}
                            <div style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-secondary)',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.3rem'
                            }}>
                              <span style={{ color: 'var(--text-muted)' }}>Sizes:</span>
                              <span>{(product.sizes || []).slice(0, 6).join(' · ')}</span>
                            </div>
                          </div>

                          {/* Price & Quick Add */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.85rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-serif-display)',
                              fontSize: '1.18rem',
                              fontWeight: 600,
                              color: 'var(--gold-light)'
                            }}>
                              {formatPrice(product, currency)}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart({
                                  ...product,
                                  selectedSize: product.sizes?.[0] || '38',
                                  selectedColor: product.availableColors?.[0] || 'Black',
                                  selectedImage: product.image
                                });
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'rgba(223, 196, 125, 0.14)',
                                border: '1px solid rgba(223, 196, 125, 0.35)',
                                color: 'var(--gold-light)',
                                padding: '0.42rem 0.8rem',
                                borderRadius: '2px',
                                fontFamily: 'var(--font-serif-display)',
                                fontSize: '0.68rem',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <ShoppingBag size={13} />
                              <span>Add to Bag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    paddingTop: '1rem'
                  }}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.55rem 0.9rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(223, 196, 125, 0.25)',
                        color: currentPage === 1 ? 'var(--text-muted)' : 'var(--gold-light)',
                        borderRadius: '2px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-serif-display)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <ChevronLeft size={14} />
                      <span>Prev</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '2px',
                          fontFamily: 'var(--font-serif-display)',
                          fontSize: '0.8rem',
                          fontWeight: currentPage === page ? 600 : 400,
                          background: currentPage === page ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                          color: currentPage === page ? '#0d0d12' : 'var(--text-secondary)',
                          border: currentPage === page ? 'none' : '1px solid rgba(223, 196, 125, 0.2)',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      style={{
                        padding: '0.55rem 0.9rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(223, 196, 125, 0.25)',
                        color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--gold-light)',
                        borderRadius: '2px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontFamily: 'var(--font-serif-display)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase'
                      }}
                    >
                      <span>Next</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFiltersOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 120,
          background: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            width: '88%',
            maxWidth: '340px',
            height: '100%',
            background: '#0e0e14',
            borderRight: '1px solid rgba(223, 196, 125, 0.28)',
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.9rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--gold-light)'
              }}>
                Filter Boutique
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--gold-primary)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>
            {renderFilterSidebarContent()}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1023px) {
          .boutique-layout {
            grid-template-columns: 1fr !important;
          }
          .boutique-sidebar-desktop {
            display: none !important;
          }
          .boutique-mobile-filter-btn {
            display: inline-flex !important;
          }
          .boutique-grid-toggle {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.32rem 0.7rem',
  background: 'rgba(223, 196, 125, 0.14)',
  border: '1px solid rgba(223, 196, 125, 0.35)',
  borderRadius: '2px',
  color: 'var(--gold-light)',
  fontSize: '0.72rem',
  fontFamily: 'var(--font-serif-display)',
  letterSpacing: '0.08em',
  cursor: 'pointer'
};
