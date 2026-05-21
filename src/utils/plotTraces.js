import { LABELS } from '../constants';

export const generateUnitTraces = (unitNum, results, visibility, colors) => {
  if (!results.stats) return [];

  const { maxes, cursed, blessed, med } = results.stats;
  const theta = [...LABELS, LABELS[0]];

  // Helper to close the radar loop
  const closeLoop = (arr) => [...arr, arr[0]];

  return [
    // 1. Class Max Trace
    {
      name: `[${unitNum}] Class Max`,
      type: 'scatterpolar',
      r: closeLoop(maxes),
      theta: theta,
      mode: 'lines',
      line: { color: colors.max, width: 1.5, dash: 'dot' },
      visible: visibility.max,
      hovertemplate: `Max %{theta}: %{r}<extra></extra>`,
    },
    // 2. Cursed Line (The lower boundary for the fill)
    {
      type: 'scatterpolar',
      r: closeLoop(cursed),
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
      r: closeLoop(blessed),
      theta: theta,
      mode: 'lines',
      fill: 'tonext',
      fillcolor: colors.fill,
      line: { color: colors.rangeBorder, width: 1 },
      visible: visibility.range,
      text: LABELS.map((l, i) => `Probable Range: ${cursed[i]} - ${blessed[i]}`),
      hovertemplate: `<b>%{theta}</b><br>%{text}<extra></extra>`,
    },
    // 4. Median Line
    {
      name: `[${unitNum}] Median`,
      type: 'scatterpolar',
      r: closeLoop(med),
      theta: theta,
      mode: 'lines+markers',
      line: { color: colors.main, width: 3 },
      visible: visibility.med,
      hovertemplate: `<b>%{theta}</b>: %{r} (Median)<extra></extra>`,
    },
  ];
};