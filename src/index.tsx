import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import ReactDOM from 'react-dom/client';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Language = 'tr' | 'en';
type View = 'main' | 'settings' | 'career';
type League = 'superlig' | 'laliga';
type Resolution = '1920x1080' | '1280x720' | '2560x1440';

interface Team {
  id: string;
  name: string;
  logo: string;
}

interface Translations {
  tr: {
    brand: string;
    start: string;
    settings: string;
    exit: string;
    back: string;
    language: string;
    resolution: string;
    fullscreen: string;
    volume: string;
    mute: string;
    superlig: string;
    laliga: string;
    continue: string;
    selectTeam: string;
  };
  en: {
    brand: string;
    start: string;
    settings: string;
    exit: string;
    back: string;
    language: string;
    resolution: string;
    fullscreen: string;
    volume: string;
    mute: string;
    superlig: string;
    laliga: string;
    continue: string;
    selectTeam: string;
  };
}

// ============================================================================
// TRANSLATIONS
// ============================================================================

const translations: Translations = {
  tr: {
    brand: 'AKKAYA GAMES',
    start: 'BAŞLA',
    settings: 'AYARLAR',
    exit: 'ÇIKIŞ',
    back: 'GERİ',
    language: 'Dil',
    resolution: 'Çözünürlük',
    fullscreen: 'Tam Ekran',
    volume: 'Ses Seviyesi',
    mute: 'Sessize Al',
    superlig: 'Süper Lig',
    laliga: 'La Liga',
    continue: 'DEVAM ET',
    selectTeam: 'Takım Seçin'
  },
  en: {
    brand: 'AKKAYA GAMES',
    start: 'START',
    settings: 'SETTINGS',
    exit: 'EXIT',
    back: 'BACK',
    language: 'Language',
    resolution: 'Resolution',
    fullscreen: 'Fullscreen',
    volume: 'Volume',
    mute: 'Mute',
    superlig: 'Super League',
    laliga: 'La Liga',
    continue: 'CONTINUE',
    selectTeam: 'Select Team'
  }
};

// ============================================================================
// TEAM DATA
// ============================================================================

const teams: Record<League, Team[]> = {
  superlig: [
    { id: 'gs', name: 'Galatasaray', logo: '🦁' },
    { id: 'fb', name: 'Fenerbahçe', logo: '🦅' },
    { id: 'bjk', name: 'Beşiktaş', logo: '🦅' },
    { id: 'ts', name: 'Trabzonspor', logo: '⚡' },
    { id: 'bs', name: 'Başakşehir', logo: '🔶' },
    { id: 'ank', name: 'Ankaragücü', logo: '💛' }
  ],
  laliga: [
    { id: 'rm', name: 'Real Madrid', logo: '👑' },
    { id: 'fcb', name: 'FC Barcelona', logo: '🔵' },
    { id: 'atm', name: 'Atlético Madrid', logo: '🔴' },
    { id: 'sev', name: 'Sevilla', logo: '⚪' },
    { id: 'val', name: 'Valencia', logo: '🦇' },
    { id: 'bil', name: 'Athletic Bilbao', logo: '🦁' }
  ]
};

// ============================================================================
// AUDIO GENERATION (Procedural)
// ============================================================================

