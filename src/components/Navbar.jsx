import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Menu, X, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { BRAND } from '../data/brandData';
import { arcticAudio } from '../utils/audioAmbiance';

export default function Navbar({
  currency,
  setCurrency,
  cartItems,
  onOpenCart,
  onOpenBespoke
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const playing = arcticAudio.toggle();
    setIsPlayingAudio(playing);
  };

  const navLinks = [
    { label: 'The House', href: '#story' },
    { label: 'Silk of the North', href: '#silk' },
    { label: 'Collections', href: '#collections' },
    { label: 'Bespoke Atelier', href: '#bespoke' },
    { label: 'Editorial', href: '#editorial' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0a0a0ea6] backdrop-blur-xl border-b border-[rgba(223,196,125,0.18)] py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-[#08080bcc] via-[#08080b4d] to-transparent py-5'
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.4s ease',
          backgroundColor: isScrolled ? 'rgba(10, 10, 14, 0.92)' : 'rgba(8, 8, 11, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(223, 196, 125, 0.18)' : '1px solid transparent',
          padding: isScrolled ? '0.75rem 2rem' : '1.25rem 2rem'
        }}
      >
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          {/* Brand Logo & Emblem */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <img
                src="/images/logo.png"
                alt="Mariela Pokka Crest"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 10px rgba(223, 196, 125, 0.4))'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: '#f5f4f0',
                textTransform: 'uppercase',
                lineHeight: 1.1
              }}>
                Mariela Pokka
              </span>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.62rem',
                letterSpacing: '0.35em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                Arctic Circle • Lapland
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            gap: '2rem',
            alignItems: 'center'
          }} className="desktop-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.16em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: '0.5rem 0'
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--gold-primary)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Currency, Audio, Cart, VIP Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Currency Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(223, 196, 125, 0.25)',
                  color: 'var(--gold-primary)',
                  padding: '0.45rem 0.8rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em'
                }}
                title="Select Currency"
              >
                <span>{currency}</span>
                <ChevronDown size={12} />
              </button>

              {currencyDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: 'rgba(18, 18, 25, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(223, 196, 125, 0.3)',
                  borderRadius: '3px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                  padding: '0.4rem 0',
                  minWidth: '95px',
                  zIndex: 60
                }}>
                  {['EUR', 'USD', 'GBP'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyDropdownOpen(false);
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        background: currency === curr ? 'rgba(223, 196, 125, 0.15)' : 'transparent',
                        color: currency === curr ? 'var(--gold-light)' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-serif-display)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => (e.target.style.background = 'rgba(223, 196, 125, 0.1)')}
                      onMouseLeave={(e) => (e.target.style.background = currency === curr ? 'rgba(223, 196, 125, 0.15)' : 'transparent')}
                    >
                      {curr === 'EUR' ? 'EUR (€)' : curr === 'USD' ? 'USD ($)' : 'GBP (£)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Arctic Ambiance Sound Toggle */}
            <button
              onClick={toggleSound}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: isPlayingAudio ? 'rgba(223, 196, 125, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: isPlayingAudio ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isPlayingAudio ? 'var(--gold-primary)' : 'var(--text-muted)',
                padding: '0.45rem 0.85rem',
                borderRadius: '3px',
                cursor: 'pointer',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease'
              }}
              title={isPlayingAudio ? 'Mute Arctic soundscape' : 'Enable Arctic ambiance soundscape'}
            >
              {isPlayingAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span style={{ display: 'none' }} className="audio-label">
                {isPlayingAudio ? 'Ambiance On' : 'Arctic Ambiance'}
              </span>
            </button>

            {/* Private Bag / Inquiry Icon */}
            <button
              onClick={onOpenCart}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(223, 196, 125, 0.25)',
                color: 'var(--text-primary)',
                width: '40px',
                height: '40px',
                borderRadius: '3px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              title="Private Atelier Bag"
            >
              <ShoppingBag size={18} color="var(--gold-primary)" />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--gold-gradient)',
                  color: '#0d0d12',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(223, 196, 125, 0.6)'
                }}>
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* VIP Bespoke CTA */}
            <button
              onClick={onOpenBespoke}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--gold-gradient)',
                color: '#0d0d12',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '0.55rem 1.2rem',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(223, 196, 125, 0.25)'
              }}
              className="vip-cta-btn"
            >
              <Sparkles size={13} />
              <span>VIP Atelier</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '0.4rem'
              }}
              className="mobile-menu-btn"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} color="var(--gold-primary)" /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '75px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 9, 13, 0.98)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.8rem',
            padding: '2rem',
            zIndex: 49,
            borderTop: '1px solid rgba(223, 196, 125, 0.2)'
          }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.15rem',
                  letterSpacing: '0.2em',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBespoke();
              }}
              style={{
                marginTop: '1rem',
                background: 'var(--gold-gradient)',
                color: '#0d0d12',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.85rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                padding: '0.9rem 2rem',
                borderRadius: '2px',
                border: 'none',
                cursor: 'pointer',
                width: '80%',
                maxWidth: '280px'
              }}
            >
              Book VIP Consultation
            </button>
          </div>
        )}
      </header>

      {/* Global Responsive Nav CSS styles */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .vip-cta-btn {
            display: flex !important;
          }
          .audio-label {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
}
