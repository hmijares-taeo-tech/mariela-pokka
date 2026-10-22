import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Collections from './components/Collections';
import ProductModal from './components/ProductModal';
import DesignerStory from './components/DesignerStory';
import Stories from './components/Stories';
import BespokeAtelier from './components/BespokeAtelier';
import Gallery from './components/Gallery';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('EUR');
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleAddToCart = (productWithSelection) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) =>
          it.id === productWithSelection.id &&
          it.selectedSize === productWithSelection.selectedSize &&
          it.selectedColor === productWithSelection.selectedColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity = (next[existingIndex].quantity || 1) + 1;
        return next;
      }
      return [...prev, { ...productWithSelection, quantity: 1 }];
    });

    showToast(`"${productWithSelection.title}" added to your Private Atelier Selection.`);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToCollections = () => {
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient Northern Lights Aurora Background */}
      <div className="aurora-ambient-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Floating Header */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBespoke={() => setIsBespokeModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Cinematic Hero */}
        <Hero
          onOpenBespoke={() => setIsBespokeModalOpen(true)}
          onExploreCollections={scrollToCollections}
        />

        {/* Silk of the North & Craftsmanship Principles */}
        <Philosophy />

        {/* Collections Catalog & Lookbook */}
        <Collections
          currency={currency}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={handleAddToCart}
          onOpenBespoke={() => setIsBespokeModalOpen(true)}
        />

        {/* Designer Story & Caracas-to-Lapland Odyssey */}
        <DesignerStory />

        {/* Bespoke Atelier Made-to-Measure */}
        <BespokeAtelier />

        {/* High-Fashion Editorial Stories & Monaco Press */}
        <Stories />

        {/* Runway & Atelier Lookbook Photo Gallery */}
        <Gallery />
      </main>

      {/* Footer & Rovaniemi Head Office */}
      <Footer onOpenBespoke={() => setIsBespokeModalOpen(true)} />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenBespoke={() => setIsBespokeModalOpen(true)}
      />

      {/* Bespoke Appointment Modal */}
      {isBespokeModalOpen && (
        <BespokeAtelier
          isOpenAsModal={true}
          onClose={() => setIsBespokeModalOpen(false)}
        />
      )}

      {/* Private Bag & Concierge Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenBespoke={() => {
          setIsCartOpen(false);
          setIsBespokeModalOpen(true);
        }}
      />

      {/* Luxury Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(16, 16, 23, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(223, 196, 125, 0.35)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(223, 196, 125, 0.2)',
            borderRadius: '4px',
            padding: '0.85rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 150,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <Sparkles size={16} color="var(--gold-primary)" />
          <span style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            color: '#ffffff'
          }}>
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
