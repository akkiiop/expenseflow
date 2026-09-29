import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

/* ── helpers ── */
const rupee = n => '₹' + Math.round(n).toLocaleString('en-IN');
const compact = n => n >= 1000 ? '₹' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : '₹' + Math.round(n);
const ease = t => 1 - Math.pow(1 - t, 3);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RM = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ── hero sankey data ── */
const INC = [{ n: 'Salary', c: '#0F5C4D' }, { n: 'Freelance', c: '#17806A' }, { n: 'Dividends', c: '#4FA58F' }];
const EXP = [{ n: 'Rent', c: '#3E5C76' }, { n: 'Food', c: '#C93A63' }, { n: 'Transport', c: '#6F5E9E' }, { n: 'Shopping', c: '#B98A2E' }, { n: 'Bills', c: '#3F8E9C' }, { n: 'Subscriptions', c: '#8B6B54' }, { n: 'Saved', c: '#17806A' }];
const DATA = {
  Jul: { inc: [62000, 8000, 3200], exp: [22000, 10400, 3900, 12800, 5200, 1900] },
  Aug: { inc: [62000, 14500, 3200], exp: [22000, 11800, 4200, 7600, 5400, 1900] },
  Sep: { inc: [62000, 5500, 3200], exp: [22000, 13600, 4800, 9100, 5600, 2400] }
};
const ORDER = ['Jul', 'Aug', 'Sep'];
const vals = m => {
  const d = DATA[m], ti = d.inc.reduce((a, b) => a + b, 0), te = d.exp.reduce((a, b) => a + b, 0);
  return { inc: [...d.inc], exp: [...d.exp, ti - te] };
};

/* ── budgets simulator data ── */
const CATS_INIT = [
  { n: 'Food', c: '#C93A63', limit: 12000, spent: 8400 },
  { n: 'Transport', c: '#6F5E9E', limit: 5000, spent: 3100 },
  { n: 'Shopping', c: '#B98A2E', limit: 8000, spent: 5900 },
  { n: 'Subscriptions', c: '#8B6B54', limit: 2000, spent: 1400 }
];
const AMTS = [250, 800, 2000];
const PAYS = ['UPI', 'Cash', 'Card'];
const SEED_LEDGER = [
  { d: '27 Sep', cat: 0, a: 640, p: 'UPI' },
  { d: '26 Sep', cat: 1, a: 210, p: 'Cash' },
  { d: '25 Sep', cat: 3, a: 499, p: 'Card' }
];

/* ── authentic AI Insights (matching Google Gemini 2.5 Flash outputs) ── */
const AI = [
  {
    tab: 'Cash Flow Analysis',
    big: '19%',
    small: 'Savings rate (₹13,200 remaining balance)',
    body: 'Your total income of ₹70,700 comfortably covers your ₹57,500 expenses. Fixed commitments including Rent, Bills, and Subscriptions account for 52% of your outflow, leaving a healthy operational surplus.',
    act: 'Actionable Tip: Transfer your ₹13,200 remaining surplus directly to your emergency fund to prevent discretionary weekend spending leakage.'
  },
  {
    tab: 'Budget Alert (Food)',
    big: '₹13,600',
    small: 'Food expenditure (₹1,600 over ₹12,000 limit)',
    body: 'Food is your largest variable cost this month at ₹13,600, exceeding your assigned limit by 13% across recurring UPI payments, while Transport and Subscriptions remained well below budget.',
    act: 'Actionable Tip: Cap dining out and food deliveries to ₹400 daily for the rest of the week to stabilize your monthly category budget.'
  },
  {
    tab: 'Category Observation',
    big: '₹9,100',
    small: 'Shopping (76% of budget consumed)',
    body: 'Shopping has reached ₹9,100 of your ₹12,000 threshold. You are currently in the amber cautionary zone with ₹2,900 remaining before crossing your limit.',
    act: 'Actionable Tip: Pause non-essential retail and online orders until your next income deposit to maintain surplus.'
  }
];

/* ── authentic reports data (6-month trend + category donut) ── */
const TREND_DATA = [
  { m: 'Apr', inc: 68000, exp: 52000 },
  { m: 'May', inc: 71000, exp: 54500 },
  { m: 'Jun', inc: 69500, exp: 51000 },
  { m: 'Jul', inc: 73200, exp: 56200 },
  { m: 'Aug', inc: 79700, exp: 52900 },
  { m: 'Sep', inc: 70700, exp: 57500 }
];

const DONUT_DATA = [
  { n: 'Rent', a: 22000, p: 38.3, c: '#3E5C76' },
  { n: 'Food', a: 13600, p: 23.7, c: '#C93A63' },
  { n: 'Shopping', a: 9100, p: 15.8, c: '#B98A2E' },
  { n: 'Bills', a: 5600, p: 9.7, c: '#3F8E9C' },
  { n: 'Transport', a: 4800, p: 8.3, c: '#6F5E9E' },
  { n: 'Subscriptions', a: 2400, p: 4.2, c: '#8B6B54' }
];

export default function Landing() {
  return (
    <div className="ef-landing">
      <Helmet />
      <Nav />
      <main>
        <Hero />
        <Budgets />
        <Insights />
        <Reports />
        <HowItWorks />
        <Stack />
      </main>
      <Cta />
    </div>
  );
}

/* ======================== Helmet ======================== */
function Helmet() {
  useEffect(() => {
    document.title = 'ExpenseFlow — See where every rupee goes';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Track expenses and income, set category budgets, and get plain-language spending advice from Gemini. ExpenseFlow shows where your money goes before the month ends.';
    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) { theme = document.createElement('meta'); theme.name = 'theme-color'; document.head.appendChild(theme); }
    theme.content = '#ECEEE7';
  }, []);
  return null;
}

