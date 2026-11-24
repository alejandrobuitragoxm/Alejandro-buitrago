import React, { useEffect, useRef, useState } from 'react';

/**
 * Temporary "under construction" screen: a little builder stacks a LEGO computer
 * bigger than her, brick by brick, until a loading bar fills — then it powers on,
 * resets and loops. Shown instead of the portfolio while the site is paused.
 */

// LEGO computer layout on a 28×20 brick grid (col, row; row 0 = top).
// role: 'bezel' (monitor frame), 'screen' (glowing display), 'body' (neck/base).
type Brick = { col: number; row: number; role: 'bezel' | 'screen' | 'body' };

function buildBricks(): Brick[] {
  const bricks: Brick[] = [];
  // Monitor: 6 cols × 4 rows. Inner 4×2 = glowing screen, rest = bezel.
  for (let row = 0; row <= 3; row++) {
    for (let col = 0; col <= 5; col++) {
      const screen = col >= 1 && col <= 4 && row >= 1 && row <= 2;
      bricks.push({ col, row, role: screen ? 'screen' : 'bezel' });
    }
  }
  // Neck (2 center bricks) + wide base.
  bricks.push({ col: 2, row: 4, role: 'body' }, { col: 3, row: 4, role: 'body' });
  for (let col = 1; col <= 4; col++) bricks.push({ col, row: 5, role: 'body' });
  // Build order: ground up, then left→right, so it reads as construction.
  return bricks.sort((a, b) => b.row - a.row || a.col - b.col);
}

const BRICK_W = 28;
const BRICK_H = 20;
const OFFSET_X = 108; // leave room on the left for the builder

