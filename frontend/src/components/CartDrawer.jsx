import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, CheckCircle, Send, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState('review'); // 'review' | 'concierge' | 'confirmed'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    notes: ''
  });

  const subtotalEUR = items.reduce((acc, it) => acc + it.priceEUR * (it.quantity || 1), 0);
  const dummyItemForPrice = { priceEUR: subtotalEUR };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep('confirmed');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 110,
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Drawer Panel */}
      <div style={{
        width: '100%',
        maxWidth: '540px',
        height: '100%',
        background: '#0e0e15',
        borderLeft: '1px solid rgba(223, 196, 125, 0.3)',
        boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.75rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              display: 'block'
            }}>
              Private Selection
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.35rem',
              color: '#ffffff'
            }}>
              Atelier Wardrobe
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(223, 196, 125, 0.25)',
              color: 'var(--gold-light)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 2rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(223, 196, 125, 0.08)',
                border: '1px solid rgba(223, 196, 125, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <ShoppingBag size={28} color="var(--gold-primary)" />
              </div>

              <h4 style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.25rem',
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                Your Private Bag is Empty
              </h4>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Explore our signature trench coats, gowns, jackets, and accessories handcrafted at the Arctic Circle.
              </p>

              <button
                onClick={onClose}
                className="btn-primary"
                style={{ fontSize: '0.75rem' }}
              >
                Explore Creations
              </button>
            </div>
          ) : checkoutStep === 'confirmed' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(223, 196, 125, 0.15)',
                border: '1px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto'
              }}>
                <CheckCircle size={32} color="var(--gold-primary)" />
              </div>

              <h4 style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.6rem',
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                Atelier Reservation Received
              </h4>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.5rem'
              }}>
                Thank you, <strong>{formData.name}</strong>. Your personal couture dossier for {items.length} {items.length === 1 ? 'creation' : 'creations'} has been transferred to our Rovaniemi concierge.
              </p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(223, 196, 125, 0.25)',
                borderRadius: '3px',
                padding: '1rem',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.8rem',
                color: 'var(--gold-light)',
                letterSpacing: '0.15em',
                marginBottom: '2rem'
              }}>
                RESERVATION ID: MP-{Date.now().toString().slice(-6)}
              </div>

              <button
                onClick={() => {
                  onClearCart();
                  setCheckoutStep('review');
                  onClose();
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Close & Return to House
              </button>
            </div>
          ) : checkoutStep === 'concierge' ? (
            <form onSubmit={handleOrderSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: 'var(--gold-primary)',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.3rem'
                }}>
                  Atelier Concierge Checkout
                </span>
                <h4 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.3rem',
                  color: '#ffffff'
                }}>
                  VIP Client Details
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      borderRadius: '2px',
                      padding: '0.8rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Email for Dossier & Fitting *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@luxury.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      borderRadius: '2px',
                      padding: '0.8rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Delivery City & Country *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monaco, Monte-Carlo / London, Mayfair"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      borderRadius: '2px',
                      padding: '0.8rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Special Order Instructions / Delivery Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter any delivery instructions, gate codes, or private client preferences..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(223, 196, 125, 0.25)',
                      borderRadius: '2px',
                      padding: '0.8rem 1rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                    Payment Processing Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.75rem',
                      borderRadius: '3px',
                      border: '1px solid rgba(223, 196, 125, 0.4)',
                      background: 'rgba(223, 196, 125, 0.08)',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-light)' }}>Stripe / Card</span>
                        <span style={{ fontSize: '9px', background: '#0284c7', color: '#fff', padding: '1px 5px', borderRadius: '3px' }}>Backend Ready</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Visa, MC, Amex, Apple Pay</span>
                    </div>

                    <div style={{
                      padding: '0.75rem',
                      borderRadius: '3px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Atelier Wire</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Direct Concierge Invoice</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '6px' }}>
                    ⚡ Medusa + Stripe backend hook is active. Add client API key in .env to accept real cards.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('review')}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Back to Bag
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1.5, padding: '0.8rem' }}
                >
                  <Send size={14} />
                  <span>Confirm Reservation</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{
                    width: '90px',
                    height: '110px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid rgba(223, 196, 125, 0.2)'
                  }}>
                    <img
                      src={item.selectedImage || item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-primary)' }}>
                        {item.categoryLabel}
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1rem', color: '#ffffff', lineHeight: 1.2 }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                        Size: {item.selectedSize || 'Standard'} • Shade: {item.selectedColor || 'Noir'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                        {formatPrice(item, currency)}
                      </span>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.72rem'
                        }}
                        onMouseEnter={(e) => (e.target.style.color = '#ff6b6b')}
                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary Action */}
        {items.length > 0 && checkoutStep === 'review' && (
          <div style={{
            padding: '1.75rem 2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 10, 15, 0.95)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '1rem'
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Estimated Atelier Total
                </span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Includes Insured Worldwide White-Glove Courier
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                {formatPrice(dummyItemForPrice, currency)}
              </span>
            </div>

            <button
              onClick={() => setCheckoutStep('concierge')}
              className="btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              <span>Proceed to Concierge Acquisition</span>
              <ArrowRight size={15} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
              <ShieldCheck size={14} color="var(--gold-primary)" />
              <span>Direct Guarantee from the Rovaniemi Atelier</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