/* ======================== NAV ======================== */
function Nav() {
  const [active, setActive] = useState('top');
  const indRef = useRef(null);
  const linksRef = useRef(null);
  const sectionIds = useMemo(() => ['top', 'budgets', 'insights', 'reports', 'how'], []);

  useEffect(() => {
    const els = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    const updateInd = () => {
      if (!linksRef.current || !indRef.current) return;
      const el = linksRef.current.querySelector(`a[data-s="${active}"]`);
      if (!el) { indRef.current.style.opacity = '0'; return; }
      indRef.current.style.opacity = '1';
      indRef.current.style.width = el.offsetWidth + 'px';
      indRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
    };
    updateInd();
    window.addEventListener('resize', updateInd);
    document.fonts?.ready.then(updateInd);
    return () => window.removeEventListener('resize', updateInd);
  }, [active]);

  return (
    <header className="ef-nav" id="nav">
      <a className="ef-brand" href="#top" aria-label="ExpenseFlow home">
        <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
          <rect width="32" height="32" rx="9" fill="#0F2A29" />
          <path d="M5 21 C11 21 12 11 18 11 S23 16 27 9" fill="none" stroke="#34C7A5" strokeWidth="3" strokeLinecap="round" />
          <circle cx="27" cy="9" r="2.4" fill="#ECEEE7" />
        </svg>
        ExpenseFlow
      </a>
      <nav className="ef-links" ref={linksRef} aria-label="Sections">
        <span className="ef-ind" ref={indRef}></span>
        {sectionIds.map(id => (
          <a key={id} href={`#${id}`} data-s={id} className={active === id ? 'on' : ''}>
            {{ top: 'Flow', budgets: 'Budgets', insights: 'Insights', reports: 'Reports', how: 'How it works' }[id]}
          </a>
        ))}
      </nav>
      <div className="ef-nav-actions">
        <Link className="ef-btn ef-ghost ef-sm" to="/login">Log in</Link>
        <Link className="ef-btn ef-primary ef-sm" to="/register">Sign up</Link>
      </div>
    </header>
  );
}

