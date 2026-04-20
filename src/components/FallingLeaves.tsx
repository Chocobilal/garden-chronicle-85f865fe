import { MangoLeaf } from "./Decorations";

/** Pure-CSS falling mango leaves — rendered absolutely inside a relative parent */
export const FallingLeaves = () => {
  // 12 leaves with varied animation params
  const leaves = [
    { left: "5%", size: 18, dur: 14, delay: 0, rot: 30 },
    { left: "12%", size: 14, dur: 18, delay: 3, rot: 60 },
    { left: "20%", size: 22, dur: 16, delay: 6, rot: -20 },
    { left: "28%", size: 16, dur: 20, delay: 1, rot: 45 },
    { left: "38%", size: 24, dur: 17, delay: 8, rot: -10 },
    { left: "47%", size: 14, dur: 22, delay: 4, rot: 70 },
    { left: "55%", size: 20, dur: 15, delay: 9, rot: -40 },
    { left: "63%", size: 18, dur: 19, delay: 2, rot: 25 },
    { left: "72%", size: 16, dur: 21, delay: 5, rot: -55 },
    { left: "80%", size: 22, dur: 16, delay: 7, rot: 15 },
    { left: "88%", size: 14, dur: 18, delay: 10, rot: -30 },
    { left: "95%", size: 20, dur: 23, delay: 11, rot: 50 },
  ];
  return (
    <div className="leaves-container" aria-hidden="true">
      {leaves.map((l, i) => (
        <div
          key={i}
          className="falling-leaf"
          style={{
            left: l.left,
            width: l.size,
            height: l.size,
            animationDuration: `${l.dur}s`,
            animationDelay: `${l.delay}s`,
          }}
        >
          <div style={{ transform: `rotate(${l.rot}deg)` }}>
            <MangoLeaf className="w-full h-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
