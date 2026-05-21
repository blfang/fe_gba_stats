// Sprite sheets from Lexou Duck
// https://www.spriters-resource.com/game_boy_advance/fireemblemthebindingblade/asset/38458/
// https://www.spriters-resource.com/game_boy_advance/fireemblemtheblazingblade/asset/38459/
// https://www.spriters-resource.com/game_boy_advance/fireemblemthesacredstones/asset/14464/

// Configuration for each game's sprite sheet
export const GAME_CONFIGS = {
    FE6: {
        sheet: '/assets/sprites/fe6_sprites.png',
        gridSize: { w: 128, h: 112 },
        sprites: {
            large: {
                offset: { x: 0, y: 0 },
                dim: { w: 96, h: 80 }
            },
            mini: {
                offset: { x: 96, y: 16 },
                dim: { w: 32, h: 32 }
            }
        },
        mapping: {
            "Roy": { row: 0, col: 0 },
            "Clarine": { row: 0, col: 1 },
            "Fae": { row: 0, col: 2 },
            "Sin": { row: 0, col: 3 },
            "Sue": { row: 0, col: 4 },
            "Dayan": { row: 0, col: 5 },
            "Barthe": { row: 0, col: 6 },

            "Bors": { row: 1, col: 0 },
            "Douglas": { row: 1, col: 1 },
            "Wolt": { row: 1, col: 2 },
            "Dorothy": { row: 1, col: 3 },
            "Klein": { row: 1, col: 4 },
            "Saul": { row: 1, col: 5 },
            "Elen": { row: 1, col: 6 },

            "Yoder": { row: 2, col: 0 },
            "Chad": { row: 2, col: 1 },
            "Karel": { row: 2, col: 2 },
            "Fir": { row: 2, col: 3 },
            "Rutger": { row: 2, col: 4 },
            "Dieck": { row: 2, col: 5 },
            "Ogier": { row: 2, col: 6 },

            "Garret": { row: 3, col: 0 },
            "Alen": { row: 3, col: 1 },
            "Lance": { row: 3, col: 2 },
            "Perceval": { row: 3, col: 3 },
            "Igrene": { row: 3, col: 4 },
            "Marcus": { row: 3, col: 5 },
            "Astolfo": { row: 3, col: 6 },

            "Wade": { row: 4, col: 0 },
            "Lot": { row: 4, col: 1 },
            "Bartre": { row: 4, col: 2 },
            "Lugh": { row: 4, col: 3 },
            "Lilina": { row: 4, col: 4 },
            "Hugh": { row: 4, col: 5 },
            "Niime": { row: 4, col: 6 },

            "Raigh": { row: 5, col: 0 },
            "Larum": { row: 5, col: 1 },
            "Juno": { row: 5, col: 2 },
            "Thea": { row: 5, col: 3 },
            "Shanna": { row: 5, col: 4 },
            "Zeiss": { row: 5, col: 5 },
            "Elffin": { row: 5, col: 6 },

            "Cath": { row: 6, col: 0 },
            "Sophia": { row: 6, col: 1 },
            "Melady": { row: 6, col: 2 },
            "Gonzalez": { row: 6, col: 3 },
            "Noah": { row: 6, col: 4 },
            "Trec": { row: 6, col: 5 },
            "Zelot": { row: 6, col: 6 },

            "Echidna": { row: 7, col: 0 },
            "Cecilia": { row: 7, col: 1 },
            "Geese": { row: 7, col: 2 },
            "Galle": { row: 7, col: 3 },

            "Narcian": { row: 9, col: 1 },
            "Murdock": { row: 9, col: 6 },

            "Brunnya": { row: 10, col: 0 },
            "Zephiel": { row: 10, col: 1 },

            "Merlinus": { row: 11, col: 5 },
            "Eliwood": { row: 11, col: 6 },

            "Guinivere": { row: 12, col: 0 },
            "Hector": { row: 12, col: 1 },

            "Gwendolyn": { row: 21, col: 3 },
        }
    },
    FE7: {
        sheet: '/assets/sprites/fe7_sprites.png',
        gridSize: { w: 128, h: 112 },
        sprites: {
            large: {
                offset: { x: 0, y: 0 },
                dim: { w: 96, h: 80 }
            },
            mini: {
                offset: { x: 96, y: 16 },
                dim: { w: 32, h: 32 }
            }
        },
        mapping: {
            "Eliwood": { row: 0, col: 0 },
            "Hector": { row: 1, col: 2 },
            "Lyn": { row: 2, col: 5 },
            "Athos": { row: 3, col: 3 },
            "Ninian": { row: 3, col: 4 },
            "Hawkeye": { row: 3, col: 6 },

            "Matthew": { row: 4, col: 0 },
            "Jaffar": { row: 4, col: 1 },
            "Raven": { row: 4, col: 2 },
            "Geitz": { row: 4, col: 3 },
            "Legault": { row: 4, col: 4 },
            "Karel": { row: 4, col: 5 },
            "Dorcas": { row: 4, col: 6 },

            "Bartre": { row: 5, col: 0 },
            "Oswin": { row: 5, col: 1 },
            "Dart": { row: 5, col: 2 },
            "Wil": { row: 5, col: 3 },
            "Guy": { row: 5, col: 4 },
            "Karla": { row: 5, col: 5 },
            "Rath": { row: 5, col: 6 },

            "Kent": { row: 6, col: 0 },
            "Sain": { row: 6, col: 1 },
            "Lowen": { row: 6, col: 2 },
            "Marcus": { row: 6, col: 3 },
            "Florina": { row: 6, col: 4 },
            "Fiora": { row: 6, col: 5 },
            "Heath": { row: 6, col: 6 },

            "Vaida": { row: 7, col: 0 },
            "Erk": { row: 7, col: 1 },
            "Nino": { row: 7, col: 2 },
            "Pent": { row: 7, col: 3 },
            "Louise": { row: 7, col: 4 },
            "Canas": { row: 7, col: 5 },
            "Lucius": { row: 7, col: 6 },

            "Serra": { row: 8, col: 0 },
            "Priscilla": { row: 8, col: 1 },
            "Farina": { row: 8, col: 2 },
            "Nils": { row: 8, col: 3 },
            "Renault": { row: 8, col: 6 },

            "Isadora": { row: 9, col: 0 },
            "Harken": { row: 9, col: 1 },
            "Rebecca": { row: 9, col: 2 },
            "Wallace": { row: 9, col: 3 },
            "Merlinus": { row: 9, col: 4 },
        }
    },
    FE8: {
        sheet: '/assets/sprites/fe8_sprites.png',
        gridSize: { w: 128, h: 112 },
        sprites: {
            large: {
                offset: { x: 0, y: 0 },
                dim: { w: 96, h: 80 }
            },
            mini: {
                offset: { x: 96, y: 16 },
                dim: { w: 32, h: 32 }
            }
        },
        mapping: {
            "Eirika": { row: 0, col: 0 },
            "Seth": { row: 0, col: 1 },
            "Gilliam": { row: 0, col: 2 },
            "Franz": { row: 0, col: 3 },
            "Moulder": { row: 0, col: 4 },
            "Vanessa": { row: 0, col: 5 },
            "Ross": { row: 0, col: 6 },

            "Neimi": { row: 1, col: 0 },
            "Colm": { row: 1, col: 1 },
            "Garcia": { row: 1, col: 2 },
            "Innes": { row: 1, col: 3 },
            "Lute": { row: 1, col: 4 },
            "Natasha": { row: 1, col: 5 },
            "Cormag": { row: 1, col: 6 },

            "Ephraim": { row: 2, col: 0 },
            "Forde": { row: 2, col: 1 },
            "Kyle": { row: 2, col: 2 },
            "Amelia": { row: 2, col: 3 },
            "Artur": { row: 2, col: 4 },
            "Gerik": { row: 2, col: 5 },
            "Tethys": { row: 2, col: 6 },

            "Marisa": { row: 3, col: 0 },
            "Saleh": { row: 3, col: 1 },
            "Ewan": { row: 3, col: 2 },
            "L'Arachel": { row: 3, col: 3 },
            "Dozla": { row: 3, col: 4 },
            "Rennac": { row: 3, col: 5 },
            "Duessel": { row: 3, col: 6 },

            "Myrrh": { row: 4, col: 0 },
            "Knoll": { row: 4, col: 2 },
            "Joshua": { row: 4, col: 3 },
            "Syrene": { row: 4, col: 4 },
            "Tana": { row: 4, col: 5 },

            "Selena": { row: 7, col: 3 },
            "Vigarde": { row: 7, col: 4 },
            "Valter": { row: 7, col: 6 },

            "Caellach": { row: 8, col: 0 },
            "Orson": { row: 8, col: 1 },
            "Lyon": { row: 8, col: 3 },
            "Riev": { row: 8, col: 4 },

            "Glen": { row: 9, col: 0 },
            "Fado": { row: 9, col: 5 },
            "Hayden": { row: 9, col: 6 },

            "Ismaire": { row: 10, col: 3 },



        }
    },
};

