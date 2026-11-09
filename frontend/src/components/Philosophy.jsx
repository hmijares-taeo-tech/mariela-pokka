import React, { useState } from 'react';
import { Feather, ShieldCheck, Clock, Check, Sparkles } from 'lucide-react';
import { CORE_PRINCIPLES, SILK_OF_THE_NORTH } from '../data/brandData';

export default function Philosophy() {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <section id="silk" style={{
      padding: '7rem 0',
      position: 'relative',
      background: 'linear-gradient(180deg, #07070a 0%, #0d0d14 50%, #08080b 100%)',
      borderTop: '1px solid rgba(223, 196, 125, 0.1)',
      borderBottom: '1px solid rgba(223, 196, 125, 0.1)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem auto' }}>
          <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
            <span className="badge-dot" />
            <span>Arctic Haute Couture Philosophy</span>
          </div>

          <h2 className="section-title">
            The Silk of the North
          </h2>

          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Known throughout centuries by Arctic herders and guarded as a secret by high-fashion ateliers, reindeer leather stands as nature's ultimate triumph in softness, weight, and endurance.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '5rem'
        }}>
          {SILK_OF_THE_NORTH.features.map((item, idx) => (
            <div
              key={item.title}
              className="glass-card"
              style={{
                padding: '2.25rem 1.85rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: idx === 0 ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.07)'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '2rem',
                    fontWeight: 600,
                    color: 'var(--gold-light)'
                  }}>
                    {item.metric}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)'
                  }}>
                    {item.label}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  marginBottom: '0.75rem'
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6
                }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Designer Quote Banner */}
        <div style={{
          background: 'radial-gradient(ellipse at center, rgba(30, 28, 40, 0.75) 0%, rgba(14, 14, 20, 0.95) 100%)',
          border: '1px solid rgba(223, 196, 125, 0.25)',
          borderRadius: '4px',
          padding: '3.5rem 3rem',
          position: 'relative',
          margin: '0 auto 6rem auto',
          maxWidth: '1100px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          textAlign: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--gold-gradient)',
            color: '#0d0d12',
            padding: '0.4rem 1.4rem',
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: '50px'
          }}>
            Creative Inspiration
          </div>

          <blockquote style={{
            fontFamily: 'var(--font-serif-editorial)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
            fontStyle: 'italic',
            lineHeight: 1.45,
            color: '#ffffff',
            maxWidth: '920px',
            margin: '0 auto 1.5rem auto'
          }}>
            {SILK_OF_THE_NORTH.quote}
          </blockquote>

          <div style={{
            fontFamily: 'var(--font-serif-display)',
            fontSize: '0.82rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)'
          }}>
            Mariela Pokka — Founder & Creative Director
          </div>
        </div>

        {/* The 3 Core Pillars */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Uncompromising Standards
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '2rem',
              color: '#ffffff'
            }}>
              Our Core Principles
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {CORE_PRINCIPLES.map((pillar) => (
              <div
                key={pillar.id}
                className="glass-card"
                style={{
                  padding: '2.5rem 2.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: 'rgba(223, 196, 125, 0.1)',
                  lineHeight: 1
                }}>
                  {pillar.number}
                </div>

                <div>
                  <span style={{
                    display: 'inline-block',
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-primary)',
                    background: 'rgba(223, 196, 125, 0.08)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '2px',
                    marginBottom: '1rem'
                  }}>
                    {pillar.badge}
                  </span>

                  <h4 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '1.35rem',
                    color: '#ffffff',
                    marginBottom: '1rem'
                  }}>
                    {pillar.title}
                  </h4>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: '1.75rem'
                  }}>
                    {pillar.description}
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '1.25rem'
                }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {pillar.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: '#c7c5c0' }}>
                        <Check size={14} color="var(--gold-primary)" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Material Comparison Matrix */}
        <div className="glass-card" style={{ padding: '2.5rem', overflowX: 'auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.3rem',
              letterSpacing: '0.08em',
              color: '#ffffff',
              marginBottom: '0.4rem'
            }}>
              Material Mastery: The Comparative Difference
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              How Arctic Reindeer Leather transcends conventional high-fashion hides.
            </p>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
            minWidth: '650px'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(223, 196, 125, 0.25)' }}>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em' }}>Attribute</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--gold-primary)', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em', background: 'rgba(223, 196, 125, 0.08)' }}>Arctic Reindeer (Silk of the North)</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em' }}>Standard Calfskin</th>
                <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-serif-display)', letterSpacing: '0.1em' }}>Lambskin</th>
              </tr>
            </thead>
            <tbody>
              {SILK_OF_THE_NORTH.comparison.map((row, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
                }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>{row.attribute}</td>
                  <td style={{ padding: '1rem', color: 'var(--gold-light)', background: 'rgba(223, 196, 125, 0.05)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={13} color="var(--gold-primary)" />
                      <span>{row.reindeer}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.calfskin}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.lambskin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