export const MaintenancePage: React.FC = () => {
  const bricks = useRef<Brick[]>(buildBricks());
  const [onCount, setOnCount] = useState(0); // how many bricks are placed
  const [powered, setPowered] = useState(false);
  const [progress, setProgress] = useState(0);

  // The portfolio's intro curtain (in index.html) only lifts when the hero video
  // plays; on this page there is no hero, so remove it or it covers the scene.
  useEffect(() => {
    document.getElementById('intro-curtain')?.remove();
  }, []);

  useEffect(() => {
    const total = bricks.current.length;
    const stepMs = 110;
    const timers: number[] = [];

    const runCycle = () => {
      // Place bricks one by one.
      for (let i = 1; i <= total; i++) {
        timers.push(
          window.setTimeout(() => {
            setOnCount(i);
            setProgress(Math.round((i / total) * 100));
          }, i * stepMs)
        );
      }
      const builtAt = total * stepMs;
      // Power on the screen briefly once complete.
      timers.push(window.setTimeout(() => setPowered(true), builtAt + 250));
      // Tear down and loop.
      timers.push(
        window.setTimeout(() => {
          setPowered(false);
          setOnCount(0);
          setProgress(0);
        }, builtAt + 1500)
      );
      timers.push(window.setTimeout(runCycle, builtAt + 2100));
    };

    runCycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  const css = `
  #maint {
    position: fixed; inset: 0; z-index: 50;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 2.2rem;
    background: radial-gradient(120% 90% at 50% 0%, #15151c 0%, #08080a 60%);
    color: #e7e7ea;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow: hidden;
    padding: max(16px, env(safe-area-inset-left,0px));
  }
  #maint .grain { position:absolute; inset:0; opacity:.04; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

  #maint .scene { position: relative; width: 300px; height: 170px;
    transform: scale(var(--s,1)); transform-origin: center bottom; }

  /* LEGO bricks */
  #maint .brick {
    position: absolute; width: ${BRICK_W}px; height: ${BRICK_H}px;
    border-radius: 3px;
    opacity: 0; transform: translateY(-16px) scale(.8);
    transition: opacity .18s ease, transform .26s cubic-bezier(.34,1.56,.64,1);
    box-shadow: inset 0 -3px 0 rgba(0,0,0,.25), inset 0 2px 0 rgba(255,255,255,.18);
  }
  #maint .brick::before, #maint .brick::after {
    content:''; position:absolute; top:-4px; width:9px; height:6px; border-radius:3px 3px 1px 1px;
    background: inherit; box-shadow: inset 0 -2px 0 rgba(0,0,0,.2);
  }
  #maint .brick::before { left:5px; } #maint .brick::after { right:5px; }
  #maint .brick.on { opacity: 1; transform: translateY(0) scale(1); }
  #maint .brick.bezel { background:#8a93a6; }
  #maint .brick.body  { background:#e2534b; }
  #maint .brick.screen{ background:#2a2f3a; box-shadow: inset 0 0 0 1px rgba(255,255,255,.05); }
  #maint.lit .brick.screen {
    background:#f5b301;
    box-shadow: 0 0 10px 1px rgba(245,179,1,.55), inset 0 0 6px rgba(255,255,255,.5);
  }

  /* Builder */
  #maint .builder { position:absolute; left:6px; bottom:0; width:92px; height:132px;
    animation: bob 1.1s ease-in-out infinite; }
  @keyframes bob { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(-4px) } }
  #maint .builder .arm { transform-origin: 62px 54px; animation: hammer .55s ease-in-out infinite; }
  @keyframes hammer { 0%,100%{ transform: rotate(-6deg) } 50%{ transform: rotate(-32deg) } }

  #maint .status { display:flex; align-items:center; gap:.5rem; }
  #maint .status h1 {
    margin:0; font-family:'Cinzel', Georgia, serif; font-weight:500;
    font-size: clamp(1.6rem, 6vw, 2.4rem); letter-spacing:.06em; color:#fff;
  }
  #maint .status .chef { font-size: clamp(1.4rem, 5vw, 2rem); }
  #maint .dots span { animation: blink 1.4s infinite; }
  #maint .dots span:nth-child(2){ animation-delay:.2s } #maint .dots span:nth-child(3){ animation-delay:.4s }
  @keyframes blink { 0%,100%{ opacity:.2 } 40%{ opacity:1 } }

  #maint .track { width: min(260px, 70vw); height:4px; border-radius:99px; background:#23232b; overflow:hidden; }
  #maint .fill { height:100%; background:linear-gradient(90deg,#f5b301,#ffd369); border-radius:99px; transition: width .11s linear; }
  #maint .pct { font-size:.72rem; letter-spacing:.25em; color:#8a8a92; text-transform:uppercase; }

  #maint .brand { position:absolute; bottom: calc(18px + env(safe-area-inset-bottom,0px)); left:0; right:0; text-align:center;
    font-size:.64rem; letter-spacing:.3em; text-transform:uppercase; color:#52525b; }

  @media (max-width:420px){ #maint .scene{ --s:.8 } }
  @media (prefers-reduced-motion: reduce){
    #maint .builder, #maint .builder .arm { animation:none; }
  }`;

  return (
    <div id="maint" className={powered ? 'lit' : ''}>
      <style>{css}</style>
      <div className="grain" />

      <div className="scene">
        {/* Builder */}
        <svg className="builder" viewBox="0 0 92 132" aria-hidden="true">
          <rect x="30" y="104" width="10" height="26" rx="4" fill="#3f4654" />
          <rect x="48" y="104" width="10" height="26" rx="4" fill="#3f4654" />
          <rect x="26" y="66" width="38" height="44" rx="10" fill="#f5b301" />
          <circle cx="45" cy="50" r="17" fill="#f1c9a5" />
          <path d="M26 50a19 19 0 0 1 38 0z" fill="#e2534b" />
          <rect x="24" y="48" width="42" height="6" rx="3" fill="#e2534b" />
          <g className="arm">
            <rect x="56" y="70" width="26" height="10" rx="5" fill="#f1c9a5" />
            <rect x="74" y="60" width="18" height="12" rx="2" fill="#4f9be0" />
          </g>
        </svg>

        {/* LEGO computer */}
        {bricks.current.map((b, i) => (
          <div
            key={`${b.col}-${b.row}`}
            className={`brick ${b.role} ${i < onCount ? 'on' : ''}`}
            style={{ left: OFFSET_X + b.col * BRICK_W, top: b.row * BRICK_H }}
          />
        ))}
      </div>

      <div className="status">
        <h1>
          cooking<span className="dots"><span>.</span><span>.</span><span>.</span></span>
        </h1>
        <span className="chef" role="img" aria-label="chef">👨‍🍳</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem' }}>
        <div className="track"><div className="fill" style={{ width: `${progress}%` }} /></div>
        <div className="pct">Building · {progress}%</div>
      </div>

      <div className="brand">Alejandro Buitrago</div>
    </div>
  );
};

export default MaintenancePage;