/**
 * Generates the CSS style object for a specific character sprite.
 */
export const getSpriteStyle = (gameKey, charName, type = 'large') => {
    const config = GAME_CONFIGS[gameKey];
    const charPos = config?.mapping[charName];
    const spriteDef = config?.sprites[type];

    // Placeholder if data is missing
    if (!config || !charPos || !spriteDef) {
        return {
            width: type === 'mini' ? '32px' : `${96-2}px`,
            height: type === 'mini' ? '32px' : `${80-2}px`,
            backgroundColor: '#f1f5f9',
            display: 'inline-block',
            border: '1px dashed #cbd5e1'
        };
    }

    const { w: gridW, h: gridH } = config.gridSize;

    // 1. Determine if we should apply the "Zoom Buffer" crop
    // We only apply it to 'large' to prevent cutting off detail on 'mini'
    const isLarge = type === 'large';
    const cropBuffer = isLarge ? 1 : 0; 
    const sizeReduction = isLarge ? 2 : 0;

    // 2. Calculate dimensions
    const width = `${spriteDef.dim.w - sizeReduction}px`;
    const height = `${spriteDef.dim.h - sizeReduction}px`;

    // 3. Calculate coordinates with the 1px shift for large sprites
    const posX = (charPos.col * gridW) + spriteDef.offset.x + cropBuffer;
    const posY = (charPos.row * gridH) + spriteDef.offset.y + cropBuffer;

    return {
        width,
        height,
        backgroundImage: `url(${config.sheet})`,
        backgroundPosition: `-${posX}px -${posY}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto',
        imageRendering: 'pixelated',
        display: 'inline-block',
        verticalAlign: 'top', 
        overflow: 'hidden'
    };
};