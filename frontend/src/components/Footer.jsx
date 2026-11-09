import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Compass, Shield, Sparkles } from 'lucide-react';
import { BRAND } from '../data/brandData';

export default function Footer({ onExploreCollections }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterSubscribed(true);
  };

  return (
    <footer id="contact" style={{
      background: '#060609',
      borderTop: '1px solid rgba(223, 196, 125, 0.2)',
      paddingTop: '6rem',
      paddingBottom: '3rem',
      position: 'relative'
    }}>
      <div className="container">
        {/* Top Newsletter & Atelier Invitation Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 22, 31, 0.9) 0%, rgba(12, 12, 18, 0.95) 100%)',
          border: '1px solid rgba(223, 196, 125, 0.25)',
          borderRadius: '4px',
          padding: '3rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          marginBottom: '5rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Sparkles size={16} color="var(--gold-primary)" />
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                Private Salons & Runway Previews
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.75rem',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '0.5rem'
            }}>
              Join the House of Mariela Pokka
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Receive privileged invitations to private atelier viewings, seasonal capsule reveals, and Arctic couture stories.
            </p>
          </div>

          <div>
            {newsletterSubscribed ? (
              <div style={{
                background: 'rgba(223, 196, 125, 0.12)',
                border: '1px solid var(--gold-primary)',
                padding: '1.25rem',
                borderRadius: '3px',
                color: 'var(--gold-light)',
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textAlign: 'center'
              }}>
                Welcome to the Arctic Circle Circle. Your dossier has been enrolled.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your VIP email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: '1 1 240px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(223, 196, 125, 0.3)',
                    borderRadius: '2px',
                    padding: '0.9rem 1.2rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.9rem 1.6rem' }}>
                  <span>Request Invitation</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src="/images/logo.png"
                alt="Mariela Pokka Logo"
                style={{ width: '42px', height: '42px', objectFit: 'contain' }}
              />
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                color: '#ffffff',
                textTransform: 'uppercase'
              }}>
                Mariela Pokka
              </span>
            </div>

            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              A union of Arctic heritage and contemporary couture. Sustainable luxury, handcrafted in Finnish Lapland for the modern, discerning woman.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.15em' }}>
              <Compass size={14} />
              <span>{BRAND.coordinates}</span>
            </div>
          </div>

          {/* Head Office & Atelier */}
          <div>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1.25rem'
            }}>
              Head Office & Atelier
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Rovaniemi, Finnish Lapland<br />Arctic Circle 66°33′ N, Finland</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="var(--gold-primary)" />
                <a href={`mailto:${BRAND.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {BRAND.email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--gold-primary)" />
                <span>{BRAND.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1.25rem'
            }}>
              The House
            </span>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              {[
                { label: 'The Story of Mariela Pokka', href: '#story' },
                { label: 'The Silk of the North', href: '#silk' },
                { label: 'Signature Collections', href: '#collections' },
                { label: 'Monaco Runway Archive', href: '#gallery' },
                { label: 'Editorial Press & Stories', href: '#editorial' }
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--gold-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Haute Couture Certification */}
          <div>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1.25rem'
            }}>
              Private Inquiries
            </span>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              For personal concierge assistance, fittings, or general wholesale and press inquiries, reach out directly to our Rovaniemi house.
            </p>

            <button
              onClick={onExploreCollections}
              className="btn-secondary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              <span>Explore The Creations</span>
            </button>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} Mariela Pokka. Arctic Luxury Woven by Nature. Handcrafted in Finnish Lapland.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Ethical Sámi Heritage Guarantee</span>
            <span>Privacy Policy</span>
            <span>Terms & Atelier Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
