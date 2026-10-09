// Overlapping translucent diagonal colour planes (no circles).
export default function Planes({ set = ["p1", "p4", "p2", "p3"] }) {
  return (
    <div className="planes" aria-hidden="true">
      {set.map((p) => (
        <i key={p} className={p} />
      ))}
    </div>
  );
}