/* ======================== 3D FLOATING SCENE + COINS ======================== */
function Hero3D() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (RM) return;
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;

    const onPointerMove = e => {
      const r = stage.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      scene.style.setProperty('--mx', mx.toFixed(3));
      scene.style.setProperty('--my', my.toFixed(3));
    };

    const onPointerLeave = () => {
      scene.style.setProperty('--mx', '0');
      scene.style.setProperty('--my', '0');
    };

    const onScroll = () => {
      const sep = Math.min(2.4, 1 + window.scrollY / 260);
      scene.style.setProperty('--sep', sep.toFixed(3));
    };

    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', onPointerLeave);
    stage.addEventListener('pointercancel', onPointerLeave);
    stage.addEventListener('pointerup', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointercancel', onPointerLeave);
      stage.removeEventListener('pointerup', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="ef-3d-stage ef-fade-in" ref={stageRef} style={{ '--d': 700 }} aria-label="Interactive 3D stacked dashboard cards and rotating coins">
      <div className="ef-3d-scene" ref={sceneRef}>
        {/* CARD 4: RECENT TRANSACTIONS (Bottom card — Where did the money actually go?) */}
        <div className="ef-3d-layer ef-3d-tx-card" style={{ '--z': 0 }}>
          <div className="ef-3d-header">
            <span className="ef-3d-tag">🧾 Recent Transactions</span>
            <span className="ef-3d-status">September</span>
          </div>
          <div className="ef-3d-tx-list">
            <div className="ef-3d-tx">
              <span className="ef-3d-tx-label">🍔 Swiggy · UPI</span>
              <b className="ef-num out">−₹450</b>
            </div>
            <div className="ef-3d-tx">
              <span className="ef-3d-tx-label">🏠 Rent</span>
              <b className="ef-num out">−₹22,000</b>
            </div>
            <div className="ef-3d-tx">
              <span className="ef-3d-tx-label">💼 Freelance</span>
              <b className="ef-num in">+₹5,500</b>
            </div>
            <div className="ef-3d-tx">
              <span className="ef-3d-tx-label">💡 Electricity</span>
              <b className="ef-num out">−₹2,100</b>
            </div>
            <div className="ef-3d-tx">
              <span className="ef-3d-tx-label">🛒 Shopping</span>
              <b className="ef-num out">−₹1,850</b>
            </div>
          </div>
        </div>

        {/* CARD 3: CASH FLOW (Third card — What's my current financial position?) */}
        <div className="ef-3d-layer ef-3d-cf-card" style={{ '--z': 60 }}>
          <div className="ef-3d-header">
            <span className="ef-3d-tag">💰 Live Cash Flow</span>
            <span className="ef-3d-status safe">Surplus</span>
          </div>
          <div className="ef-3d-cf-summary">
            <div className="ef-3d-cf-row">
              <span>Income</span>
              <b className="ef-num in">₹67,500</b>
            </div>
            <div className="ef-3d-cf-row">
              <span>Expenses</span>
              <b className="ef-num out">₹42,350</b>
            </div>
            <div className="ef-3d-cf-divider"></div>
            <div className="ef-3d-cf-row highlight">
              <span>Remaining</span>
              <b className="ef-num rem">₹25,150</b>
            </div>
          </div>
          <div className="ef-3d-cf-breakdown">
            <div className="ef-3d-cf-mini">
              <span className="in">+ ₹62,000 Salary</span>
              <span className="in">+ ₹5,500 Freelance</span>
            </div>
            <div className="ef-3d-cf-mini right">
              <span className="out">− ₹22,000 Rent</span>
              <span className="out">− ₹4,350 Food</span>
            </div>
          </div>
        </div>

        {/* CARD 2: BUDGET HEALTH (Second card — Am I close to overspending?) */}
        <div className="ef-3d-layer ef-3d-bgt-card" style={{ '--z': 120 }}>
          <div className="ef-3d-header">
            <span className="ef-3d-tag">📊 Category Budgets</span>
            <span className="ef-3d-status">Monthly</span>
          </div>
          <div className="ef-3d-bgt-list">
            <div className="ef-3d-bgt-item">
              <div className="ef-3d-bgt-meta">
                <span className="ef-3d-bgt-name">Food & Dining</span>
                <span className="ef-3d-bgt-pct warn">82%</span>
              </div>
              <div className="ef-3d-bar"><div className="ef-3d-bar-fill warn" style={{ width: '82%' }}></div></div>
            </div>
            <div className="ef-3d-bgt-item">
              <div className="ef-3d-bgt-meta">
                <span className="ef-3d-bgt-name">Shopping</span>
                <span className="ef-3d-bgt-pct ok">74%</span>
              </div>
              <div className="ef-3d-bar"><div className="ef-3d-bar-fill ok" style={{ width: '74%' }}></div></div>
            </div>
            <div className="ef-3d-bgt-item">
              <div className="ef-3d-bgt-meta">
                <span className="ef-3d-bgt-name">Transport</span>
                <span className="ef-3d-bgt-pct ok">62%</span>
              </div>
              <div className="ef-3d-bar"><div className="ef-3d-bar-fill ok" style={{ width: '62%' }}></div></div>
            </div>
          </div>
        </div>

        {/* CARD 1: AI INSIGHT (Top card — What should I know?) */}
        <div className="ef-3d-layer ef-3d-ai" style={{ '--z': 180 }}>
          <div className="ef-3d-header">
            <div className="ef-3d-ai-badge">
              <span>🤖</span> Gemini 2.5 Advisory
            </div>
            <span className="ef-3d-status-pill ai-safe">● Active</span>
          </div>
          <div className="ef-3d-ai-insight-title">
            Food spending <b>↑ 18.5%</b>
          </div>
          <p className="ef-3d-ai-desc">
            You spent <b>₹1,800 more</b> on food than last month.
          </p>
          <div className="ef-3d-ai-action">
            <span>💡</span> Try a ₹450 weekday dinner limit.
          </div>
        </div>

        {/* Floating 3D Rotating ₹ Coins (retained decorative effect, positioned clear of text) */}
        <div className="ef-coin" style={{ '--x': '-110px', '--y': '35px', '--z': 220, '--dl': '0s' }}>
          <div className="ef-coin-spin">
            <div className="ef-coin-face">₹</div>
            <div className="ef-coin-face ef-back">₹</div>
          </div>
        </div>
        <div className="ef-coin" style={{ '--x': '340px', '--y': '230px', '--z': 190, '--dl': '-2.5s' }}>
          <div className="ef-coin-spin">
            <div className="ef-coin-face">₹</div>
            <div className="ef-coin-face ef-back">₹</div>
          </div>
        </div>
        <div className="ef-coin" style={{ '--x': '330px', '--y': '-45px', '--z': 140, '--dl': '-4.5s' }}>
          <div className="ef-coin-spin">
            <div className="ef-coin-face">₹</div>
            <div className="ef-coin-face ef-back">₹</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== HERO + SANKEY ======================== */
function Hero() {
  const svgRef = useRef(null);
  const [month, setMonth] = useState('Sep');
  const [hover, setHover] = useState(null);
  const curRef = useRef(vals('Sep'));
  const progRef = useRef(0);
  const rafRef = useRef(0);
  const pillRef = useRef(null);
  const monthsRef = useRef(null);
  const [detailHtml, setDetailHtml] = useState('');
  const [dotColor, setDotColor] = useState('#0F2A29');
  const [figs, setFigs] = useState({ inc: '₹0', out: '₹0', save: '₹0' });

  const buildDetail = useCallback((m, h) => {
    const tgt = vals(m), ti = tgt.inc.reduce((a, b) => a + b, 0), ts = tgt.exp[6], te = ti - ts;
    const pm = ORDER[ORDER.indexOf(m) - 1], prev = pm ? vals(pm) : null;
    if (!h) {
      setDotColor('#0F2A29');
      setDetailHtml(`You earned <b>${rupee(ti)}</b>, spent <b>${rupee(te)}</b> and kept <b>${rupee(ts)}</b> (${Math.round(ts / ti * 100)}% of income).`);
      return;
    }
    if (h.t === 'inc') {
      setDotColor(INC[h.i].c);
      setDetailHtml(`<b>${INC[h.i].n}</b> brought in ${rupee(tgt.inc[h.i])}, ${Math.round(tgt.inc[h.i] / ti * 100)}% of this month's income.`);
      return;
    }
    const j = h.i, a = tgt.exp[j];
    setDotColor(EXP[j].c);
    let dl = '';
    if (prev) { const d = a - prev.exp[j]; dl = d === 0 ? ` No change from ${pm}.` : ` ${d > 0 ? 'Up' : 'Down'} ${rupee(Math.abs(d))} from ${pm}.`; }
    setDetailHtml(j === 6
      ? `<b>Saved</b>: ${rupee(a)}, a ${Math.round(a / ti * 100)}% savings rate.${dl}`
      : `<b>${EXP[j].n}</b>: ${rupee(a)}, ${Math.round(a / te * 100)}% of your spending.${dl}`);
  }, []);

  const build = useCallback((v, p, h) => {
    const svg = svgRef.current;
    if (!svg) return;
    const W = svg.clientWidth || 900, mobile = W < 640, smallMobile = W < 420;
    const H = mobile ? (smallMobile ? 330 : 360) : 420;
    const mL = smallMobile ? 64 : (mobile ? 78 : 118);
    const mR = smallMobile ? 86 : (mobile ? 96 : 150);
    const nw = smallMobile ? 8 : 10, pad = 6;
    svg.setAttribute('viewBox', `0 0 ${W} ${H + pad * 2}`);
    svg.setAttribute('height', H + pad * 2);
    const T = v.inc.reduce((a, b) => a + b, 0), ne = v.exp.length, ni = v.inc.length;
    const gapR = smallMobile ? 6 : (mobile ? 7 : 9);
    const s = (H - gapR * (ne - 1)) / T;
    const gapL = (H - s * T) / (ni - 1);
    const x0 = mL + nw, x1 = W - mR - nw, xm = (x0 + x1) / 2;
    let y = pad;
    const L = v.inc.map(a => { const o = { y, h: a * s }; y += a * s + gapL; return o; });
    y = pad;
    const R = v.exp.map(a => { const o = { y, h: a * s }; y += a * s + gapR; return o; });
    const so = L.map(n => n.y), to = R.map(n => n.y);
    let rib = '', nodes = '', lab = '';
    for (let i = 0; i < ni; i++) for (let j = 0; j < ne; j++) {
      const f = v.inc[i] * v.exp[j] / T, hh = f * s;
      const ys = so[i], yt = to[j]; so[i] += hh; to[j] += hh;
      let o = .34;
      if (h) { const rel = (h.t === 'inc' && h.i === i) || (h.t === 'exp' && h.i === j); o = rel ? .78 : .07; }
      rib += `<path class="ef-rib" data-e="${j}" data-i="${i}" fill="${EXP[j].c}" opacity="${o}" d="M${x0} ${ys}C${xm} ${ys} ${xm} ${yt} ${x1} ${yt}L${x1} ${yt + hh}C${xm} ${yt + hh} ${xm} ${ys + hh} ${x0} ${ys + hh}Z"/>`;
    }
    const la = clamp(p * 3, 0, 1), ra = clamp((p - .72) / .28, 0, 1);
    const dimI = i => h && h.t === 'inc' && h.i !== i;
    const dimE = j => h && h.t === 'exp' && h.i !== j;
    L.forEach((n, i) => {
      const op = dimI(i) ? .3 : 1;
      nodes += `<rect class="ef-nd" data-i="${i}" x="${mL}" y="${n.y}" width="${nw}" height="${Math.max(n.h, 2)}" rx="2" fill="${INC[i].c}" opacity="${la * op}"/>`;
      const cy = n.y + n.h / 2;
      lab += `<g opacity="${la * op}"><text x="${mL - 8}" y="${cy - 2}" text-anchor="end" font-size="${smallMobile ? 11.5 : (mobile ? 13 : 15)}" font-weight="600">${INC[i].n}</text><text x="${mL - 8}" y="${cy + 14}" text-anchor="end" font-size="${smallMobile ? 10 : (mobile ? 11.5 : 13)}" fill="#586C68" style="fill:#586C68" class="ef-num">${mobile ? compact(v.inc[i]) : rupee(v.inc[i])}</text></g>`;
    });
    R.forEach((n, j) => {
      const op = dimE(j) ? .3 : 1, cy = n.y + n.h / 2;
      nodes += `<rect class="ef-nd" data-e="${j}" x="${W - mR - nw}" y="${n.y}" width="${nw}" height="${Math.max(n.h, 3)}" rx="2" fill="${EXP[j].c}" opacity="${ra * op}"/>`;
      lab += `<g opacity="${ra * op}"><text x="${W - mR + 4}" y="${cy + 5}" font-size="${smallMobile ? 11.5 : (mobile ? 12.5 : 14.5)}" font-weight="600">${EXP[j].n}<tspan dx="4" font-weight="400" style="fill:#586C68">${compact(v.exp[j])}</tspan></text></g>`;
    });
    svg.innerHTML = `<defs><clipPath id="rv"><rect x="0" y="0" width="${(x0 + (x1 - x0) * p)}" height="${H + pad * 2}"/></clipPath></defs><g clip-path="url(#rv)">${rib}</g>${nodes}${lab}`;

    const ti = v.inc.reduce((a, b) => a + b, 0), sv = v.exp[v.exp.length - 1];
    setFigs({ inc: rupee(ti), out: rupee(ti - sv), save: rupee(sv) });
  }, []);

  // Intro animation
  useEffect(() => {
    const run = () => {
      if (RM) { progRef.current = 1; build(curRef.current, 1, null); buildDetail('Sep', null); return; }
      progRef.current = 0;
      build(curRef.current, 0, null);
      buildDetail('Sep', null);
      const start = performance.now() + 1300;
      const tick = now => {
        progRef.current = ease(clamp((now - start) / 1700, 0, 1));
        build(curRef.current, progRef.current, null);
        if (progRef.current < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    document.fonts ? document.fonts.ready.then(run) : run();
    return () => cancelAnimationFrame(rafRef.current);
  }, [build, buildDetail]);

  // Pill position
  useEffect(() => {
    const place = () => {
      if (!monthsRef.current || !pillRef.current) return;
      const btn = monthsRef.current.querySelector('[aria-pressed="true"]');
      if (!btn) return;
      pillRef.current.style.width = btn.offsetWidth + 'px';
      pillRef.current.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [month]);

  // Resize redraw
  useEffect(() => {
    const h = () => build(curRef.current, progRef.current, hover);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [build, hover]);

  const switchMonth = m => {
    setMonth(m);
    setHover(null);
    buildDetail(m, null);
    const from = JSON.parse(JSON.stringify(curRef.current)), to = vals(m);
    const t0 = performance.now(), D = RM ? 1 : 800;
    cancelAnimationFrame(rafRef.current);
    const step = now => {
      const k = ease(clamp((now - t0) / D, 0, 1));
      curRef.current = { inc: from.inc.map((a, i) => a + (to.inc[i] - a) * k), exp: from.exp.map((a, i) => a + (to.exp[i] - a) * k) };
      build(curRef.current, progRef.current, null);
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const onPointerOver = e => {
    const t = e.target.closest('[data-e],[data-i]');
    if (!t) return;
    let nh;
    if (t.classList.contains('ef-rib')) nh = { t: 'exp', i: +t.dataset.e };
    else if (t.dataset.e !== undefined) nh = { t: 'exp', i: +t.dataset.e };
    else nh = { t: 'inc', i: +t.dataset.i };
    if (!hover || hover.t !== nh.t || hover.i !== nh.i) {
      setHover(nh);
      build(curRef.current, progRef.current, nh);
      buildDetail(month, nh);
    }
  };
  const onPointerLeave = () => { setHover(null); build(curRef.current, progRef.current, null); buildDetail(month, null); };
  const onClick = e => { if (!e.target.closest('[data-e],[data-i]')) { setHover(null); build(curRef.current, progRef.current, null); buildDetail(month, null); } };

  return (
    <section className="ef-hero" id="top">
      <div className="ef-wrap">
        <div className="ef-hero-grid">
          <div className="ef-hero-left">
            <h1 aria-label="See where every rupee goes, before the month ends.">
              <span className="ef-ln"><span style={{ '--d': 150 }}>See where</span></span>
              <span className="ef-ln"><span style={{ '--d': 260 }}>every rupee goes,</span></span>
              <span className="ef-ln"><span style={{ '--d': 370 }}>before the month ends.</span></span>
            </h1>
            <p className="ef-lede ef-fade-in" style={{ '--d': 800 }}>
              ExpenseFlow tracks your income and expenses, holds you to category budgets, and explains your spending in plain language.
            </p>
            <div className="ef-cta-row ef-fade-in" style={{ '--d': 950 }}>
              <Link className="ef-btn ef-primary" to="/register">Create your account
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
              </Link>
              <a className="ef-btn ef-ghost" href="#budgets">Try the demo</a>
            </div>
          </div>

          <div className="ef-hero-right">
            <Hero3D />
          </div>
        </div>

        <div className="ef-flow-panel ef-fade-in" style={{ '--d': 1000 }}>
          <div className="ef-flow-head">
            <div className="ef-seg" ref={monthsRef} role="group" aria-label="Choose a month">
              <span className="ef-pill" ref={pillRef}></span>
              {ORDER.map(m => (
                <button key={m} aria-pressed={month === m ? 'true' : 'false'} data-m={m} onClick={() => switchMonth(m)}>
                  {{ Jul: 'July', Aug: 'August', Sep: 'September' }[m]}
                </button>
              ))}
            </div>
            <div className="ef-figs" aria-live="polite">
              <div className="ef-fig ef-g"><b className="ef-num">{figs.inc}</b><span>Income</span></div>
              <div className="ef-fig ef-r"><b className="ef-num">{figs.out}</b><span>Spent</span></div>
              <div className="ef-fig"><b className="ef-num">{figs.save}</b><span>Saved</span></div>
            </div>
          </div>
          <svg ref={svgRef} id="ef-sankey" role="img" aria-label="Flow diagram showing how monthly income splits into spending categories and savings."
            onPointerOver={onPointerOver} onPointerLeave={onPointerLeave} onClick={onClick}
            style={{ width: '100%', display: 'block', touchAction: 'pan-y' }}></svg>
          <div className="ef-flow-detail">
            <span className="ef-dot" style={{ background: dotColor }}></span>
            <span dangerouslySetInnerHTML={{ __html: detailHtml }}></span>
          </div>
        </div>
        <p className="ef-small" style={{ marginTop: 14 }}>Sample cash flow. Hover or tap any stream to follow it, then switch months to see it move.</p>
      </div>
    </section>
  );
}

/* ======================== BUDGETS ======================== */
function Budgets() {
  const [cats, setCats] = useState(CATS_INIT.map(c => ({ ...c })));
  const [sel, setSel] = useState({ cat: 0, amt: 800, pay: 'UPI' });
  const [ledger, setLedger] = useState([...SEED_LEDGER]);
  const [logged, setLogged] = useState(0);
  const [status, setStatus] = useState('');
  const [newFirst, setNewFirst] = useState(false);

  const logExpense = () => {
    const c = { ...cats[sel.cat] };
    c.spent += sel.amt;
    const next = cats.map((x, i) => i === sel.cat ? c : x);
    setCats(next);
    setLogged(l => l + sel.amt);
    setLedger(l => [{ d: '28 Sep', cat: sel.cat, a: sel.amt, p: sel.pay }, ...l]);
    setNewFirst(true);
    const r = c.spent / c.limit;
    setStatus(r > 1 ? `Logged ${rupee(sel.amt)} to ${c.n}. You are ${rupee(c.spent - c.limit)} over your ${c.n} budget.`
      : r >= .8 ? `Logged ${rupee(sel.amt)} to ${c.n}. ${c.n} is at ${Math.round(r * 100)}% of its budget.`
        : `Logged ${rupee(sel.amt)} to ${c.n}. ${rupee(c.limit - c.spent)} left in the budget.`);
  };

  const reset = () => {
    setCats(CATS_INIT.map(c => ({ ...c })));
    setLedger([...SEED_LEDGER]);
    setLogged(0);
    setStatus('Sample reset.');
    setNewFirst(false);
  };

  return (
    <section className="ef-sec" id="budgets">
      <div className="ef-wrap">
        <div className="ef-sec-head">
          <h2>Budgets that answer back.</h2>
          <p className="ef-lede">Set a monthly limit for each category. Every expense you log moves the bar, and the bar tells you when you are close or over.</p>
        </div>
        <div className="ef-lab">
          {/* Left: Log expense panel */}
          <div className="ef-panel">
            <h3>Log an expense</h3>
            <p className="ef-small">Pick a category, an amount and how you paid. Matches your actual transaction flow.</p>
            <div className="ef-fieldset">
              <div className="ef-k">Category</div>
              <div className="ef-chips" role="group">
                {cats.map((c, i) => (
                  <button key={c.n} className="ef-chip" aria-pressed={sel.cat === i} onClick={() => setSel(s => ({ ...s, cat: i }))}>
                    <span className="ef-sw" style={{ background: c.c }}></span>{c.n}
                  </button>
                ))}
              </div>
            </div>
            <div className="ef-fieldset">
              <div className="ef-k">Amount</div>
              <div className="ef-chips" role="group">
                {AMTS.map(a => (
                  <button key={a} className="ef-chip" aria-pressed={sel.amt === a} onClick={() => setSel(s => ({ ...s, amt: a }))}>{rupee(a)}</button>
                ))}
              </div>
            </div>
            <div className="ef-fieldset">
              <div className="ef-k">Paid with</div>
              <div className="ef-chips" role="group">
                {PAYS.map(p => (
                  <button key={p} className="ef-chip" aria-pressed={sel.pay === p} onClick={() => setSel(s => ({ ...s, pay: p }))}>{p}</button>
                ))}
              </div>
            </div>
            <div className="ef-log-row">
              <button className="ef-btn ef-primary" onClick={logExpense}>Log expense
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
              </button>
              <button className="ef-link-btn" onClick={reset}>Reset sample</button>
            </div>
            <div className="ef-status" aria-live="polite">{status}</div>
            <div className="ef-receipt" aria-label="Recent expenses">
              <div className="ef-rh"><span>Recent expenses</span><span>Sep 2026</span></div>
              <div>
                {ledger.slice(0, 5).map((e, i) => (
                  <div key={i} className={`ef-entry${newFirst && i === 0 ? ' ef-new' : ''}`}>
                    <span className="ef-d">{e.d}</span>
                    <span>{cats[e.cat]?.n}<span className="ef-m">{e.p}</span></span>
                    <span className="ef-num">{rupee(e.a)}</span>
                  </div>
                ))}
              </div>
              <div className="ef-rt"><span>Logged in this demo</span><span className="ef-num">{rupee(logged)}</span></div>
            </div>
          </div>
          {/* Right: Budget bars */}
          <div className="ef-panel">
            <h3>September budgets</h3>
            <p className="ef-small">Green is on track, amber is past 80%, rose is over the limit.</p>
            <div className="ef-bud">
              {cats.map(c => {
                const r = c.spent / c.limit, cls = r > 1 ? 'over' : r >= .8 ? 'warn' : '';
                const w = clamp(c.spent / (c.limit * 1.3), 0, 1) * 100;
                const st = r > 1 ? `${rupee(c.spent - c.limit)} over` : `${rupee(c.limit - c.spent)} left`;
                return (
                  <div className="ef-bud-row" key={c.n}>
                    <div className="ef-top"><span className="ef-nm"><i style={{ background: c.c }}></i>{c.n}</span><span className={`ef-st ef-num ${cls}`}>{rupee(c.spent)} of {rupee(c.limit)} · {st}</span></div>
                    <div className="ef-track" role="progressbar" aria-label={`${c.n} budget used`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(r * 100)}>
                      <div className={`ef-fill ${cls}`} style={{ width: `${w}%` }}></div>
                      <div className="ef-limit"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ef-bud-meta"><span>Total budgeted <b className="ef-num">{rupee(cats.reduce((a, c) => a + c.limit, 0))}</b></span><span>Spent so far <b className="ef-num">{rupee(cats.reduce((a, c) => a + c.spent, 0))}</b></span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================== INSIGHTS ======================== */
function Insights() {
  const [ai, setAi] = useState(0);
  const [manual, setManual] = useState(false);
  const [started, setStarted] = useState(false);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es, obs) => {
      es.forEach(e => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          setAi(0);
          if (!RM) timerRef.current = setInterval(() => setAi(a => (a + 1) % AI.length), 9000);
          else setManual(true);
          obs.disconnect();
        }
      });
    }, { threshold: .5 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timerRef.current); };
  }, [started]);

  const selectTab = i => { clearInterval(timerRef.current); setManual(true); setAi(i); };
  const a = AI[ai];

  const wordsHtml = (text, base) => text.split(' ').map((w, i) => `<span class="ef-w" style="animation-delay:${base + i * 32}ms">${w}</span>`).join(' ');

  return (
    <section className="ef-sec ef-pine" id="insights">
      <div className="ef-wrap">
        <div className="ef-ai-grid">
          <div>
            <h2>Advice that has read your ledger.</h2>
            <p className="ef-lede" style={{ marginTop: 22 }}>
              One tap sends your monthly income, categorized expenses, and balance to Google Gemini 2.5 Flash. You get back clear observations, budget warnings, and actionable tips—written like a person would say it.
            </p>
            <div className="ef-cta-row" style={{ marginTop: 30 }}>
              <Link className="ef-btn ef-light" to="/register">Get your insights
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
              </Link>
            </div>
          </div>
          <div className={`ef-ai-card${manual ? ' ef-manual' : ''}`} ref={cardRef}>
            <div className="ef-ai-tabs" role="tablist" aria-label="Sample insights">
              {AI.map((x, i) => (
                <button key={x.tab} role="tab" aria-selected={ai === i} onClick={() => selectTab(i)}>
                  {x.tab}<span className="ef-prog"></span>
                </button>
              ))}
            </div>
            <div className="ef-ai-metric"><b className="ef-num">{a.big}</b><span>{a.small}</span></div>
            <p className="ef-ai-body" aria-live="polite" dangerouslySetInnerHTML={{ __html: wordsHtml(a.body, 60) }} key={`body-${ai}`}></p>
            <p className="ef-ai-act" dangerouslySetInnerHTML={{ __html: wordsHtml(a.act, 60 + a.body.split(' ').length * 32 + 120) }} key={`act-${ai}`}></p>
            <p className="ef-ai-foot">Generated by Google Gemini 2.5 Flash via Java 21 HttpClient. Real ledger-based advice.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================== REPORTS (Authentic Trend & Donut) ======================== */
function Reports() {
  const [activeIdx, setActiveIdx] = useState(5); // Default to Sep
  const [activeCat, setActiveCat] = useState(null);

  const activeTrend = TREND_DATA[activeIdx];
  const netSaved = activeTrend.inc - activeTrend.exp;
  const savingsPct = Math.round((netSaved / activeTrend.inc) * 100);

  // SVG coordinate calculations for 6-month line chart
  const W = 520;
  const H = 200;
  const padL = 46;
  const padR = 20;
  const padT = 24;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const minVal = 45000;
  const maxVal = 85000;

  const getX = i => padL + (i / (TREND_DATA.length - 1)) * plotW;
  const getY = val => padT + (1 - (val - minVal) / (maxVal - minVal)) * plotH;

  const incPoints = TREND_DATA.map((d, i) => `${getX(i)},${getY(d.inc)}`).join(' ');
  const expPoints = TREND_DATA.map((d, i) => `${getX(i)},${getY(d.exp)}`).join(' ');

  // Donut geometry
  const donutSize = 170;
  const strokeWidth = 24;
  const center = donutSize / 2;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const totalDonut = DONUT_DATA.reduce((sum, d) => sum + d.a, 0);

  let cumOffset = 0;

  return (
    <section className="ef-sec" id="reports">
      <div className="ef-wrap">
        <div className="ef-sec-head">
          <h2>Reports that turn numbers into clarity.</h2>
          <p className="ef-lede">
            Track your income against expenses over the last two quarters, and inspect your exact category distribution with interactive visual reports.
          </p>
        </div>

        <div className="ef-reports-grid">
          {/* Card 1: 6-Month Trend Line Chart */}
          <div className="ef-reports-card">
            <div className="ef-chart-head">
              <div>
                <h3>6-Month Cash Flow Trend</h3>
                <p className="ef-small">
                  <b>{activeTrend.m} 2026:</b> Earned <b className="ef-num">{rupee(activeTrend.inc)}</b>, Spent <b className="ef-num">{rupee(activeTrend.exp)}</b> ({netSaved >= 0 ? '+' : ''}{rupee(netSaved)} · {savingsPct}% saved)
                </p>
              </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="ef-chart-svg" role="img" aria-label="6-month line chart comparing income and expenses">
              {/* Gridlines & Y-axis labels */}
              {[50000, 65000, 80000].map(val => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#C6CEC3" strokeDasharray="3 3" strokeOpacity="0.7" />
                    <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#586C68" className="ef-num">
                      ₹{val / 1000}k
                    </text>
                  </g>
                );
              })}

              {/* Active month vertical guideline */}
              <line
                x1={getX(activeIdx)}
                y1={padT}
                x2={getX(activeIdx)}
                y2={H - padB}
                stroke="#0F2A29"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.4"
              />

              {/* Expense line (Rose) */}
              <polyline
                fill="none"
                stroke="#C93A63"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={expPoints}
              />

              {/* Income line (Emerald) */}
              <polyline
                fill="none"
                stroke="#17806A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={incPoints}
              />

              {/* Data points & hover triggers */}
              {TREND_DATA.map((d, i) => {
                const x = getX(i);
                const yInc = getY(d.inc);
                const yExp = getY(d.exp);
                const isActive = activeIdx === i;

                return (
                  <g key={d.m} style={{ cursor: 'pointer' }} onMouseEnter={() => setActiveIdx(i)}>
                    <rect x={x - plotW / 10} y={0} width={plotW / 5} height={H} fill="transparent" />

                    <circle
                      cx={x}
                      cy={yExp}
                      r={isActive ? 6 : 4}
                      fill="#C93A63"
                      stroke="#F8F9F4"
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{ transition: 'r 0.18s' }}
                    />

                    <circle
                      cx={x}
                      cy={yInc}
                      r={isActive ? 6 : 4}
                      fill="#17806A"
                      stroke="#F8F9F4"
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{ transition: 'r 0.18s' }}
                    />

                    <text
                      x={x}
                      y={H - 12}
                      textAnchor="middle"
                      fontSize={isActive ? 13.5 : 12.5}
                      fontWeight={isActive ? 700 : 500}
                      fill={isActive ? '#0F2A29' : '#586C68'}
                    >
                      {d.m}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="ef-chart-legend">
              <span className="ef-chart-legend-item">
                <i style={{ background: '#17806A' }}></i> Income
              </span>
              <span className="ef-chart-legend-item">
                <i style={{ background: '#C93A63' }}></i> Expenses
              </span>
              <span className="ef-small" style={{ marginLeft: 'auto' }}>Hover any month to inspect</span>
            </div>
          </div>

          {/* Card 2: September Category Breakdown (Donut Chart) */}
          <div className="ef-reports-card">
            <div className="ef-chart-head">
              <div>
                <h3>September Breakdown</h3>
                <p className="ef-small">Category share of ₹57,500 total spending</p>
              </div>
            </div>

            <div className="ef-donut-layout">
              <div className="ef-donut-chart-box">
                <svg viewBox={`0 0 ${donutSize} ${donutSize}`} className="ef-chart-svg" style={{ width: '100%', height: '100%' }}>
                  <g transform={`rotate(-90 ${center} ${center})`}>
                    {DONUT_DATA.map(item => {
                      const pct = item.a / totalDonut;
                      const dashLength = circumference * pct;
                      const offset = -cumOffset;
                      cumOffset += dashLength;
                      const isHovered = activeCat && activeCat.n === item.n;

                      return (
                        <circle
                          key={item.n}
                          cx={center}
                          cy={center}
                          r={radius}
                          fill="none"
                          stroke={item.c}
                          strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                          strokeDasharray={`${dashLength} ${circumference}`}
                          strokeDashoffset={offset}
                          strokeLinecap="butt"
                          style={{
                            transition: 'stroke-width 0.2s, opacity 0.2s',
                            cursor: 'pointer',
                            opacity: activeCat && !isHovered ? 0.4 : 1
                          }}
                          onMouseEnter={() => setActiveCat(item)}
                          onMouseLeave={() => setActiveCat(null)}
                        />
                      );
                    })}
                  </g>
                  {/* Center Text */}
                  <text x={center} y={center - 8} textAnchor="middle" fontSize="11" fill="#586C68" fontWeight="500">
                    {activeCat ? activeCat.n : 'Total Spent'}
                  </text>
                  <text x={center} y={center + 11} textAnchor="middle" fontSize="16" fill="#0F2A29" fontWeight="700">
                    {activeCat ? rupee(activeCat.a) : rupee(totalDonut)}
                  </text>
                  {activeCat && (
                    <text x={center} y={center + 26} textAnchor="middle" fontSize="11" fill={activeCat.c} fontWeight="600">
                      {activeCat.p}% of total
                    </text>
                  )}
                </svg>
              </div>

              <div className="ef-donut-legend">
                {DONUT_DATA.map(item => {
                  const isHovered = activeCat && activeCat.n === item.n;
                  return (
                    <div
                      key={item.n}
                      className={`ef-donut-item${isHovered ? ' ef-active' : ''}`}
                      onMouseEnter={() => setActiveCat(item)}
                      onMouseLeave={() => setActiveCat(null)}
                    >
                      <span className="ef-donut-label">
                        <i style={{ background: item.c }}></i>
                        {item.n}
                        <span className="ef-donut-pct">{item.p}%</span>
                      </span>
                      <span className="ef-donut-val ef-num">{rupee(item.a)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cumulative Metrics */}
        <div className="ef-reports-metrics">
          <div className="ef-metric-tile">
            <b className="ef-num">₹4,32,300</b>
            <span>6-Month Cumulative Income</span>
          </div>
          <div className="ef-metric-tile">
            <b className="ef-num">₹3,24,100</b>
            <span>6-Month Total Expenses</span>
          </div>
          <div className="ef-metric-tile">
            <b className="ef-num" style={{ color: '#17806A' }}>₹1,08,200</b>
            <span>Net Savings (25% Avg Rate)</span>
          </div>
          <div className="ef-metric-tile">
            <b>Rent & Food</b>
            <span>Top Outflows (62% of Spending)</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ======================== HOW IT WORKS ======================== */
function HowItWorks() {
  const stepsRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = stepsRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es, obs) => {
      es.forEach(e => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } });
    }, { threshold: .4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const steps = [
    { title: 'Create an account', desc: 'Register with your email. Your session is secured by stateless JWT authentication and BCrypt password encryption, strictly isolated to your user ID.' },
    { title: 'Log money in and out', desc: 'Record incomes and daily expenses categorized with payment methods (UPI, Cash, or Card), notes, and transaction dates.' },
    { title: 'Set category budgets', desc: 'Define monthly limits per category and monitor real-time progress bars with green, amber, and over-budget rose alerts.' },
    { title: 'Analyze & get AI advice', desc: 'Review 6-month trends, category donut distributions, and receive tailored financial recommendations from Google Gemini 2.5 Flash.' }
  ];

  return (
    <section className="ef-sec" id="how">
      <div className="ef-wrap">
        <div className="ef-sec-head">
          <h2>From sign-up to first insight in four steps.</h2>
          <p className="ef-lede">No bank linking and no spreadsheet import. You enter what you spend and earn, and ExpenseFlow does the arithmetic.</p>
        </div>
        <div className={`ef-steps${inView ? ' ef-in' : ''}`} ref={stepsRef}>
          {steps.map((s, i) => (
            <div className="ef-step" key={i} style={{ '--i': i }}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================== STACK ======================== */
function Stack() {
  return (
    <section className="ef-sec ef-pine" id="stack">
      <div className="ef-wrap">
        <p className="ef-big-quote">Every query is scoped to the person who is signed in.</p>
        <p className="ef-lede" style={{ marginTop: 22 }}>ExpenseFlow is a full-stack SaaS platform built and deployed end to end: stateless JWT sessions, BCrypt-hashed passwords, and a normalized MySQL schema where every financial record belongs to exactly one user.</p>
        <div className="ef-stack">
          <div><h3>Frontend</h3><ul><li>React 19<small>Single-page app with hooks</small></li><li>Vite 8<small>Lightning-fast bundler & dev server</small></li><li>React Router 7<small>Guarded client routes</small></li><li>Vanilla CSS3<small>Custom fintech design tokens</small></li></ul></div>
          <div><h3>Backend</h3><ul><li>Spring Boot 4.1<small>Enterprise Java 21 REST API</small></li><li>Spring Security 6<small>Stateless JWT + BCrypt</small></li><li>Spring Data JPA<small>Hibernate 6 ORM persistence</small></li><li>Maven<small>Build and dependency management</small></li></ul></div>
          <div><h3>Data & AI</h3><ul><li>MySQL 8.0<small>Strict foreign-key constraints</small></li><li>Gemini 2.5 Flash<small>Native Java 21 HttpClient</small></li><li>Custom Categories<small>User-scoped classifications</small></li><li>Category Budgets<small>Dynamic threshold tracking</small></li></ul></div>
          <div><h3>Infrastructure</h3><ul><li>AWS EC2<small>Ubuntu 24.04 LTS compute</small></li><li>Nginx 1.24<small>Reverse proxy & SSL / TLS</small></li><li>expenseflow.dev<small>Production HTTPS domain</small></li><li>REST Endpoints<small>Clean controller architecture</small></li></ul></div>
        </div>
      </div>
    </section>
  );
}

/* ======================== CTA + FOOTER ======================== */
function Cta() {
  return (
    <footer className="ef-pine ef-cta" style={{ paddingTop: 110 }}>
      <div className="ef-wrap">
        <h2>Start with this month.</h2>
        <div className="ef-cta-row">
          <Link className="ef-btn ef-light" to="/register">Create your account
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" /></svg>
          </Link>
          <Link className="ef-btn ef-ghost-light" to="/login">Log in</Link>
        </div>
        <div className="ef-foot">
          <span>ExpenseFlow · Full-Stack Personal Finance & AI Insights</span>
          <span><a href="https://github.com/akkiiop/expenseflow" target="_blank" rel="noopener noreferrer">GitHub ↗</a> &nbsp;·&nbsp; MIT License</span>
        </div>
      </div>
    </footer>
  );
}
