import './HeroVisual.css';

const NODES = [
  { x: 40, y: 150 },
  { x: 110, y: 60 },
  { x: 230, y: 40 },
  { x: 340, y: 90 },
  { x: 380, y: 170 },
  { x: 300, y: 210 },
  { x: 150, y: 205 },
];

/**
 * Original SVG illustration: a drone at the center of a mission network,
 * standing in for product photography without reproducing any real image.
 */
function HeroVisual({ variant = 'panel' }) {
  return (
    <div className={`hero-visual hero-visual--${variant}`}>
      <svg viewBox="0 0 420 260" className="hero-visual__svg" role="img" aria-label="Drone connected to mission network nodes across a map">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#2f6fed" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2f6fed" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="130" r="150" fill="url(#heroGlow)" />
        {NODES.map((node, i) => (
          <path
            key={i}
            d={`M210,130 Q${(node.x + 210) / 2},${(node.y + 130) / 2 - 30} ${node.x},${node.y}`}
            fill="none"
            stroke="#3b82f6"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        ))}
        {NODES.map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r="4" fill="#4a84f2" />
        ))}
        {NODES.map((node, i) => (
          <circle key={`ring-${i}`} cx={node.x} cy={node.y} r="8" fill="none" stroke="#3b82f6" strokeOpacity="0.4" />
        ))}
        {/* Drone body */}
        <g transform="translate(210,130)">
          <circle r="26" fill="#0e1420" stroke="#3b82f6" strokeWidth="1.5" />
          <circle r="7" fill="#4a84f2" />
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dy], i) => (
            <g key={i} transform={`translate(${dx * 34},${dy * 22})`}>
              <line x1="0" y1="0" x2={-dx * 8} y2={-dy * 8} stroke="#3b82f6" strokeWidth="2" />
              <circle r="9" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <circle r="2.5" fill="#4a84f2" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export default HeroVisual;
