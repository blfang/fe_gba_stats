import { LABELS } from '../constants';

// Helper to halve the HP value (index 0) in a stats array
const halfHP = (arr) => arr.map((v, i) => (i === 0 ? v / 2 : v));

export const generateUnitTraces = (unitNum, results, visibility, colors) => {
  if (!results.stats) return [];

  const { maxes, cursed, blessed, med } = results.stats;
  const maxesPlot = halfHP(maxes);
  const cursedPlot = halfHP(cursed);
  const blessedPlot = halfHP(blessed);
  const medPlot = halfHP(med);

  const plotLabels = ['HP/2', ...LABELS.slice(1)];
  const theta = [...plotLabels, plotLabels[0]];

  // Helper to close the radar loop
  const closeLoop = (arr) => [...arr, arr[0]];

  return [
    // 1. Class Max Trace
    {
      name: `[${unitNum}] Class Max`,
      type: 'scatterpolar',
      r: closeLoop(maxesPlot),
      theta: theta,
      mode: 'lines',
      line: { color: colors.max, width: 1.5, dash: 'dot' },
      visible: visibility.max,
      hovertemplate: `Max %{theta}: %{r}<extra></extra>`,
    },
    // 2. Cursed Line (The lower boundary for the fill)
    {
      type: 'scatterpolar',
      r: closeLoop(cursedPlot),
      theta: theta,
      mode: 'lines',
      line: { color: colors.rangeBorder, width: 1 },
      fill: 'none',
      visible: visibility.range,
      showlegend: false,
      hoverinfo: 'skip',
    },
    // 3. Blessed Line + Fill (Range)
    {
      name: `[${unitNum}] 10th-90th %ile`,
      type: 'scatterpolar',
      r: closeLoop(blessedPlot),
      theta: theta,
      mode: 'lines',
      fill: 'tonext',
      fillcolor: colors.fill,
      line: { color: colors.rangeBorder, width: 1 },
      visible: visibility.range,
      text: plotLabels.map((l, i) => {
        const lo = i === 0 ? cursed[0] / 2 : cursed[i];
        const hi = i === 0 ? blessed[0] / 2 : blessed[i];
        return `Probable Range: ${lo} - ${hi}`;
      }),
      hovertemplate: `<b>%{theta}</b><br>%{text}<extra></extra>`,
    },
    // 4. Median Line
    {
      name: `[${unitNum}] Median`,
      type: 'scatterpolar',
      r: closeLoop(medPlot),
      theta: theta,
      mode: 'lines+markers',
      line: { color: colors.main, width: 3 },
      visible: visibility.med,
      hovertemplate: `<b>%{theta}</b>: %{r} (Median)<extra></extra>`,
    },
  ];
};
