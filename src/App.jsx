import { useState, useEffect, useMemo, useRef } from 'react';
import Papa from 'papaparse';
import './App.css';
import {
  Plot,
  LABELS,
  color1,
  color2,
  DEFAULT_UNIT_STATE,
  DEFAULT_VIS_STATE,
  customStyles,
  EXAMPLES,
  FAQ_ITEMS,
} from './constants';
import UnitControls from './components/UnitControls';
import StatCard from './components/StatCard';
import ChartVisibilityControls from './components/ChartVisibilityControls';
import FAQAnswer from './components/FAQAnswer';
import ReactMarkdown from 'react-markdown';
import { generateUnitTraces } from './utils/plotTraces';
import { parseQueryString, buildQueryString } from './utils/urlState';
import { validateUnitState } from './utils/validateUrlState';
import calculateUnit from './utils/calculateUnit';

export default function App() {
  // Initialize from URL params if present, otherwise use default example
  const initialUrlState = parseQueryString();
  const [data, setData] = useState([]);
  const [u1, setU1] = useState(
    initialUrlState
      ? { ...DEFAULT_UNIT_STATE, ...initialUrlState.u1 }
      : { ...DEFAULT_UNIT_STATE, ...EXAMPLES[0].u1 }
  );
  const [u2, setU2] = useState(
    initialUrlState
      ? { ...DEFAULT_UNIT_STATE, ...initialUrlState.u2 }
      : { ...DEFAULT_UNIT_STATE, ...EXAMPLES[0].u2 }
  );
  const [vis1, setVis1] = useState(
    initialUrlState ? { ...DEFAULT_VIS_STATE, ...initialUrlState.vis1 } : { ...DEFAULT_VIS_STATE }
  );
  const [vis2, setVis2] = useState(
    initialUrlState ? { ...DEFAULT_VIS_STATE, ...initialUrlState.vis2 } : { ...DEFAULT_VIS_STATE }
  );
  const [noticeMessage, setNoticeMessage] = useState(null);
  const urlValidated = useRef(false);

  useEffect(() => {
    Papa.parse('/final_flat.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => {
        setData(r.data);
      },
    });
  }, []);

  // Validate URL-derived state once data is loaded
  useEffect(() => {
    if (!initialUrlState || urlValidated.current || data.length === 0) return;
    urlValidated.current = true;

    const correctedU1 = validateUnitState(u1, data);
    const correctedU2 = validateUnitState(u2, data);

    const hasU1Changes = JSON.stringify(correctedU1) !== JSON.stringify(u1);
    const hasU2Changes = JSON.stringify(correctedU2) !== JSON.stringify(u2);

    if (hasU1Changes || hasU2Changes) {
      if (hasU1Changes) setU1(correctedU1);
      if (hasU2Changes) setU2(correctedU2);
      setNoticeMessage('Some URL parameters were invalid and have been reset to defaults.');
      setTimeout(() => setNoticeMessage(null), 6000);
    }
  }, [data, initialUrlState, u1, u2]);

  // Sync URL bar on state changes
  useEffect(() => {
    const qs = buildQueryString(u1, u2, vis1, vis2);
    const newUrl = qs ? `${window.location.pathname}${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [u1, u2, vis1, vis2]);

  const unit1Results = useMemo(() => calculateUnit(data, u1), [data, u1]);
  const unit2Results = useMemo(() => calculateUnit(data, u2), [data, u2]);

  const characterOptions = useMemo(
    () =>
      [...new Set(data.map((d) => d.Name))]
        .sort()
        .map((n) => ({ value: n, label: n })),
    [data]
  );

  const loadExample = (example) => {
    setU1({ ...DEFAULT_UNIT_STATE, ...example.u1 });
    setU2({ ...DEFAULT_UNIT_STATE, ...example.u2 });
  };

  if (!data.length) return <div className="app-container">Initializing...</div>;

  return (
    <div className="app-container">
      {noticeMessage && (
        <div className="notice-banner">{noticeMessage}</div>
      )}
      <a href="/" className="title-link"><h1 className="title">Fire Emblem GBA Stat Distributions</h1></a>

      <div className="intro">
        <p><strong>What is this?</strong> Compute and compare the stats of any two characters from the GBA Fire Emblem games.</p>
        <p><strong>How do I use this?</strong> Click the Example Comparisons for some quick examples, or choose characters and parameters in the menus below.</p>
        <p><strong>Why is this useful?</strong> Plots make it easy to compare characters (or even variants of the same character) at a glance. 10th and 90th percentiles also give a sense of how the stat may vary based on RNG.</p>
      </div>

      {/* Example Comparisons */}
      <section className="examples-section">
        <p className="examples-label">Example comparisons</p>
        <ul className="examples-list">
          {EXAMPLES.map((ex, i) => (
            <li key={i} className="examples-item">
              <span className="examples-link" onClick={() => loadExample(ex)}>
                {ex.label}
              </span>
              <span className="examples-desc">
                : <ReactMarkdown
                  components={{
                    p: ({ children }) => <>{children}</>,
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {ex.desc}
                </ReactMarkdown>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Character selection */}
      <section className="character-selection-section">
        <div className="section-divider"></div>
        <p className="section-label">Character selection</p>
        <div className="controls-row">
        <UnitControls
          data={data}
          characterOptions={characterOptions}
          customStyles={customStyles}
          themeColor={color1}
          state={u1}
          setState={setU1}
        />
        <UnitControls
          data={data}
          characterOptions={characterOptions}
          customStyles={customStyles}
          themeColor={color2}
          state={u2}
          setState={setU2}
        />
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="section-divider"></div>
        <p className="section-label">Stats</p>
        <div className="stats-row">
        <StatCard
          char={unit1Results.char}
          stats={unit1Results.stats}
          selectedName={u1.selectedName}
          level={u1.level}
          useAdjustedGrowths={u1.useAdjustedGrowths}
          themeColor={color1}
        />
        <StatCard
          char={unit2Results.char}
          stats={unit2Results.stats}
          selectedName={u2.selectedName}
          level={u2.level}
          useAdjustedGrowths={u2.useAdjustedGrowths}
          themeColor={color2}
        />
        </div>
      </section>

      {/* 3. PLOT SECTION */}
      <section className="plot-section">
        <div className="chart-wrapper">
          <Plot
            data={[
              ...generateUnitTraces(1, unit1Results, vis1, {
                max: 'rgba(37, 99, 235, 0.5)',
                rangeBorder: 'rgba(37, 99, 235, 0.2)',
                fill: 'rgba(37, 99, 235, 0.1)',
                main: color1,
              }),
              ...generateUnitTraces(2, unit2Results, vis2, {
                max: 'rgba(217, 119, 6, 0.5)',
                rangeBorder: 'rgba(217, 119, 6, 0.2)',
                fill: 'rgba(217, 119, 6, 0.1)',
                main: color2,
              }),
            ]}
            layout={{
              polar: {
                radialaxis: { range: [0, 60], visible: true },
                angularaxis: { rotation: 90, direction: 'clockwise' },
              },
              autosize: true,
              height: undefined,
              showlegend: false,
              legend: { orientation: 'h', y: -0.2, x: 0.5, xanchor: 'center' },
              margin: { t: 30, b: 30, l: 30, r: 30 },
              hoverlabel: {
                font: { family: 'system-ui', size: 13 },
              },
            }}
            useResizeHandler={true}
            style={{ width: '100%', height: '100%' }}
            config={{ displayModeBar: false }}
          />
        </div>

        <div className="chart-controls-grid">
          <ChartVisibilityControls
            unitNum={1}
            visibility={vis1}
            setVisibility={setVis1}
            color="#2563eb"
          />
          <ChartVisibilityControls
            unitNum={2}
            visibility={vis2}
            setVisibility={setVis2}
            color={color2}
          />
        </div>
      </section>

      {/* Share URL */}
      <section className="share-section">
        <p className="share-label">Share current comparison</p>
        <div className="share-row">
          <input
            className="share-input"
            type="text"
            readOnly
            value={window.location.href}
            onClick={(e) => e.target.select()}
          />
          <button
            className="share-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <p className="faq-heading">FAQ</p>
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{item.q}</summary>
            <FAQAnswer segments={item.a} />
          </details>
        ))}
      </section>
    </div>
  );
}