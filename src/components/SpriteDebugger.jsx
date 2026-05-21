// To display the sprites of all characters, add `<SpriteDebugger />`
// to the main App.jsx file.
// This tests the spritesheet cutting logic in /src/utils/spriteLogic.js.

import { getSpriteStyle, GAME_CONFIGS } from '../utils/spriteLogic';

export default function SpriteDebugger() {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ borderBottom: '2px solid #334155', paddingBottom: '10px' }}>
        Sprite Sheet Debugger
      </h1>

      {Object.entries(GAME_CONFIGS).map(([gameKey, config]) => (
        <section key={gameKey} style={{ marginTop: '40px' }}>
          <h2 style={{ color: '#60a5fa' }}>{gameKey} Content</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: '20px' 
          }}>
            {Object.keys(config.mapping).map(charName => (
              <div key={charName} style={{ 
                backgroundColor: '#0f172a', 
                padding: '20px', 
                borderRadius: '8px',
                // Using Flex instead of TextAlign to stabilize pixel alignment
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid #334155'
              }}>
                
                {/* Large Portrait View */}
                <div style={{ 
                  marginBottom: '12px', 
                  lineHeight: 0,      // Removes vertical whitespace "leading"
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#1e293b', // Darker background to see portrait edges
                  padding: '4px',
                  borderRadius: '4px'
                }}>
                   <div style={getSpriteStyle(gameKey, charName, 'large')} />
                </div>

                {/* Mini Portrait View */}
                <div style={{ 
                  marginBottom: '12px', 
                  lineHeight: 0, 
                  display: 'flex', 
                  justifyContent: 'center',
                  background: '#1e293b',
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                   <div style={getSpriteStyle(gameKey, charName, 'mini')} />
                </div>

                {/* Character Info */}
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  color: '#94a3b8',
                  wordBreak: 'break-word',
                  textAlign: 'center'
                }}>
                  {charName}
                </div>
                
                <div style={{ 
                  fontSize: '10px', 
                  color: '#475569', 
                  marginTop: '6px',
                  backgroundColor: '#1e293b',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  Row: {config.mapping[charName].row} | Col: {config.mapping[charName].col}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}