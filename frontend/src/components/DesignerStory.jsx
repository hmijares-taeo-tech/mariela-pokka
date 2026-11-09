import React, { useState } from 'react';
import { MapPin, Sparkles, Award, Compass, Heart } from 'lucide-react';
import { BRAND } from '../data/brandData';

const MILESTONES = [
  {
    year: 'The Calling',
    location: 'Caracas, Venezuela',
    title: 'The Midnight Sun Epiphany',
    description: 'Passing a billboard in Caracas featuring the Finnish midnight sun every day, young Mariela was captivated by the untouched Arctic beauty, swearing to one day experience it firsthand.'
  },
  {
    year: 'London',
    location: 'London, United Kingdom',
    title: 'Design Studies & Destiny',
    description: 'Studying fashion design and international business in London, she crossed paths with Harri Pokka, a Finnish entrepreneur whose roots ran deep in Lapland. Love bridged two distant worlds.'
  },
  {
    year: '66°33′ N',
    location: 'Rovaniemi, Finnish Lapland',
    title: 'Discovering the Silk of the North',
    description: 'Relocating to the Arctic Circle, Mariela immersed herself in the Lapland wilderness and discovered reindeer leather. Stunned by its buttery softness and resilience, she envisioned elevated haute couture.'
  },
  {
    year: '2013',
    location: 'The Atelier Founded',
    title: 'The Birth of Mariela Pokka',
    description: 'Establishing her namesake luxury fashion house in Rovaniemi, she became one of the world’s only designers dedicating an entire atelier to eco-luxury reindeer leather couture.'
  },
  {
    year: 'Runway',
    location: 'Monaco Fashion Week',
    title: 'Monaco Runway Triumph',
    description: 'Her collection walked the prestigious Monaco catwalk alongside Marketa Häkkinen’s wedding creations, dazzling royalty and international fashion critics.'
  }
];

export default function DesignerStory() {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  return (
    <section id="story" style={{
      padding: '7rem 0',
      background: 'linear-gradient(180deg, #08080b 0%, #111118 50%, #08080b 100%)',
      position: 'relative'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem auto' }}>
          <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
            <span className="badge-dot" />
            <span>The Creative Visionary</span>
          </div>

          <h2 className="section-title">
            The Story of Mariela Pokka
          </h2>

          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A Venezuelan-German-Finnish designer who united Latin passion with Arctic serenity, transforming nature’s most exclusive material into modern couture.
          </p>
        </div>

        {/* Designer Feature Grid: Portrait + Biography */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
          marginBottom: '6rem'
        }}>
          {/* Portrait Column */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(223, 196, 125, 0.15)',
              border: '1px solid rgba(223, 196, 125, 0.3)',
              maxHeight: '560px'
            }}>
              <img
                src="/images/designer.jpg"
                alt="Mariela Pokka — Founder & Designer"
                style={{
                  width: '100%',
                  height: '560px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(9, 9, 13, 0.95) 0%, rgba(9, 9, 13, 0) 100%)',
                padding: '2.5rem 1.75rem 1.5rem 1.75rem'
              }}>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.3rem',
                  color: '#ffffff',
                  display: 'block'
                }}>
                  Mariela Pokka
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif-editorial)',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  color: 'var(--gold-primary)'
                }}>
                  Founder, Atelier Director & Creative Visionary
                </span>
              </div>
            </div>

            {/* Floating Heritage Badge */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '-1rem',
              background: 'rgba(16, 16, 23, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(223, 196, 125, 0.35)',
              borderRadius: '4px',
              padding: '1rem 1.25rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Compass size={14} color="var(--gold-primary)" />
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  color: 'var(--gold-light)',
                  textTransform: 'uppercase'
                }}>
                  Global Soul • Arctic Heart
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Caracas → London → Rovaniemi
              </span>
            </div>
          </div>

          {/* Biography Text Column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Sparkles size={16} color="var(--gold-primary)" />
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                A Union of Contrasting Worlds
              </span>
            </div>

            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: 'clamp(1.75rem, 2.8vw, 2.4rem)',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '1.5rem'
            }}>
              “In my veins runs Venezuelan, German, Polish, and Spanish blood from Gran Canaria.”
            </h3>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '1.25rem'
            }}>
              Born in Caracas, Venezuela, Mariela fell in love with fashion as a young girl, meticulously designing garments for paper dolls and hand-sewing outfits for herself and her family. Her multicultural heritage broadened her understanding of fashion—balancing dramatic Latin warmth with European structural elegance.
            </p>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '1.75rem'
            }}>
              When love brought her to the Arctic Circle in Finland, she found her ultimate muse. Surrounded by snowscapes, the play of twilight skies, and the aurora borealis, she touched reindeer leather for the first time. The material's buttery, silk-like feel ignited her imagination, leading to the creation of the Mariela Pokka luxury fashion house.
            </p>

            {/* Credentials / Key Highlights */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              borderTop: '1px solid rgba(223, 196, 125, 0.2)',
              paddingTop: '1.5rem'
            }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)'
                }}>
                  London
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Design & Business Education
                </span>
              </div>

              <div>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)'
                }}>
                  Monaco
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Fashion Week Catwalk Debut
                </span>
              </div>

              <div>
                <span style={{
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: 'var(--gold-light)'
                }}>
                  Lapland
                </span>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Permanent Arctic Atelier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Milestones Odyssey */}
        <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
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
              Chronicle of an Arctic Dream
            </span>
            <h3 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.6rem',
              color: '#ffffff'
            }}>
              Milestones from Caracas to Monaco
            </h3>
          </div>

          {/* Stepper Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {MILESTONES.map((step, idx) => (
              <button
                key={step.year}
                onClick={() => setSelectedMilestone(idx)}
                style={{
                  background: selectedMilestone === idx ? 'rgba(223, 196, 125, 0.15)' : 'transparent',
                  border: selectedMilestone === idx ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  padding: '0.75rem 1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minWidth: '150px',
                  flex: 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: selectedMilestone === idx ? 'var(--gold-light)' : 'var(--text-primary)'
                }}>
                  {step.year}
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)'
                }}>
                  {step.location}
                </span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(223, 196, 125, 0.2)',
            borderRadius: '4px',
            padding: '2rem 2.25rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <MapPin size={16} color="var(--gold-primary)" />
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                {MILESTONES[selectedMilestone].location}
              </span>
            </div>

            <h4 style={{
              fontFamily: 'var(--font-serif-display)',
              fontSize: '1.45rem',
              color: '#ffffff',
              marginBottom: '0.75rem'
            }}>
              {MILESTONES[selectedMilestone].title}
            </h4>

            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}>
              {MILESTONES[selectedMilestone].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
