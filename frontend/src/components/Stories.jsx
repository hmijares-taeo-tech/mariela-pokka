import React, { useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Sparkles, Quote } from 'lucide-react';
import { STORIES } from '../data/brandData';

export default function Stories() {
  const [selectedStory, setSelectedStory] = useState(null);

  return (
    <section id="editorial" style={{
      padding: '7rem 0',
      background: '#09090c',
      position: 'relative'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 4rem auto' }}>
          <div className="section-badge" style={{ margin: '0 auto 1.25rem auto' }}>
            <span className="badge-dot" />
            <span>Arctic Journal & Editorial</span>
          </div>

          <h2 className="section-title">
            The Chronicles
          </h2>

          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Immerse yourself in the history, Arctic traditions, and haute couture runway moments that define the house of Mariela Pokka.
          </p>
        </div>

        {/* Stories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {STORIES.map((story) => (
            <article
              key={story.id}
              className="glass-card"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedStory(story)}
            >
              {/* Story Image */}
              <div style={{
                height: '260px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src={story.image}
                  alt={story.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease'
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(9, 9, 13, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(223, 196, 125, 0.3)',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-serif-display)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)'
                }}>
                  {story.category}
                </div>
              </div>

              {/* Story Text */}
              <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Clock size={13} />
                    <span>{story.readTime}</span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-serif-display)',
                    fontSize: '1.25rem',
                    color: '#ffffff',
                    lineHeight: 1.3,
                    marginBottom: '0.6rem'
                  }}>
                    {story.title}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem'
                  }}>
                    {story.excerpt}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStory(story);
                  }}
                  className="btn-text"
                >
                  <span>Read Full Feature</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Editorial Reading Modal */}
      {selectedStory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: 'rgba(5, 5, 8, 0.92)',
          backdropFilter: 'blur(24px)'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            background: '#0d0d13',
            border: '1px solid rgba(223, 196, 125, 0.3)',
            borderRadius: '4px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
            overflowY: 'auto',
            padding: '3rem 2.5rem'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedStory(null)}
              style={{
                position: 'sticky',
                top: 0,
                float: 'right',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(223, 196, 125, 0.3)',
                color: 'var(--gold-light)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
              aria-label="Close story"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '2rem', clear: 'both' }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.6rem'
              }}>
                {selectedStory.category} • {selectedStory.readTime}
              </span>

              <h2 style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.3rem)',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '0.75rem'
              }}>
                {selectedStory.title}
              </h2>

              <p style={{
                fontFamily: 'var(--font-serif-editorial)',
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: 'var(--gold-light)',
                marginBottom: '1.5rem'
              }}>
                {selectedStory.subtitle}
              </p>

              {/* Story Image */}
              <div style={{
                width: '100%',
                maxHeight: '360px',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '2rem',
                border: '1px solid rgba(223, 196, 125, 0.2)'
              }}>
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  style={{ width: '100%', height: '360px', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Story Paragraphs */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              fontSize: '0.95rem',
              lineHeight: 1.85,
              color: '#dedcd7'
            }}>
              {selectedStory.content.map((p, idx) => (
                <p key={idx} style={{
                  fontSize: idx === 0 ? '1.05rem' : '0.95rem',
                  color: idx === 0 ? '#ffffff' : '#dedcd7',
                  borderLeft: p.startsWith('“') ? '2px solid var(--gold-primary)' : 'none',
                  paddingLeft: p.startsWith('“') ? '1.25rem' : 0,
                  fontStyle: p.startsWith('“') ? 'italic' : 'normal'
                }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '3rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(223, 196, 125, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                color: 'var(--gold-primary)',
                textTransform: 'uppercase'
              }}>
                Mariela Pokka — Arctic Circle Atelier
              </span>

              <button
                onClick={() => setSelectedStory(null)}
                className="btn-secondary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
