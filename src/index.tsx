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
  tr: { [key: string]: string };
  en: { [key: string]: string };
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
    selectTeam: 'TAKIM SEÇİMİ'
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
    selectTeam: 'TEAM SELECTION'
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
// HEXAGON SVG COMPONENT
// ============================================================================

const HexagonDecor: React.FC<{ size: number; style?: CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <polygon
      points="50,5 90,27 90,73 50,95 10,73 10,27"
      fill="none"
      stroke="rgba(180, 190, 200, 0.3)"
      strokeWidth="1"
    />
    <polygon
      points="50,15 80,32 80,68 50,85 20,68 20,32"
      fill="none"
      stroke="rgba(180, 190, 200, 0.15)"
      strokeWidth="0.5"
    />
  </svg>
);

// ============================================================================
// CORNER DECORATION COMPONENT
// ============================================================================

const CornerDecor: React.FC<{ position: 'tl' | 'tr' | 'bl' | 'br' }> = ({ position }) => {
  const positionStyles: Record<string, CSSProperties> = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0, transform: 'scaleX(-1)' },
    bl: { bottom: 0, left: 0, transform: 'scaleY(-1)' },
    br: { bottom: 0, right: 0, transform: 'scale(-1)' }
  };

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{
        position: 'absolute',
        opacity: 0.4,
        pointerEvents: 'none',
        ...positionStyles[position]
      }}
    >
      <line x1="0" y1="15" x2="15" y2="15" stroke="rgba(180, 190, 200, 0.6)" strokeWidth="1" />
      <line x1="15" y1="0" x2="15" y2="15" stroke="rgba(180, 190, 200, 0.6)" strokeWidth="1" />
      <line x1="0" y1="8" x2="8" y2="8" stroke="rgba(180, 190, 200, 0.4)" strokeWidth="0.5" />
      <line x1="8" y1="0" x2="8" y2="8" stroke="rgba(180, 190, 200, 0.4)" strokeWidth="0.5" />
    </svg>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('main');
  const [language, setLanguage] = useState<Language>('tr');
  const [resolution, setResolution] = useState<Resolution>('1920x1080');
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedLeague, setSelectedLeague] = useState<League>('superlig');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState<boolean>(false);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const t = translations[language];

  useEffect(() => {
    setFadeIn(true);
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume / 100;
      bgMusicRef.current.play().catch(() => {});
    }
  }, [volume]);

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

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

  // Event Handlers
  const handleStart = () => { playClickSound(); playBgMusic(); setCurrentView('career'); setSelectedTeam(null); };
  const handleSettings = () => { playClickSound(); playBgMusic(); setCurrentView('settings'); };
  const handleExit = () => { playClickSound(); window.close(); };
  const handleBack = () => { playClickSound(); setCurrentView('main'); };
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => { playClickSound(); setLanguage(e.target.value as Language); };
  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => { playClickSound(); setResolution(e.target.value as Resolution); };
  const handleFullscreenToggle = () => {
    playClickSound();
    setFullscreen(!fullscreen);
    if (!fullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));
  const handleMuteToggle = () => { playClickSound(); setIsMuted(!isMuted); };
  const handleLeagueChange = (league: League) => { playClickSound(); setSelectedLeague(league); setSelectedTeam(null); };
  const handleTeamSelect = (teamId: string) => { playClickSound(); setSelectedTeam(teamId); };
  const handleContinue = () => {
    playClickSound();
    alert(`${t.continue}: ${teams[selectedLeague].find(team => team.id === selectedTeam)?.name}`);
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100vw',
      height: '100vh',
      background: '#0a0a0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: fadeIn ? 1 : 0,
      transition: 'opacity 1.2s ease-in-out',
      position: 'relative',
      fontFamily: '"Courier New", Courier, monospace'
    },
    gridPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `
        linear-gradient(rgba(180, 190, 200, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(180, 190, 200, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '30px 30px',
      pointerEvents: 'none',
      zIndex: 1
    },
    hexBackground: {
      position: 'absolute',
      top: '10%',
      right: '5%',
      opacity: 0.15,
      pointerEvents: 'none',
      zIndex: 1
    },
    mainContent: {
      width: '100%',
      maxWidth: '1200px',
      height: '100%',
      maxHeight: '800px',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '50px',
      paddingBottom: '20px',
      borderBottom: '1px solid rgba(180, 190, 200, 0.15)',
      position: 'relative'
    },
    brand: {
      fontSize: 'clamp(20px, 3vw, 32px)',
      fontWeight: 700,
      letterSpacing: '6px',
      color: '#b4bec8',
      textTransform: 'uppercase',
      fontFamily: '"Courier New", Courier, monospace',
      position: 'relative'
    },
    versionBadge: {
      fontSize: '10px',
      color: 'rgba(180, 190, 200, 0.5)',
      letterSpacing: '2px',
      padding: '4px 8px',
      border: '1px solid rgba(180, 190, 200, 0.2)',
      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
    },
    menuContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      position: 'relative'
    },
    button: {
      width: '320px',
      padding: '18px 0',
      fontSize: '15px',
      fontWeight: 700,
      letterSpacing: '4px',
      color: '#b4bec8',
      background: 'rgba(15, 18, 22, 0.8)',
      border: '1px solid rgba(180, 190, 200, 0.25)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      position: 'relative',
      fontFamily: '"Courier New", Courier, monospace',
      clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
      outline: 'none'
    },
    buttonHover: {
      background: 'rgba(20, 25, 30, 0.95)',
      borderColor: '#b4bec8',
      color: '#ffffff',
      boxShadow: 'inset 0 0 20px rgba(180, 190, 200, 0.1)',
      transform: 'translateX(4px)'
    },
    buttonInner: {
      position: 'absolute',
      bottom: '4px',
      left: '12px',
      right: '12px',
      height: '2px',
      background: 'rgba(180, 190, 200, 0.15)',
      transition: 'all 0.2s ease'
    },
    buttonInnerActive: {
      background: '#b4bec8',
      boxShadow: '0 0 10px rgba(180, 190, 200, 0.5)'
    },
    settingsContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      maxWidth: '700px',
      margin: '0 auto',
      width: '100%'
    },
    settingPanel: {
      background: 'rgba(15, 18, 22, 0.7)',
      border: '1px solid rgba(180, 190, 200, 0.2)',
      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
      padding: '20px',
      position: 'relative'
    },
    settingRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '15px'
    },
    label: {
      fontSize: '11px',
      fontWeight: 700,
      color: 'rgba(180, 190, 200, 0.7)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      flex: 1
    },
    value: {
      fontSize: '13px',
      color: '#b4bec8',
      fontWeight: 700,
      letterSpacing: '1px'
    },
    select: {
      padding: '10px 15px',
      fontSize: '12px',
      background: 'rgba(8, 10, 12, 0.9)',
      border: '1px solid rgba(180, 190, 200, 0.25)',
      color: '#b4bec8',
      cursor: 'pointer',
      outline: 'none',
      fontFamily: '"Courier New", Courier, monospace',
      letterSpacing: '1px',
      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    toggleSwitch: {
      width: '48px',
      height: '24px',
      background: 'rgba(8, 10, 12, 0.9)',
      border: '1px solid rgba(180, 190, 200, 0.25)',
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
    },
    toggleSwitchActive: {
      background: 'rgba(180, 190, 200, 0.2)',
      borderColor: '#b4bec8'
    },
    toggleThumb: {
      width: '16px',
      height: '16px',
      background: 'rgba(180, 190, 200, 0.6)',
      position: 'absolute',
      top: '3px',
      left: '4px',
      transition: 'all 0.3s ease',
      clipPath: 'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)'
    },
    toggleThumbActive: {
      left: '26px',
      background: '#b4bec8',
      boxShadow: '0 0 10px rgba(180, 190, 200, 0.5)'
    },
    sliderContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    slider: {
      flex: 1,
      height: '3px',
      background: 'rgba(8, 10, 12, 0.9)',
      border: '1px solid rgba(180, 190, 200, 0.2)',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      WebkitAppearance: 'none'
    },
    careerContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    },
    leagueTabs: {
      display: 'flex',
      gap: '0',
      borderBottom: '1px solid rgba(180, 190, 200, 0.15)'
    },
    leagueTab: {
      flex: 1,
      padding: '15px 0',
      fontSize: '12px',
      fontWeight: 700,
      color: 'rgba(180, 190, 200, 0.5)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontFamily: '"Courier New", Courier, monospace',
      outline: 'none'
    },
    leagueTabActive: {
      color: '#b4bec8',
      borderBottom: '2px solid #b4bec8'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '15px',
      overflowY: 'auto',
      overflowX: 'hidden',
      maxHeight: '450px',
      padding: '5px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(180, 190, 200, 0.3) transparent'
    },
    teamCard: {
      padding: '25px 15px',
      background: 'rgba(15, 18, 22, 0.7)',
      border: '1px solid rgba(180, 190, 200, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
    },
    teamCardHover: {
      borderColor: 'rgba(180, 190, 200, 0.5)',
      transform: 'translateY(-3px)'
    },
    teamCardSelected: {
      background: 'rgba(20, 25, 30, 0.9)',
      borderColor: '#b4bec8',
      boxShadow: 'inset 0 0 30px rgba(180, 190, 200, 0.15)'
    },
    teamLogo: {
      fontSize: '52px',
      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))'
    },
    teamName: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#b4bec8',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    actionBar: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      paddingTop: '20px',
      borderTop: '1px solid rgba(180, 190, 200, 0.15)'
    },
    buttonDisabled: {
      opacity: 0.3,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const DestinyButton: React.FC<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    style?: CSSProperties;
  }> = ({ label, onClick, disabled, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <button
        style={{
          ...styles.button,
          ...(isHovered && !disabled ? styles.buttonHover : {}),
          ...(disabled ? styles.buttonDisabled : {}),
          ...style
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
        <div style={{
          ...styles.buttonInner,
          ...(isHovered && !disabled ? styles.buttonInnerActive : {})
        }} />
        <CornerDecor position="tl" />
        <CornerDecor position="br" />
      </button>
    );
  };

  const renderMainMenu = () => (
    <>
      <div style={styles.header}>
        <div style={styles.brand}>{t.brand}</div>
        <div style={styles.versionBadge}>V1.0.0</div>
      </div>
      <div style={styles.menuContainer}>
        <DestinyButton label={t.start} onClick={handleStart} />
        <DestinyButton label={t.settings} onClick={handleSettings} />
        <DestinyButton label={t.exit} onClick={handleExit} />
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div style={styles.header}>
        <div style={styles.brand}>{t.settings}</div>
      </div>
      <div style={styles.settingsContainer}>
        <div style={styles.settingPanel}>
          <CornerDecor position="tl" />
          <CornerDecor position="br" />
          <div style={styles.settingRow}>
            <label style={styles.label}>{t.language}</label>
            <select style={styles.select} value={language} onChange={handleLanguageChange}>
              <option value="tr">TÜRKÇE</option>
              <option value="en">ENGLISH</option>
            </select>
          </div>
        </div>

        <div style={styles.settingPanel}>
          <CornerDecor position="tl" />
          <CornerDecor position="br" />
          <div style={styles.settingRow}>
            <label style={styles.label}>{t.resolution}</label>
            <select style={styles.select} value={resolution} onChange={handleResolutionChange}>
              <option value="1920x1080">1920 × 1080</option>
              <option value="1280x720">1280 × 720</option>
              <option value="2560x1440">2560 × 1440</option>
            </select>
          </div>
          <div style={styles.settingRow}>
            <label style={styles.label}>{t.fullscreen}</label>
            <div
              style={{
                ...styles.toggleSwitch,
                ...(fullscreen ? styles.toggleSwitchActive : {})
              }}
              onClick={handleFullscreenToggle}
            >
              <div style={{
                ...styles.toggleThumb,
                ...(fullscreen ? styles.toggleThumbActive : {})
              }} />
            </div>
          </div>
        </div>

        <div style={styles.settingPanel}>
          <CornerDecor position="tl" />
          <CornerDecor position="br" />
          <div style={styles.settingRow}>
            <label style={styles.label}>{t.volume}</label>
            <div style={styles.sliderContainer}>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                style={styles.slider}
                disabled={isMuted}
              />
              <span style={styles.value}>{volume}</span>
            </div>
          </div>
          <div style={styles.settingRow}>
            <label style={styles.label}>{t.mute}</label>
            <div
              style={{
                ...styles.toggleSwitch,
                ...(isMuted ? styles.toggleSwitchActive : {})
              }}
              onClick={handleMuteToggle}
            >
              <div style={{
                ...styles.toggleThumb,
                ...(isMuted ? styles.toggleThumbActive : {})
              }} />
            </div>
          </div>
        </div>

        <DestinyButton label={t.back} onClick={handleBack} />
      </div>
    </>
  );

  const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = selectedTeam === team.id;

    return (
      <div
        style={{
          ...styles.teamCard,
          ...(isHovered && !isSelected ? styles.teamCardHover : {}),
          ...(isSelected ? styles.teamCardSelected : {})
        }}
        onClick={() => handleTeamSelect(team.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CornerDecor position="tl" />
        <CornerDecor position="br" />
        <div style={styles.teamLogo}>{team.logo}</div>
        <div style={styles.teamName}>{team.name}</div>
        {isSelected && (
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '10px',
            right: '10px',
            height: '2px',
            background: '#b4bec8',
            boxShadow: '0 0 10px rgba(180, 190, 200, 0.6)'
          }} />
        )}
      </div>
    );
  };

  const renderCareer = () => (
    <>
      <div style={styles.header}>
        <div style={styles.brand}>{t.selectTeam}</div>
      </div>
      <div style={styles.careerContainer}>
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

        <div style={styles.teamGrid}>
          {teams[selectedLeague].map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        <div style={styles.actionBar}>
          <DestinyButton label={t.back} onClick={handleBack} style={{ width: '180px' }} />
          <DestinyButton
            label={t.continue}
            onClick={handleContinue}
            disabled={!selectedTeam}
            style={{ width: '180px' }}
          />
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <div style={styles.gridPattern} />
      <HexagonDecor size={200} style={styles.hexBackground} />
      <div style={styles.mainContent}>
        {currentView === 'main' && renderMainMenu()}
        {currentView === 'settings' && renderSettings()}
        {currentView === 'career' && renderCareer()}
      </div>
      <audio ref={bgMusicRef} loop>
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" type="audio/wav" />
      </audio>
      <audio ref={clickSoundRef}>
        <source src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=" type="audio/wav" />
      </audio>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
