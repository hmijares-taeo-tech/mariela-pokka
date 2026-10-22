import React, { useState } from 'react';
import { Sparkles, Calendar, CheckCircle2, Clock, ShieldCheck, MapPin, Send } from 'lucide-react';
import { BESPOKE_TIERS, BRAND } from '../data/brandData';

export default function BespokeAtelier({ isOpenAsModal = false, onClose }) {
  const [selectedTier, setSelectedTier] = useState('single-garment');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Single Garment Commission',
    consultationType: 'Virtual Styling Consultation',
    preferredDate: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const content = (
    <div className="container" style={{ position: 'relative' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 4rem auto' }}>
        <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
          <span className="badge-dot" />
          <span>Haute Couture Made-to-Measure</span>
        </div>

        <h2 className="section-title">
          Bespoke Atelier Services
        </h2>

        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Experience the pinnacle of personal luxury. Every bespoke garment is handcrafted at our Rovaniemi atelier at the Arctic Circle, tailored precisely to your silhouette, lifestyle, and aesthetic desires.
        </p>
      </div>

      {/* Bespoke Service Tiers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '2rem',
        marginBottom: '5rem'
      }}>
        {BESPOKE_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              className={`glass-card ${isSelected ? 'glass-card-gold' : ''}`}
              style={{
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => {
                setSelectedTier(tier.id);
                setFormData((prev) => ({ ...prev, tier: tier.title }));
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '2rem',
                  background: 'var(--gold-gradient)',
                  color: '#0d0d12',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '50px',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  Selected Path
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-primary)'
                  }}>
                    {tier.level}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    {tier.timeline}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.45rem',
                  color: '#ffffff',
                  marginBottom: '0.4rem'
                }}>
                  {tier.title}
                </h3>

                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.15rem',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  marginBottom: '1rem'
                }}>
                  {tier.investment}
                </span>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '1.75rem'
                }}>
                  {tier.description}
                </p>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: 'var(--gold-primary)',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem'
                  }}>
                    Included Atelier Privileges
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.8rem', color: '#c7c6c2', lineHeight: 1.4 }}>
                        <CheckCircle2 size={13} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTier(tier.id);
                  setFormData((prev) => ({ ...prev, tier: tier.title }));
                  document.getElementById('bespoke-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={isSelected ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', marginTop: '2rem', padding: '0.85rem' }}
              >
                <span>{isSelected ? 'Proceed with this Commission' : 'Select Tier'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Consultation Booking Form Anchor */}
      <div id="bespoke-form-anchor" className="glass-card" style={{
        maxWidth: '850px',
        margin: '0 auto',
        padding: '3.5rem 3rem',
        border: '1px solid rgba(223, 196, 125, 0.35)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.8)'
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(223, 196, 125, 0.15)',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <CheckCircle2 size={32} color="var(--gold-primary)" />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.85rem',
              color: '#ffffff',
              marginBottom: '0.75rem'
            }}>
              Bespoke Request Confirmed
            </h3>

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 1.75rem auto',
              lineHeight: 1.65
            }}>
              Thank you, <strong>{formData.name}</strong>. Our Rovaniemi couture concierge has received your bespoke commission inquiry for the <strong>{formData.tier}</strong>.
              A senior atelier director will reach out within 24 hours to schedule your preliminary consultation.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(223, 196, 125, 0.2)',
              borderRadius: '3px',
              padding: '1rem',
              display: 'inline-block',
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              color: 'var(--gold-light)',
              marginBottom: '2rem'
            }}>
              Reference Dossier: MP-ATELIER-{Math.floor(100000 + Math.random() * 900000)}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                Submit Additional Inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
                display: 'block',
                marginBottom: '0.4rem'
              }}>
                Direct to the Master Artisan
              </span>
              <h3 style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.8rem',
                color: '#ffffff',
                marginBottom: '0.5rem'
              }}>
                Request a Private Consultation
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Complimentary worldwide video appointments or private visits to our Arctic atelier.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Vivienne Montgomery"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(223, 196, 125, 0.25)',
                    borderRadius: '2px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(223, 196, 125, 0.25)',
                    borderRadius: '2px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+44 7000 000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(223, 196, 125, 0.25)',
                    borderRadius: '2px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Consultation Experience
                </label>
                <select
                  value={formData.consultationType}
                  onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#151520',
                    border: '1px solid rgba(223, 196, 125, 0.25)',
                    borderRadius: '2px',
                    padding: '0.85rem 1rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="Virtual Styling Consultation">Private Virtual Styling Video Appointment</option>
                  <option value="Lapland Atelier Visit">Private Visit to Rovaniemi Atelier (Finland)</option>
                  <option value="London / Monaco Suite">Private Hotel Suite Consultation (London/Monaco/Paris)</option>
                  <option value="Corporate / Diplomatic Gifting">Corporate or Diplomatic Custom Commission</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Your Vision / Notes / Desired Colors
              </label>
              <textarea
                rows={4}
                placeholder="Share your inspiration, event date, preferred garment silhouette, or measurement inquiries..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(223, 196, 125, 0.25)',
                  borderRadius: '2px',
                  padding: '0.85rem 1rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', maxWidth: '380px' }}
              >
                <Send size={15} />
                <span>Submit Atelier Dossier</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 110,
        background: 'rgba(5, 5, 8, 0.94)',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
        padding: '4rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <button
            onClick={onClose}
            style={{
              position: 'fixed',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(223, 196, 125, 0.3)',
              color: 'var(--gold-light)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 120
            }}
          >
            ✕
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="bespoke" style={{
      padding: '7rem 0',
      background: 'linear-gradient(180deg, #09090d 0%, #12121c 50%, #08080b 100%)',
      position: 'relative'
    }}>
      {content}
    </section>
  );
}
