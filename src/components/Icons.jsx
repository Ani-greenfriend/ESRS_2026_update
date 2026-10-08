// Simple 2 px line icons from the final mockup (spec Section 10).
const P = {
  check: <path d="M4 12l5 5L20 6" />,
  grid: (<><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></>),
  calendar: (<><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>),
  target: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>),
  people: (<><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6M15 20c0-2.5 2-4.5 5-4.5" /></>),
  people2: (<><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6M15 20c0-2.5 2-4.5 5-4.5" /></>),
  euro: (<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5a4.5 4.5 0 100 7M7 11h6M7 14h6" /></>),
  signpost: <path d="M12 3v18M12 6h7l-2 3 2 3h-7M12 12H5l2-3-2-3" />,
  doc: (<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>),
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  building: <path d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M9 11h.01M15 11h.01" />,
  anchor: (<><circle cx="12" cy="5" r="2" /><path d="M12 7v14M5 13c0 4 3 8 7 8s7-4 7-8M8 11h8" /></>),
};

export default function Icon({ name, size = 16 }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {P[name]}
    </svg>
  );
}

// Chapter heading: eyebrow with icon, title, and the yellow-bar short answer.
export function ChapterHead({ icon, eyebrow, title, short }) {
  return (
    <div className="chead">
      <div className="eyebrow"><Icon name={icon} />{eyebrow}</div>
      <h2>{title}</h2>
      {short && <p className="lede short">{short}</p>}
    </div>
  );
}
