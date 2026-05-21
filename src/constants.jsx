import PlotComponent from 'react-plotly.js';

export const Plot = PlotComponent.default || PlotComponent;

export const LABELS = ['HP', 'S/M', 'Skl', 'Spd', 'Lck', 'Def', 'Res'];

export const color1 = '#2563eb';
export const color2 = '#d97706';

export const DEFAULT_UNIT_STATE = {
  selectedName: '',
  variantIndex: 0,
  level: 1,
  isHardMode: false,
  promo1Status: 'Unpromoted',
  promo2Status: 'Unpromoted',
  promo1Level: 20,
  promo2Level: 20,
  useAdjustedGrowths: true,
};

export const DEFAULT_VIS_STATE = { max: true, range: true, med: true };

export const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '8px',
    borderColor: '#cbd5e1',
    minHeight: '38px',
    boxShadow: 'none',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

export const EXAMPLES = [
  {
    label: 'Kent vs Sain',
    desc: 'Sain has much higher Str but worse Skl.',
    u1: { selectedName: 'Kent', promo1Status: 'Paladin', promo1Level: 10, level: 15 },
    u2: { selectedName: 'Sain', promo1Status: 'Paladin', promo1Level: 10, level: 15 },
  },
  {
    label: 'Warrior Ross vs Berserker Ross',
    desc: 'Warrior Ross has slightly higher Res and Skl, but lower Spd.',
    u1: { selectedName: 'Ross', promo1Status: 'Fighter', promo2Status: 'Warrior', promo1Level: 10, promo2Level: 10, level: 10 },
    u2: { selectedName: 'Ross', promo1Status: 'Pirate', promo2Status: 'Berserker', promo1Level: 10, promo2Level: 10, level: 10 },
  },
  {
    label: 'Raven vs. just-recruited Harken',
    desc: `Harken outperforms early-promoted Raven in most stats.
    [Also, [this Redditor's Raven](https://www.reddit.com/r/fireemblem/comments/1rt7ytw/ope_was_not_expecting_this_differential_fe7_hero/)
    is in the bottom 10% in Str.]
    Try checking if later promotion and/or Hard Mode bonuses make a difference!`,
    u1: { selectedName: 'Raven', promo1Status: 'Hero', promo1Level: 10, level: 8 },
    u2: { selectedName: 'Harken', level: 8 },
  },
  {
    label: 'Guy early promote vs. late promote',
    desc: 'Unpromoted Guy typically hits the 20 Spd cap around Lv 15, so his Spd will be stuck there if waiting until Lv 20 to promote. Promoting early raises the Spd cap, allowing subsequent level-ups to improve Spd.',
    u1: { selectedName: 'Guy', promo1Status: 'Swordmaster', promo1Level: 10, level: 11 },
    u2: { selectedName: 'Guy', promo1Status: 'Swordmaster', promo1Level: 20, level: 1 },
  },
  {
    label: 'Melady with and without hard mode bonuses',
    desc: 'Hard mode bonuses give Melady a sizeable edge in every stat.',
    u1: { selectedName: 'Melady', promo1Status: 'Wyvern Lord', promo1Level: 10, level: 5, isHardMode: false },
    u2: { selectedName: 'Melady', promo1Status: 'Wyvern Lord', promo1Level: 10, level: 5, isHardMode: true },
  },
];

export const FAQ_ITEMS = [
  {
    q: 'What does "Include reroll logic" do?',
    a: `In the GBA games, if no stats increase during a level up,
the game rerolls the level up. If again no stats increase, it rerolls once final time.
Because of the two extra opportunities to get stat increases,
the adjusted growth rate shown on this page is slightly higher than the [original] growth rate,
with a bigger impact for characters with very low [original] growth rates like Niime.

Sources: [Serenes Forest](https://forums.serenesforest.net/topic/91108-a-deep-dive-into-level-up-mechanics/), [fireemblem.fandom.com](https://fireemblem.fandom.com/wiki/Level#Leveling_Up_and_Stat_Growth).`,
  },
  {
    q: 'What are hard mode bonuses?',
    a: `In FE6 Hard Mode and FE7 Hector Hard Mode, recruitable enemies have boosted stats via bonus level-ups.
In FE7, such characters get 5 bonus level-ups, while in FE6 they get between 4 and 14 bonus level-ups (the later the chapter, the bigger the bonus).

The stat increases also use a different calculation than normal level-ups.
First, they are based on class growth rates rather than character growth rates.
Second, the distribution of stat increases is roughly uniform on the interval between 7/8 and 9/8 times the average value \`(bonus levels) * (class growth rate)\`.
Compared to normal level-ups (where one could be very unlucky and get no stat increases for every level-up, or a stat increase on every level-up),
this modified calculation reduces variance and ensures the stats are close to the average stat increase.

For more details on the number of bonus level-ups per character and the exact formula for calculating stat increases, see the Triangle Attack pages: [FE6](https://fe6.triangleattack.com/guides/hard-mode-bonuses), [FE7](https://fe7.triangleattack.com/guides/hard-mode-bonuses).`,
  },
  {
    q: 'How are the stat ranges calculated? How is this different from other existing websites?',
    a: `We computed the distribution of each character's stats accounting for the randomness in each level-up (including the randomness of hard mode bonuses).
From the full distribution, we compute the median (50th percentile) as well as the 10th and 90th percentiles.
The 10th-90th percentile range represents the "common" range of outcomes one would see 80% of the time;
outcomes outside of the range can be interpreted as very lucky (top 10% of outcomes) or very unlucky (worst 10% of outcomes).

Most other websites only use a simplified \`(level-ups) * (growth rate)\` calculation to estimate the mean stat increase.
This is slightly inaccurate due (a) not accounting for rerolls when a level-up produces no stat increases,
(b) applying stat caps after averaging the stat increases, rather than before, so the simplified calculation is not really an average,
especially when stat caps matter.

Lastly, we prefer to compute medians (and percentiles) instead of means, so that we can interpret "Median Spd = 15" as
"50% of the time, Spd is less than or equal to 15."
`,
  },
  {
    q: 'Where does the data come from?',
    a: `Base stats, growth rates, and stat caps were sourced primarily from Serenes Forest [[FE6](https://serenesforest.net/binding-blade/), [FE7](https://serenesforest.net/blazing-sword/), [FE8](https://serenesforest.net/the-sacred-stones/)],
with some cross-referencing with Fire Emblem Averages [[FE6](https://fea.fewiki.net/fea.php?game=6), [FE8](https://fea.fewiki.net/fea.php?game=8e)] and [fireemblemwiki.org](https://fireemblemwiki.org/wiki).
Specifics about hard mode bonuses were based on info from [Triangle Attack](https://triangleattack.com).
`,
  },
  { q: 'Where is the code? Where can I report bugs and make feature requests?', a: 'See the [GitHub repository](https://github.com/blfang/fe_gba_stats/issues).' }
];