const generateClickSound = (): string => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const duration = 0.05;
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 50) * 0.3;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);

  return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  // State Management
  const [currentView, setCurrentView] = useState<View>('main');
  const [language, setLanguage] = useState<Language>('tr');
  const [resolution, setResolution] = useState<Resolution>('1920x1080');
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedLeague, setSelectedLeague] = useState<League>('superlig');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  // Refs
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const t = translations[language];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    setFadeIn(true);

    // Try to play background music
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume / 100;
      bgMusicRef.current.play().catch(() => {
        // Auto-play blocked, will play on first interaction
      });
    }
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // ============================================================================
  // AUDIO HANDLERS
  // ============================================================================

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const playBgMusic = () => {
    if (bgMusicRef.current && bgMusicRef.current.paused) {
      bgMusicRef.current.play().catch(() => {});
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleStart = () => {
    playClickSound();
    playBgMusic();
    setCurrentView('career');
    setSelectedTeam(null);
  };

  const handleSettings = () => {
    playClickSound();
    playBgMusic();
    setCurrentView('settings');
  };

  const handleExit = () => {
    playClickSound();
    window.close();
  };

  const handleBack = () => {
    playClickSound();
    setCurrentView('main');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    setLanguage(e.target.value as Language);
  };

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playClickSound();
    setResolution(e.target.value as Resolution);
  };

  const handleFullscreenToggle = () => {
    playClickSound();
    setFullscreen(!fullscreen);

    if (!fullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleMuteToggle = () => {
    playClickSound();
    setIsMuted(!isMuted);
  };

  const handleLeagueChange = (league: League) => {
    playClickSound();
    setSelectedLeague(league);
    setSelectedTeam(null);
  };

  const handleTeamSelect = (teamId: string) => {
    playClickSound();
    setSelectedTeam(teamId);
  };

  const handleContinue = () => {
    playClickSound();
    alert(`${t.continue}: ${teams[selectedLeague].find(t => t.id === selectedTeam)?.name}`);
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0e14 0%, #141922 50%, #0f1419 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 1s ease-in-out',
      position: 'relative'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.03) 2px,
        rgba(255, 255, 255, 0.03) 4px
      )`,
      pointerEvents: 'none'
    },
    mainContent: {
      width: '100%',
      maxWidth: '1400px',
      height: '100%',
      maxHeight: '900px',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1
    },
    brand: {
      fontSize: 'clamp(28px, 5vw, 48px)',
      fontWeight: 700,
      letterSpacing: '8px',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '60px',
      textTransform: 'uppercase',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
      fontFamily: 'monospace'
    },
    menuContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    },
    button: {
      width: '280px',
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 600,
      letterSpacing: '3px',
      color: '#ffffff',
      background: 'rgba(20, 25, 34, 0.7)',
      border: '2px solid rgba(74, 144, 226, 0.4)',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'monospace'
    },
    buttonHover: {
      background: 'rgba(20, 25, 34, 0.9)',
      border: '2px solid rgba(74, 144, 226, 1)',
      boxShadow: 'inset 0 0 20px rgba(74, 144, 226, 0.3), 0 0 20px rgba(74, 144, 226, 0.2)',
      transform: 'translateY(-2px)'
    },
    settingsContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '30px',
      maxWidth: '600px',
      margin: '0 auto',
      width: '100%'
    },
    settingRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px',
      background: 'rgba(20, 25, 34, 0.6)',
      border: '1px solid rgba(74, 144, 226, 0.2)',
      borderRadius: '2px'
    },
    label: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#a0aec0',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    select: {
      padding: '12px',
      fontSize: '16px',
      background: 'rgba(10, 14, 20, 0.8)',
      border: '1px solid rgba(74, 144, 226, 0.3)',
      borderRadius: '2px',
      color: '#ffffff',
      cursor: 'pointer',
      outline: 'none'
    },
    toggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    toggleSwitch: {
      width: '50px',
      height: '26px',
      background: 'rgba(10, 14, 20, 0.8)',
      border: '1px solid rgba(74, 144, 226, 0.3)',
      borderRadius: '13px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    toggleSwitchActive: {
      background: 'rgba(74, 144, 226, 0.5)',
      border: '1px solid rgba(74, 144, 226, 1)'
    },
    toggleThumb: {
      width: '20px',
      height: '20px',
      background: '#ffffff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: '3px',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    },
    toggleThumbActive: {
      left: '26px'
    },
    slider: {
      width: '100%',
      height: '6px',
      background: 'rgba(10, 14, 20, 0.8)',
      border: '1px solid rgba(74, 144, 226, 0.3)',
      borderRadius: '3px',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none'
    },
    careerContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    leagueTabs: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(74, 144, 226, 0.2)',
      paddingBottom: '10px'
    },
    leagueTab: {
      padding: '12px 32px',
      fontSize: '16px',
      fontWeight: 600,
      color: '#a0aec0',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    leagueTabActive: {
      color: '#4a90e2',
      borderBottom: '3px solid #4a90e2'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '20px',
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: '500px',
      padding: '10px'
    },
    teamCard: {
      padding: '30px 20px',
      background: 'rgba(20, 25, 34, 0.7)',
      border: '2px solid rgba(74, 144, 226, 0.3)',
      borderRadius: '2px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    },
    teamCardSelected: {
      background: 'rgba(20, 25, 34, 0.9)',
      border: '2px solid #4a90e2',
      boxShadow: 'inset 0 0 30px rgba(74, 144, 226, 0.4), 0 0 20px rgba(74, 144, 226, 0.3)'
    },
    teamLogo: {
      fontSize: '48px',
      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
    },
    teamName: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#ffffff',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    continueButton: {
      alignSelf: 'center',
      marginTop: '20px'
    },
    buttonDisabled: {
      opacity: 0.3,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderMainMenu = () => (
    <>
      <div style={styles.brand}>{t.brand}</div>
      <div style={styles.menuContainer}>
        <button
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleStart}
        >
          {t.start}
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleSettings}
        >
          {t.settings}
        </button>
        <button
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleExit}
        >
          {t.exit}
        </button>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div style={styles.brand}>{t.settings}</div>
      <div style={styles.settingsContainer}>
        {/* Language */}
        <div style={styles.settingRow}>
          <label style={styles.label}>{t.language}</label>
          <select style={styles.select} value={language} onChange={handleLanguageChange}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Resolution */}
        <div style={styles.settingRow}>
          <label style={styles.label}>{t.resolution}</label>
          <select style={styles.select} value={resolution} onChange={handleResolutionChange}>
            <option value="1920x1080">1920 x 1080</option>
            <option value="1280x720">1280 x 720</option>
            <option value="2560x1440">2560 x 1440</option>
          </select>
        </div>

        {/* Fullscreen */}
        <div style={styles.settingRow}>
          <label style={styles.label}>{t.fullscreen}</label>
          <div style={styles.toggle}>
            <div
              style={{
                ...styles.toggleSwitch,
                ...(fullscreen ? styles.toggleSwitchActive : {})
              }}
              onClick={handleFullscreenToggle}
            >
              <div
                style={{
                  ...styles.toggleThumb,
                  ...(fullscreen ? styles.toggleThumbActive : {})
                }}
              />
            </div>
          </div>
        </div>

        {/* Volume */}
        <div style={styles.settingRow}>
          <label style={styles.label}>{t.volume}: {volume}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            style={styles.slider}
            disabled={isMuted}
          />
          <div style={styles.toggle}>
            <label style={{...styles.label, fontSize: '12px'}}>{t.mute}</label>
            <div
              style={{
                ...styles.toggleSwitch,
                ...(isMuted ? styles.toggleSwitchActive : {})
              }}
              onClick={handleMuteToggle}
            >
              <div
                style={{
                  ...styles.toggleThumb,
                  ...(isMuted ? styles.toggleThumbActive : {})
                }}
              />
            </div>
          </div>
        </div>

        <button
          style={{...styles.button, marginTop: '20px'}}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleBack}
        >
          {t.back}
        </button>
      </div>
    </>
  );

  const renderCareer = () => (
    <>
      <div style={styles.brand}>{t.selectTeam}</div>
      <div style={styles.careerContainer}>
        {/* League Tabs */}
        <div style={styles.leagueTabs}>
          <button
            style={{
              ...styles.leagueTab,
              ...(selectedLeague === 'superlig' ? styles.leagueTabActive : {})
            }}
            onClick={() => handleLeagueChange('superlig')}
          >
            {t.superlig}
          </button>
          <button
            style={{
              ...styles.leagueTab,
              ...(selectedLeague === 'laliga' ? styles.leagueTabActive : {})
            }}
            onClick={() => handleLeagueChange('laliga')}
          >
            {t.laliga}
          </button>
        </div>

        {/* Team Grid */}
        <div style={styles.teamGrid}>
          {teams[selectedLeague].map((team) => (
            <div
              key={team.id}
              style={{
                ...styles.teamCard,
                ...(selectedTeam === team.id ? styles.teamCardSelected : {})
              }}
              onClick={() => handleTeamSelect(team.id)}
              onMouseEnter={(e) => {
                if (selectedTeam !== team.id) {
                  e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTeam !== team.id) {
                  e.currentTarget.style.borderColor = 'rgba(74, 144, 226, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={styles.teamLogo}>{team.logo}</div>
              <div style={styles.teamName}>{team.name}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
          <button
            style={styles.button}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
            onClick={handleBack}
          >
            {t.back}
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.continueButton,
              ...(selectedTeam ? {} : styles.buttonDisabled)
            }}
            onMouseEnter={(e) => {
              if (selectedTeam) {
                Object.assign(e.currentTarget.style, styles.buttonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTeam) {
                Object.assign(e.currentTarget.style, styles.button);
              }
            }}
            onClick={handleContinue}
            disabled={!selectedTeam}
          >
            {t.continue}
          </button>
        </div>
      </div>
    </>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern} />
      <div style={styles.mainContent}>
        {currentView === 'main' && renderMainMenu()}
        {currentView === 'settings' && renderSettings()}
        {currentView === 'career' && renderCareer()}
      </div>

      {/* Audio Elements */}
      <audio ref={bgMusicRef} loop>
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" type="audio/wav" />
      </audio>
      <audio ref={clickSoundRef}>
        <source src={generateClickSound()} type="audio/wav" />
      </audio>
    </div>
  );
};

// ============================================================================
// APP INITIALIZATION
// ============================================================================

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
