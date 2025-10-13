import React from 'react';

interface Theme {
  name: string;
  description: string;
  cssFile: string;
  preview: string;
}

const themes: Theme[] = [
  {
    name: "Default Blue",
    description: "Modern blue gradient theme",
    cssFile: "default",
    preview: "🔵"
  },
  {
    name: "Dark Cyberpunk",
    description: "Neon green cyberpunk style",
    cssFile: "dark-theme.css",
    preview: "🟢"
  },
  {
    name: "Warm Orange",
    description: "Cozy fireplace warmth",
    cssFile: "warm-theme.css",
    preview: "🟠"
  },
  {
    name: "Minimal Black",
    description: "Clean and simple",
    cssFile: "minimal-theme.css",
    preview: "⚫"
  },
  {
    name: "Ocean Blue",
    description: "Deep ocean vibes",
    cssFile: "ocean-theme.css",
    preview: "🌊"
  },
  {
    name: "Royal Purple",
    description: "Elegant and royal",
    cssFile: "purple-theme.css",
    preview: "🟣"
  },
  {
    name: "Forest Green",
    description: "Nature and organic",
    cssFile: "forest-theme.css",
    preview: "🌲"
  }
];

interface ThemeSwitcherProps {
  onThemeChange: (theme: string) => void;
  currentTheme?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onThemeChange, currentTheme = "default" }) => {
  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ 
        fontSize: '2rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        Choose Your Theme
      </h2>
      
      <p style={{
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        Select from our collection of modern, professional themes
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {themes.map((theme) => (
          <button
            key={theme.cssFile}
            onClick={() => onThemeChange(theme.cssFile)}
            style={{
              padding: '1.5rem',
              border: currentTheme === theme.cssFile ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
              borderRadius: '0.75rem',
              background: currentTheme === theme.cssFile ? 'var(--bg-tertiary)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentTheme !== theme.cssFile) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
              }
            }}
            onMouseLeave={(e) => {
              if (currentTheme !== theme.cssFile) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {theme.preview}
            </div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.25rem'
            }}>
              {theme.name}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              {theme.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
