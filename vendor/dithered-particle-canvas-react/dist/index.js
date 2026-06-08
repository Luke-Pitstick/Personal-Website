var Lr = Object.defineProperty;
var yt = (e) => {
  throw TypeError(e);
};
var yr = (e, t, r) => t in e ? Lr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var J = (e, t, r) => yr(e, typeof t != "symbol" ? t + "" : t, r), nt = (e, t, r) => t.has(e) || yt("Cannot " + r);
var n = (e, t, r) => (nt(e, t, "read from private field"), r ? r.call(e) : t.get(e)), d = (e, t, r) => t.has(e) ? yt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), h = (e, t, r, i) => (nt(e, t, "write to private field"), i ? i.call(e, r) : t.set(e, r), r), u = (e, t, r) => (nt(e, t, "access private method"), r);
import { jsxs as Ir, jsx as It } from "react/jsx-runtime";
import { useRef as ot, useEffect as Ct, useImperativeHandle as Cr, forwardRef as Fr } from "react";
const Ft = {
  browserbase: ["#eff2dc", "#b7c7da", "#4874b7", "#172033"],
  mono: ["#000000", "#ffffff"]
}, Mr = /^#(?<hex>[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/iu;
function Fe(e) {
  var i;
  const t = Mr.exec(e.trim()), r = (i = t == null ? void 0 : t.groups) == null ? void 0 : i.hex;
  if (!r)
    throw new Error(
      `Invalid color "${e}". Use #rgb, #rgba, #rrggbb, or #rrggbbaa.`
    );
  return r.length === 3 || r.length === 4 ? {
    r: parseInt(r[0] + r[0], 16),
    g: parseInt(r[1] + r[1], 16),
    b: parseInt(r[2] + r[2], 16),
    a: r.length === 4 ? parseInt(r[3] + r[3], 16) : 255
  } : {
    r: parseInt(r.slice(0, 2), 16),
    g: parseInt(r.slice(2, 4), 16),
    b: parseInt(r.slice(4, 6), 16),
    a: r.length === 8 ? parseInt(r.slice(6, 8), 16) : 255
  };
}
function Pr(e) {
  if (!e || e === "browserbase")
    return Ft.browserbase.map(Fe);
  if (e === "mono")
    return Ft.mono.map(Fe);
  if (e === "source")
    return "source";
  if (e.length === 0)
    throw new Error("Palette must contain at least one color.");
  return e.map(Fe);
}
function Qt(e, t) {
  if (t.length === 0)
    throw new Error("Palette must contain at least one color.");
  let r = t[0], i = Number.POSITIVE_INFINITY;
  for (const o of t) {
    const s = (e.r - o.r) ** 2 + (e.g - o.g) ** 2 + (e.b - o.b) ** 2 + (e.a - o.a) ** 2 * 0.25;
    s < i && (r = o, i = s);
  }
  return r;
}
function ct(e, t, r) {
  const i = E(r);
  return {
    r: je(e.r, t.r, i),
    g: je(e.g, t.g, i),
    b: je(e.b, t.b, i),
    a: je(e.a, t.a, i)
  };
}
function v(e) {
  return Math.min(255, Math.max(0, Math.round(e)));
}
function E(e) {
  return Math.min(1, Math.max(0, e));
}
function je(e, t, r) {
  return e + (t - e) * r;
}
function $(e, t, r) {
  const i = r ?? new Uint8ClampedArray(e * t * 4);
  if (i.length !== e * t * 4)
    throw new Error(
      `ImageData length mismatch: expected ${e * t * 4}, received ${i.length}.`
    );
  return typeof ImageData < "u" ? new ImageData(i, e, t) : { data: i, height: t, width: e };
}
function z(e) {
  return $(
    e.width,
    e.height,
    new Uint8ClampedArray(e.data)
  );
}
function Zt(e, t, r) {
  const i = (r * e.width + t) * 4;
  return [
    e.data[i] ?? 0,
    e.data[i + 1] ?? 0,
    e.data[i + 2] ?? 0,
    e.data[i + 3] ?? 0
  ];
}
function Jt(e, t, r, i) {
  const o = (r * e.width + t) * 4;
  e.data[o] = i[0], e.data[o + 1] = i[1], e.data[o + 2] = i[2], e.data[o + 3] = i[3];
}
const Mt = [
  "brightness",
  "contrast",
  "posterize",
  "tint",
  "paletteQuantize",
  "opacity"
];
function Dr(e = []) {
  return [...e].sort((t, r) => Mt.indexOf(t.type) - Mt.indexOf(r.type));
}
function er(e, t = []) {
  const r = z(e);
  for (const i of Dr(t))
    kr(r, i);
  return r;
}
function tr(e, t = []) {
  return er(
    e,
    t.filter((r) => r.type !== "opacity")
  );
}
function rr(e, t = []) {
  return er(
    e,
    t.filter((r) => r.type === "opacity")
  );
}
function kr(e, t) {
  switch (t.type) {
    case "brightness":
      st(e, (r) => r * t.amount);
      return;
    case "contrast":
      st(e, (r) => (r - 128) * t.amount + 128);
      return;
    case "posterize": {
      const i = 255 / (Math.max(2, Math.round(t.levels)) - 1);
      st(e, (o) => Math.round(o / i) * i);
      return;
    }
    case "tint": {
      const r = Fe(t.color), i = E(t.amount);
      for (let o = 0; o < e.data.length; o += 4) {
        const s = ct(
          {
            a: e.data[o + 3] ?? 0,
            b: e.data[o + 2] ?? 0,
            g: e.data[o + 1] ?? 0,
            r: e.data[o] ?? 0
          },
          r,
          i
        );
        e.data[o] = v(s.r), e.data[o + 1] = v(s.g), e.data[o + 2] = v(s.b);
      }
      return;
    }
    case "paletteQuantize": {
      if (t.colors.length === 0)
        throw new Error("paletteQuantize requires at least one color.");
      const r = t.colors.map(Fe).map((o) => ({ ...o, a: 255 })), i = E(t.amount ?? 1);
      for (let o = 0; o < e.data.length; o += 4) {
        const s = e.data[o + 3] ?? 0;
        if (s === 0)
          continue;
        const a = {
          a: 255,
          b: e.data[o + 2] ?? 0,
          g: e.data[o + 1] ?? 0,
          r: e.data[o] ?? 0
        }, c = Qt(a, r), f = ct(
          { ...a, a: s },
          { ...c, a: s },
          i
        );
        e.data[o] = v(f.r), e.data[o + 1] = v(f.g), e.data[o + 2] = v(f.b);
      }
      return;
    }
    case "opacity": {
      const r = E(t.amount);
      for (let i = 3; i < e.data.length; i += 4)
        e.data[i] = v((e.data[i] ?? 0) * r);
    }
  }
}
function st(e, t) {
  for (let r = 0; r < e.data.length; r += 4)
    e.data[r] = v(t(e.data[r] ?? 0)), e.data[r + 1] = v(t(e.data[r + 1] ?? 0)), e.data[r + 2] = v(t(e.data[r + 2] ?? 0));
}
class S extends Error {
  constructor({
    cause: r,
    code: i,
    fix: o,
    problem: s
  }) {
    super(s);
    J(this, "code");
    J(this, "cause");
    J(this, "fix");
    J(this, "problem");
    this.name = "RendererError", this.code = i, this.cause = r, this.fix = o, this.problem = s;
  }
}
const Ie = {
  edgeDither: 0.55,
  edgeFlicker: 0,
  edgeNoise: 0,
  fadeMs: 450,
  foregroundBlend: 1,
  mode: "reveal",
  pixelSize: 1,
  radius: 150,
  softness: 0.35,
  strength: 1,
  trail: !1
}, ir = Ie, Pt = {
  dustFlicker: 0,
  dustSize: 2,
  durationMs: 900,
  idleMs: 160,
  maxPoints: 24,
  spacing: 18,
  strength: 0.72
}, nr = 18, Br = 0.7, Nr = 17.17, Or = 80, Ur = 23.37, Gr = 90, at = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];
function rt(e) {
  return {
    ...ir,
    ...e || {}
  };
}
function Me(e) {
  return e ? e === !0 ? Pt : {
    ...Pt,
    ...e
  } : !1;
}
function Wr({
  active: e,
  elapsedSinceInactiveMs: t = 0,
  fadeMs: r = ir.fadeMs,
  reducedMotion: i = !1
}) {
  return e ? 1 : i || r <= 0 ? 0 : E(1 - Math.max(0, t) / r);
}
function Dt({
  pointer: e,
  reveal: t,
  time: r,
  x: i,
  y: o
}) {
  if (!t)
    return 0;
  const s = rt(t), a = Math.max(0, s.radius);
  if (a === 0)
    return 0;
  const c = sr(s.pixelSize), f = kt(i, c), l = kt(o, c), m = Math.hypot(f - e.x, l - e.y), b = E(s.softness), x = a * (1 - b), U = a - x, Z = U > 0 ? E(s.edgeNoise) : 0, F = Z > 0 && m > x ? a + ($r(f, l, e.x, e.y, Vr(c)) - 0.5) * U * Br * Z : a;
  if (m >= F)
    return 0;
  const D = m <= x ? 1 : 1 - Hr(x, F, m);
  if (D <= 0)
    return 0;
  const qe = E(s.edgeDither), ae = 1 - D, Lt = E(s.edgeFlicker), Rr = Lt > 0 ? Kr(e, c, r ?? 0, Lt) : void 0;
  return qe > 0 && ae > 0 && zr(i, o, c, Rr) < ae * qe ? 0 : E(D * E(s.strength) * E(e.fade ?? 1));
}
function Xr(e) {
  const t = Dt(e), r = rt(e.reveal), i = Me(r.trail);
  if (!i)
    return t;
  let o = 0;
  const s = E(i.dustFlicker), a = s > 0 ? Math.floor(Math.max(0, e.time ?? 0) / Or) * Nr * s : 0;
  for (const c of e.pointer.trail ?? []) {
    const f = E(c.fade), l = c.x * 0.37 + c.y * 0.21 + a, m = Math.max(1, i.dustSize);
    f <= 0 || or(e.x, e.y, l, m) > f || (o = Math.max(
      o,
      Dt({
        ...e,
        pointer: {
          fade: E(i.strength),
          x: c.x,
          y: c.y
        }
      })
    ));
  }
  return Math.max(t, o);
}
function zr(e, t, r = 1, i) {
  const o = sr(r);
  if (i !== void 0)
    return or(e, t, i, o);
  const s = Bt(Math.floor(t / o), at.length), a = Bt(Math.floor(e / o), at[s].length);
  return (at[s][a] + 0.5) / 16;
}
function or(e, t, r = 0, i = 2) {
  const o = Math.max(1, i), s = Math.floor(e / o), a = Math.floor(t / o), c = Math.sin(s * 12.9898 + a * 78.233 + r * 0.037719) * 43758.5453;
  return c - Math.floor(c);
}
function $r(e, t, r, i, o = nr) {
  const s = Math.max(1, o), a = Math.floor((e - r) / s), c = Math.floor((t - i) / s), f = Math.sin(a * 127.1 + c * 311.7) * 43758.5453123;
  return f - Math.floor(f);
}
function sr(e) {
  return Math.max(1, Math.round(e ?? 1));
}
function kt(e, t) {
  return t <= 1 ? e : Math.floor(e / t) * t + t / 2;
}
function Vr(e) {
  return e > 1 ? e : nr;
}
function Kr(e, t, r, i) {
  const o = Math.floor(e.x / t) * 0.73 + Math.floor(e.y / t) * 0.41, s = Math.floor(Math.max(0, r) / Gr) * Ur;
  return (o + s) * i;
}
function Hr(e, t, r) {
  if (e === t)
    return r < t ? 0 : 1;
  const i = E((r - e) / (t - e));
  return i * i * (3 - 2 * i);
}
function Bt(e, t) {
  return (e % t + t) % t;
}
const Yr = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
], qr = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21]
];
function jr(e) {
  return e === 4 ? Yr : qr;
}
function ar(e, t) {
  var l;
  if (t === !1)
    return z(e);
  const r = E((t == null ? void 0 : t.amount) ?? 1), i = Pr(t == null ? void 0 : t.palette);
  if (r === 0 || i === "source")
    return z(e);
  const o = (t == null ? void 0 : t.matrixSize) ?? 4, s = jr(o), a = z(e), c = Math.max(1, Math.round((t == null ? void 0 : t.pixelSize) ?? 1)), f = o * o;
  for (let m = 0; m < a.height; m += 1)
    for (let b = 0; b < a.width; b += 1) {
      const x = (m * a.width + b) * 4, Z = (((((l = s[Math.floor(m / c) % o]) == null ? void 0 : l[Math.floor(b / c) % o]) ?? 0) + 0.5) / f - 0.5) * 96 * r, F = {
        a: a.data[x + 3] ?? 0,
        b: a.data[x + 2] ?? 0,
        g: a.data[x + 1] ?? 0,
        r: a.data[x] ?? 0
      }, D = {
        ...F,
        b: v(F.b + Z),
        g: v(F.g + Z),
        r: v(F.r + Z)
      }, qe = Qt(D, i), ae = ct(F, { ...qe, a: F.a }, r);
      a.data[x] = v(ae.r), a.data[x + 1] = v(ae.g), a.data[x + 2] = v(ae.b), a.data[x + 3] = v(ae.a);
    }
  return a;
}
const Qr = {
  active: !1,
  x: 0,
  y: 0
};
var G, be, ue, xe, Pe, K, De, dt;
class Zr {
  constructor() {
    d(this, De);
    J(this, "name", "canvas2d");
    d(this, G);
    d(this, be);
    d(this, ue, {});
    d(this, xe);
    d(this, Pe, Qr);
    d(this, K, { height: 1, width: 1 });
  }
  init(t, r) {
    h(this, G, t), h(this, be, t.getContext("2d") ?? void 0), this.resize(r);
  }
  setLayers(t) {
    h(this, ue, t);
  }
  setPointer(t) {
    h(this, Pe, t);
  }
  resize(t) {
    h(this, K, t), n(this, G) && (n(this, G).width = t.width, n(this, G).height = t.height);
  }
  render(t) {
    var i;
    const r = this.renderToImageData(n(this, ue), t);
    h(this, xe, r), (i = n(this, be)) == null || i.putImageData(r, 0, 0);
  }
  renderToImageData(t = n(this, ue), r = { deltaTime: 0, time: 0 }) {
    var l, m, b;
    const i = t.background ? u(this, De, dt).call(this, t.background) : $(n(this, K).width, n(this, K).height), o = t.foreground ? u(this, De, dt).call(this, t.foreground) : void 0;
    if (!o)
      return i;
    const s = ri(i, o), a = r.revealLayer ?? "background", c = n(this, Pe), f = a === "background" ? (l = t.foreground) == null ? void 0 : l.reveal : (m = t.background) == null ? void 0 : m.reveal;
    return !f || !c.active && (c.fade ?? 0) <= 0 && (((b = c.trail) == null ? void 0 : b.length) ?? 0) === 0 ? s : ii({
      background: i,
      base: s,
      foreground: o,
      pointer: c,
      revealLayer: a,
      reveal: f,
      time: r.time
    });
  }
  async exportFrame(t = "image/png") {
    var r;
    return n(this, G) ? new Promise((i, o) => {
      var s;
      (s = n(this, G)) == null || s.toBlob((a) => {
        a ? i(a) : o(new Error("Canvas frame export failed."));
      }, t);
    }) : new Blob([((r = n(this, xe)) == null ? void 0 : r.data) ?? new Uint8ClampedArray()], { type: t });
  }
  dispose() {
    h(this, G, void 0), h(this, be, void 0), h(this, ue, {}), h(this, xe, void 0);
  }
}
G = new WeakMap(), be = new WeakMap(), ue = new WeakMap(), xe = new WeakMap(), Pe = new WeakMap(), K = new WeakMap(), De = new WeakSet(), dt = function(t) {
  if (!t.visible)
    return $(n(this, K).width, n(this, K).height);
  const r = Jr(t.source.imageData, n(this, K), t), i = tr(r, t.filters), o = ar(i, t.dither), s = rr(o, t.filters);
  if (t.opacity === 1)
    return s;
  const a = z(s), c = E(t.opacity);
  for (let f = 3; f < a.data.length; f += 4)
    a.data[f] = v(a.data[f] * c);
  return a;
};
function Jr(e, t, r) {
  if (!e)
    return $(t.width, t.height);
  if (e.width === t.width && e.height === t.height && r.fit === "stretch")
    return z(e);
  const i = $(t.width, t.height), o = ei(e, t, r.fit), s = e.width * o.x, a = e.height * o.y, c = ti(t, s, a, r.position);
  for (let f = 0; f < t.height; f += 1)
    for (let l = 0; l < t.width; l += 1) {
      const m = Math.floor((l - c.x) / o.x), b = Math.floor((f - c.y) / o.y);
      m >= 0 && m < e.width && b >= 0 && b < e.height && Jt(i, l, f, Zt(e, m, b));
    }
  return i;
}
function ei(e, t, r) {
  if (r === "none")
    return { x: 1, y: 1 };
  const i = t.width / e.width, o = t.height / e.height;
  if (r === "contain") {
    const s = Math.min(i, o);
    return { x: s, y: s };
  }
  if (r === "cover") {
    const s = Math.max(i, o);
    return { x: s, y: s };
  }
  return { x: i, y: o };
}
function ti(e, t, r, i) {
  return i === "center" ? {
    x: (e.width - t) / 2,
    y: (e.height - r) / 2
  } : {
    x: (e.width - t) * i.x,
    y: (e.height - r) * i.y
  };
}
function ri(e, t) {
  const r = z(e);
  for (let i = 0; i < r.data.length; i += 4) {
    const o = (t.data[i + 3] ?? 0) / 255, s = (e.data[i + 3] ?? 0) / 255, a = o + s * (1 - o);
    if (a === 0) {
      r.data[i] = 0, r.data[i + 1] = 0, r.data[i + 2] = 0, r.data[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c += 1)
      r.data[i + c] = v(
        ((t.data[i + c] ?? 0) * o + (e.data[i + c] ?? 0) * s * (1 - o)) / a
      );
    r.data[i + 3] = v(a * 255);
  }
  return r;
}
function ii({
  background: e,
  base: t,
  foreground: r,
  pointer: i,
  reveal: o,
  revealLayer: s,
  time: a
}) {
  const c = z(t), f = s === "background" ? e : r;
  for (let l = 0; l < c.height; l += 1)
    for (let m = 0; m < c.width; m += 1) {
      const b = Xr({ pointer: i, reveal: o, time: a, x: m, y: l });
      if (b === 0)
        continue;
      const x = (l * c.width + m) * 4, U = s === "background" ? (r.data[x + 3] ?? 0) / 255 : 0, Z = s === "background" ? E(o.foregroundBlend ?? 1) : 1, F = b * (1 - U * (1 - Z));
      for (let D = 0; D < 4; D += 1)
        c.data[x + D] = v(
          (t.data[x + D] ?? 0) * (1 - F) + (f.data[x + D] ?? 0) * F
        );
    }
  return c;
}
function ni(e, t) {
  const r = e.createFramebuffer();
  if (!r)
    throw new Error("WebGL2 framebuffer allocation failed.");
  return e.bindFramebuffer(e.FRAMEBUFFER, r), e.framebufferTexture2D(
    e.FRAMEBUFFER,
    e.COLOR_ATTACHMENT0,
    e.TEXTURE_2D,
    t.texture,
    0
  ), e.bindFramebuffer(e.FRAMEBUFFER, null), { framebuffer: r, texture: t };
}
function oi(e, t) {
  e && t && e.deleteFramebuffer(t.framebuffer);
}
function Nt(e, t) {
  if (!e.visible)
    return $(t.width, t.height);
  const r = si(e.source.imageData, t, e), i = tr(r, e.filters), o = ar(i, e.dither), s = rr(o, e.filters);
  if (e.opacity === 1)
    return s;
  const a = z(s), c = E(e.opacity);
  for (let f = 3; f < a.data.length; f += 4)
    a.data[f] = v(a.data[f] * c);
  return a;
}
function si(e, t, r) {
  if (!e)
    return $(t.width, t.height);
  if (e.width === t.width && e.height === t.height && r.fit === "stretch")
    return z(e);
  const i = $(t.width, t.height), o = ai(e, t, r.fit), s = e.width * o.x, a = e.height * o.y, c = hi(t, s, a, r.position);
  for (let f = 0; f < t.height; f += 1)
    for (let l = 0; l < t.width; l += 1) {
      const m = Math.floor((l - c.x) / o.x), b = Math.floor((f - c.y) / o.y);
      m >= 0 && m < e.width && b >= 0 && b < e.height && Jt(i, l, f, Zt(e, m, b));
    }
  return i;
}
function ai(e, t, r) {
  if (r === "none")
    return { x: 1, y: 1 };
  const i = t.width / e.width, o = t.height / e.height;
  if (r === "contain") {
    const s = Math.min(i, o);
    return { x: s, y: s };
  }
  if (r === "cover") {
    const s = Math.max(i, o);
    return { x: s, y: s };
  }
  return { x: i, y: o };
}
function hi(e, t, r, i) {
  return i === "center" ? {
    x: (e.width - t) / 2,
    y: (e.height - r) / 2
  } : {
    x: (e.width - t) * i.x,
    y: (e.height - r) * i.y
  };
}
function Ot(e, t, r, i) {
  const o = e.createShader(t);
  if (!o)
    throw new S({
      code: "WEBGL_SHADER_COMPILE_FAILED",
      fix: "Check browser WebGL2 support and reload if shader allocation keeps failing.",
      problem: `WebGL2 shader "${i}" could not be created.`
    });
  if (e.shaderSource(o, r), e.compileShader(o), !e.getShaderParameter(o, e.COMPILE_STATUS)) {
    const s = e.getShaderInfoLog(o) ?? "No shader compiler log was returned.";
    throw e.deleteShader(o), new S({
      cause: s,
      code: "WEBGL_SHADER_COMPILE_FAILED",
      fix: "Inspect the shader source and browser GPU support; the renderer can fall back to Canvas2D.",
      problem: `WebGL2 shader "${i}" failed to compile.`
    });
  }
  return o;
}
function Ut({
  attributes: e = [],
  fragmentLabel: t,
  fragmentSource: r,
  gl: i,
  uniforms: o = [],
  vertexLabel: s,
  vertexSource: a
}) {
  const c = Ot(i, i.VERTEX_SHADER, a, s), f = Ot(i, i.FRAGMENT_SHADER, r, t), l = i.createProgram();
  if (!l)
    throw i.deleteShader(c), i.deleteShader(f), new S({
      code: "WEBGL_PROGRAM_LINK_FAILED",
      fix: "Check browser WebGL2 support and reload if program allocation keeps failing.",
      problem: `WebGL2 program "${t}" could not be created.`
    });
  if (i.attachShader(l, c), i.attachShader(l, f), e.forEach((m, b) => {
    i.bindAttribLocation(l, b, m);
  }), i.linkProgram(l), i.deleteShader(c), i.deleteShader(f), !i.getProgramParameter(l, i.LINK_STATUS)) {
    const m = i.getProgramInfoLog(l) ?? "No program linker log was returned.";
    throw i.deleteProgram(l), new S({
      cause: m,
      code: "WEBGL_PROGRAM_LINK_FAILED",
      fix: "Inspect shader varyings, uniforms, and browser GPU support; the renderer can fall back to Canvas2D.",
      problem: `WebGL2 program "${t}" failed to link.`
    });
  }
  return {
    attributes: Object.fromEntries(e.map((m) => [m, i.getAttribLocation(l, m)])),
    program: l,
    uniforms: Object.fromEntries(o.map((m) => [m, i.getUniformLocation(l, m)]))
  };
}
const Gt = `#version 300 es
in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`, ui = `#version 300 es
precision mediump float;

uniform sampler2D u_texture;
in vec2 v_uv;
out vec4 outColor;

void main() {
  outColor = texture(u_texture, vec2(v_uv.x, 1.0 - v_uv.y));
}
`, ci = `#version 300 es
precision highp float;
precision highp int;

const int MAX_TRAIL_POINTS = 12;
const float DUST_FLICKER_SEED_SCALE = 17.17;
const float DUST_FLICKER_STEP_MS = 80.0;
const float EDGE_FLICKER_SEED_SCALE = 23.37;
const float EDGE_FLICKER_STEP_MS = 90.0;
const float EDGE_NOISE_CELL_SIZE = 18.0;
const float EDGE_NOISE_MAX_WIDTH_MULTIPLIER = 0.7;

uniform sampler2D u_background;
uniform sampler2D u_foreground;
uniform vec2 u_pointer;
uniform float u_pointerActive;
uniform float u_pointerFade;
uniform float u_radius;
uniform float u_softness;
uniform float u_strength;
uniform float u_time;
uniform float u_edgeDither;
uniform float u_edgeFlicker;
uniform float u_edgeNoise;
uniform float u_foregroundBlend;
uniform float u_revealPixelSize;
uniform int u_revealLayer;
uniform int u_trailCount;
uniform float u_trailDustFlicker;
uniform float u_trailDustSize;
uniform vec4 u_trailPoint0;
uniform vec4 u_trailPoint1;
uniform vec4 u_trailPoint2;
uniform vec4 u_trailPoint3;
uniform vec4 u_trailPoint4;
uniform vec4 u_trailPoint5;
uniform vec4 u_trailPoint6;
uniform vec4 u_trailPoint7;
uniform vec4 u_trailPoint8;
uniform vec4 u_trailPoint9;
uniform vec4 u_trailPoint10;
uniform vec4 u_trailPoint11;
uniform float u_trailStrength;

in vec2 v_uv;
out vec4 outColor;

float bayer4(vec2 pixel, float pixelSize) {
  vec2 cell = floor(pixel / max(1.0, pixelSize));
  int x = int(mod(cell.x, 4.0));
  int y = int(mod(cell.y, 4.0));

  if (y == 0) {
    if (x == 0) return (0.0 + 0.5) / 16.0;
    if (x == 1) return (8.0 + 0.5) / 16.0;
    if (x == 2) return (2.0 + 0.5) / 16.0;
    return (10.0 + 0.5) / 16.0;
  }

  if (y == 1) {
    if (x == 0) return (12.0 + 0.5) / 16.0;
    if (x == 1) return (4.0 + 0.5) / 16.0;
    if (x == 2) return (14.0 + 0.5) / 16.0;
    return (6.0 + 0.5) / 16.0;
  }

  if (y == 2) {
    if (x == 0) return (3.0 + 0.5) / 16.0;
    if (x == 1) return (11.0 + 0.5) / 16.0;
    if (x == 2) return (1.0 + 0.5) / 16.0;
    return (9.0 + 0.5) / 16.0;
  }

  if (x == 0) return (15.0 + 0.5) / 16.0;
  if (x == 1) return (7.0 + 0.5) / 16.0;
  if (x == 2) return (13.0 + 0.5) / 16.0;
  return (5.0 + 0.5) / 16.0;
}

float dustThreshold(vec2 pixel, float seed, float cellSize) {
  vec2 cell = floor(pixel / max(1.0, cellSize));
  return fract(sin(dot(cell, vec2(12.9898, 78.233)) + seed * 0.037719) * 43758.5453);
}

float edgeDitherThreshold(vec2 pixel, float pixelSize, float seed) {
  return seed >= 0.0 ? dustThreshold(pixel, seed, pixelSize) : bayer4(pixel, pixelSize);
}

float edgeNoise(vec2 pixel, vec2 point, float pixelSize) {
  float cellSize = pixelSize > 1.0 ? pixelSize : EDGE_NOISE_CELL_SIZE;
  vec2 cell = floor(vec2(pixel.x - point.x, point.y - pixel.y) / cellSize);
  return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453123);
}

vec4 sourceOver(vec4 destination, vec4 source) {
  float alpha = source.a + destination.a * (1.0 - source.a);

  if (alpha <= 0.0) {
    return vec4(0.0);
  }

  vec3 rgb = (source.rgb * source.a + destination.rgb * destination.a * (1.0 - source.a)) / alpha;
  return vec4(rgb, alpha);
}

float revealMask(vec2 pixel, vec2 point, float fade) {
  float revealPixelSize = max(1.0, u_revealPixelSize);
  vec2 samplePixel = revealPixelSize <= 1.0
    ? pixel
    : floor(pixel / revealPixelSize) * revealPixelSize + revealPixelSize * 0.5;
  float distanceToPointer = distance(samplePixel, point);
  float softStart = u_radius * (1.0 - clamp(u_softness, 0.0, 1.0));
  float edgeWidth = u_radius - softStart;
  float outerRadius = u_radius;

  if (u_edgeNoise > 0.0 && edgeWidth > 0.0 && distanceToPointer > softStart) {
    outerRadius +=
      (edgeNoise(samplePixel, point, revealPixelSize) - 0.5) *
      edgeWidth *
      EDGE_NOISE_MAX_WIDTH_MULTIPLIER *
      clamp(u_edgeNoise, 0.0, 1.0);
  }

  float mask = 0.0;

  if (distanceToPointer <= softStart) {
    mask = 1.0;
  } else if (distanceToPointer < outerRadius) {
    mask = 1.0 - smoothstep(softStart, outerRadius, distanceToPointer);
  }

  if (mask > 0.0 && u_edgeDither > 0.0) {
    float edgeAmount = 1.0 - mask;
    float edgeFlicker = clamp(u_edgeFlicker, 0.0, 1.0);
    float edgeSeed = edgeFlicker > 0.0
      ? (
        floor(point.x / revealPixelSize) * 0.73 +
        floor(point.y / revealPixelSize) * 0.41 +
        floor(max(u_time, 0.0) / EDGE_FLICKER_STEP_MS) * EDGE_FLICKER_SEED_SCALE
      ) * edgeFlicker
      : -1.0;
    mask = edgeDitherThreshold(pixel, revealPixelSize, edgeSeed) < edgeAmount * clamp(u_edgeDither, 0.0, 1.0) ? 0.0 : mask;
  }

  return mask * clamp(u_strength, 0.0, 1.0) * clamp(fade, 0.0, 1.0);
}

void applyTrailPoint(vec2 pixel, vec4 point, float dustSeedOffset, inout float mask) {
  if (dustThreshold(pixel, point.w + dustSeedOffset, u_trailDustSize) <= clamp(point.z, 0.0, 1.0)) {
    mask = max(mask, revealMask(pixel, point.xy, u_trailStrength));
  }
}

void main() {
  vec4 background = texture(u_background, v_uv);
  vec4 foreground = texture(u_foreground, v_uv);
  vec4 base = sourceOver(background, foreground);

  if ((u_pointerActive < 0.5 && u_trailCount == 0) || u_radius <= 0.0) {
    outColor = base;
    return;
  }

  vec2 pixel = gl_FragCoord.xy;
  float mask = 0.0;

  if (u_pointerActive >= 0.5) {
    mask = revealMask(pixel, u_pointer, u_pointerFade);
  }

  float dustSeedOffset =
    floor(max(u_time, 0.0) / DUST_FLICKER_STEP_MS) *
    DUST_FLICKER_SEED_SCALE *
    clamp(u_trailDustFlicker, 0.0, 1.0);

  if (u_trailCount > 0) applyTrailPoint(pixel, u_trailPoint0, dustSeedOffset, mask);
  if (u_trailCount > 1) applyTrailPoint(pixel, u_trailPoint1, dustSeedOffset, mask);
  if (u_trailCount > 2) applyTrailPoint(pixel, u_trailPoint2, dustSeedOffset, mask);
  if (u_trailCount > 3) applyTrailPoint(pixel, u_trailPoint3, dustSeedOffset, mask);
  if (u_trailCount > 4) applyTrailPoint(pixel, u_trailPoint4, dustSeedOffset, mask);
  if (u_trailCount > 5) applyTrailPoint(pixel, u_trailPoint5, dustSeedOffset, mask);
  if (u_trailCount > 6) applyTrailPoint(pixel, u_trailPoint6, dustSeedOffset, mask);
  if (u_trailCount > 7) applyTrailPoint(pixel, u_trailPoint7, dustSeedOffset, mask);
  if (u_trailCount > 8) applyTrailPoint(pixel, u_trailPoint8, dustSeedOffset, mask);
  if (u_trailCount > 9) applyTrailPoint(pixel, u_trailPoint9, dustSeedOffset, mask);
  if (u_trailCount > 10) applyTrailPoint(pixel, u_trailPoint10, dustSeedOffset, mask);
  if (u_trailCount > 11) applyTrailPoint(pixel, u_trailPoint11, dustSeedOffset, mask);

  vec4 revealSource = u_revealLayer == 0 ? background : foreground;
  float foregroundBlendMask = u_revealLayer == 0
    ? 1.0 - foreground.a * (1.0 - clamp(u_foregroundBlend, 0.0, 1.0))
    : 1.0;
  outColor = mix(base, revealSource, mask * foregroundBlendMask);
}
`;
let Wt = 1;
const Xt = /* @__PURE__ */ new WeakMap();
function di(e) {
  if (e.url)
    return `url:${e.url}`;
  if (e.blob)
    return `blob:${Qe(e.blob)}`;
  if (e.bitmap)
    return `bitmap:${Qe(e.bitmap)}`;
  if (e.element) {
    const t = e.element.currentSrc || e.element.src;
    return t ? `image:${t}` : `image:${Qe(e.element)}`;
  }
  return e.imageData ? `image-data:${Qe(e.imageData)}:${e.width}x${e.height}` : `${e.kind}:${e.width}x${e.height}`;
}
function ht(e, t) {
  const r = e.createTexture();
  if (!r)
    throw new Error("WebGL2 texture allocation failed.");
  return e.bindTexture(e.TEXTURE_2D, r), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, 0), e.texImage2D(
    e.TEXTURE_2D,
    0,
    e.RGBA,
    t.width,
    t.height,
    0,
    e.RGBA,
    e.UNSIGNED_BYTE,
    t.data
  ), e.bindTexture(e.TEXTURE_2D, null), { height: t.height, texture: r, width: t.width };
}
function fi(e, t, r) {
  const i = e.createTexture();
  if (!i)
    throw new Error("WebGL2 texture allocation failed.");
  return e.bindTexture(e.TEXTURE_2D, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(
    e.TEXTURE_2D,
    0,
    e.RGBA,
    t,
    r,
    0,
    e.RGBA,
    e.UNSIGNED_BYTE,
    null
  ), e.bindTexture(e.TEXTURE_2D, null), { height: r, texture: i, width: t };
}
function li(e, t) {
  e && t && e.deleteTexture(t.texture);
}
function Qe(e) {
  const t = Xt.get(e);
  if (t)
    return t;
  const r = Wt;
  return Wt += 1, Xt.set(e, r), r;
}
const mi = {
  active: !1,
  x: 0,
  y: 0
}, gi = new Float32Array([
  -1,
  -1,
  1,
  -1,
  -1,
  1,
  1,
  1
]), zt = 12, trailUniformNames = [
  "u_trailPoint0",
  "u_trailPoint1",
  "u_trailPoint2",
  "u_trailPoint3",
  "u_trailPoint4",
  "u_trailPoint5",
  "u_trailPoint6",
  "u_trailPoint7",
  "u_trailPoint8",
  "u_trailPoint9",
  "u_trailPoint10",
  "u_trailPoint11"
];
var k, I, ke, B, te, re, ve, W, N, ce, ie, Ee, w, de, Be, Ne, g, ft, hr, lt, ur, cr, dr, Je, mt, ee, gt, pt, bt, xt, pe;
class pi {
  constructor(t = {}) {
    d(this, g);
    J(this, "name", "webgl2");
    J(this, "debugCounters", {
      compositePasses: 0,
      contextLost: 0,
      contextRestored: 0,
      framebuffersCreated: 0,
      framebuffersDeleted: 0,
      processedTextureRebuilds: 0,
      programsCreated: 0,
      programsDeleted: 0,
      sourceTextureUploads: 0,
      texturesCreated: 0,
      texturesDeleted: 0
    });
    d(this, k);
    d(this, I);
    d(this, ke);
    d(this, B);
    d(this, te, {});
    d(this, re, !1);
    d(this, ve);
    d(this, W, mi);
    d(this, N);
    d(this, ce);
    d(this, ie);
    d(this, Ee, !1);
    d(this, w, { height: 1, width: 1 });
    d(this, de, /* @__PURE__ */ new Map());
    d(this, Be, (t) => {
      this.handleContextLostForTest(t);
    });
    d(this, Ne, () => {
      this.handleContextRestoredForTest();
    });
    h(this, ke, t.contextFactory), h(this, ve, t.onError);
  }
  init(t, r) {
    h(this, I, t), h(this, w, r), t.width = r.width, t.height = r.height, t.addEventListener("webglcontextlost", n(this, Be)), t.addEventListener("webglcontextrestored", n(this, Ne)), u(this, g, ft).call(this);
  }
  setLayers(t) {
    h(this, te, t);
  }
  setPointer(t) {
    h(this, W, t);
  }
  resize(t) {
    var r;
    h(this, w, t), n(this, I) && (n(this, I).width = t.width, n(this, I).height = t.height), u(this, g, bt).call(this), u(this, g, pe).call(this, n(this, k)), h(this, k, void 0), (r = n(this, B)) == null || r.viewport(0, 0, t.width, t.height);
  }
  render(t) {
    if (n(this, re))
      return;
    const r = u(this, g, ee).call(this), i = u(this, g, gt).call(this), o = u(this, g, lt).call(this, "background"), s = u(this, g, lt).call(this, "foreground");
    r.bindFramebuffer(r.FRAMEBUFFER, null), r.viewport(0, 0, n(this, w).width, n(this, w).height), r.useProgram(i.composite.program), u(this, g, Je).call(this, 0, o.texture), u(this, g, Je).call(this, 1, s.texture), r.uniform1i(i.composite.uniforms.u_background, 0), r.uniform1i(i.composite.uniforms.u_foreground, 1), u(this, g, dr).call(this, i.composite, t), u(this, g, mt).call(this), this.debugCounters.compositePasses += 1;
  }
  async exportFrame(t = "image/png") {
    return n(this, I) ? new Promise((r, i) => {
      var o;
      (o = n(this, I)) == null || o.toBlob((s) => {
        s ? r(s) : i(new Error("WebGL2 canvas frame export failed."));
      }, t);
    }) : new Blob([], { type: t });
  }
  dispose() {
    var t, r;
    (t = n(this, I)) == null || t.removeEventListener("webglcontextlost", n(this, Be)), (r = n(this, I)) == null || r.removeEventListener("webglcontextrestored", n(this, Ne)), u(this, g, pt).call(this), h(this, I, void 0), h(this, te, {}), h(this, re, !1);
  }
  handleContextLostForTest(t) {
    var r;
    t == null || t.preventDefault(), h(this, re, !0), this.debugCounters.contextLost += 1, (r = n(this, ve)) == null || r.call(
      this,
      new S({
        code: "BACKEND_UNAVAILABLE",
        fix: "Rendering is paused while the browser restores the WebGL2 context.",
        problem: "The WebGL2 rendering context was lost."
      })
    );
  }
  handleContextRestoredForTest() {
    var t;
    if (!n(this, Ee)) {
      h(this, Ee, !0);
      try {
        u(this, g, pt).call(this), u(this, g, ft).call(this), h(this, re, !1), h(this, Ee, !1), this.debugCounters.contextRestored += 1;
      } catch (r) {
        h(this, re, !0), (t = n(this, ve)) == null || t.call(
          this,
          new S({
            cause: r,
            code: "WEBGL_CONTEXT_RESTORE_FAILED",
            fix: "Try reloading the page or use the static hero fallback for this environment.",
            problem: "The WebGL2 rendering context could not be restored."
          })
        );
      }
    }
  }
  renderPreprocessedLayerForTest(t) {
    return Nt(t, n(this, w));
  }
}
k = new WeakMap(), I = new WeakMap(), ke = new WeakMap(), B = new WeakMap(), te = new WeakMap(), re = new WeakMap(), ve = new WeakMap(), W = new WeakMap(), N = new WeakMap(), ce = new WeakMap(), ie = new WeakMap(), Ee = new WeakMap(), w = new WeakMap(), de = new WeakMap(), Be = new WeakMap(), Ne = new WeakMap(), g = new WeakSet(), ft = function() {
  var i;
  const t = n(this, I);
  if (!t)
    throw new S({
      code: "CANVAS_UNAVAILABLE",
      fix: "Mount the renderer with a real canvas element before initializing WebGL2.",
      problem: "WebGL2 backend was initialized without a canvas."
    });
  const r = ((i = n(this, ke)) == null ? void 0 : i.call(this, t)) ?? t.getContext("webgl2", {
    alpha: !0,
    premultipliedAlpha: !1
  });
  if (!r)
    throw new S({
      code: "BACKEND_UNAVAILABLE",
      fix: "Enable WebGL2 in this browser or use the static hero fallback.",
      problem: "WebGL2 is not available for this canvas."
    });
  h(this, B, r), h(this, N, {
    composite: Ut({
      attributes: ["a_position"],
      fragmentLabel: "reveal-composite-fragment",
      fragmentSource: ci,
      gl: r,
      uniforms: [
        "u_background",
        "u_edgeDither",
        "u_edgeFlicker",
        "u_edgeNoise",
        "u_foregroundBlend",
        "u_foreground",
        "u_pointer",
        "u_pointerActive",
        "u_pointerFade",
        "u_radius",
        "u_revealPixelSize",
        "u_revealLayer",
        "u_softness",
        "u_strength",
        "u_time",
        "u_trailCount",
        "u_trailDustFlicker",
        "u_trailDustSize",
        "u_trailPoint0",
        "u_trailPoint1",
        "u_trailPoint2",
        "u_trailPoint3",
        "u_trailPoint4",
        "u_trailPoint5",
        "u_trailPoint6",
        "u_trailPoint7",
        "u_trailPoint8",
        "u_trailPoint9",
        "u_trailPoint10",
        "u_trailPoint11",
        "u_trailStrength"
      ],
      vertexLabel: "fullscreen-vertex",
      vertexSource: Gt
    }),
    copy: Ut({
      attributes: ["a_position"],
      fragmentLabel: "copy-fragment",
      fragmentSource: ui,
      gl: r,
      uniforms: ["u_texture"],
      vertexLabel: "fullscreen-vertex",
      vertexSource: Gt
    })
  }), this.debugCounters.programsCreated += 2, u(this, g, hr).call(this, r), r.viewport(0, 0, n(this, w).width, n(this, w).height);
}, hr = function(t) {
  var s;
  const r = t.createBuffer(), i = t.createVertexArray();
  if (!r || !i)
    throw new S({
      code: "BACKEND_UNAVAILABLE",
      fix: "Lower WebGL pressure or use the static hero fallback if this browser cannot allocate geometry.",
      problem: "WebGL2 fullscreen geometry could not be created."
    });
  h(this, ce, r), h(this, ie, i), t.bindVertexArray(i), t.bindBuffer(t.ARRAY_BUFFER, r), t.bufferData(t.ARRAY_BUFFER, gi, t.STATIC_DRAW);
  const o = ((s = n(this, N)) == null ? void 0 : s.copy.attributes.a_position) ?? 0;
  t.enableVertexAttribArray(o), t.vertexAttribPointer(o, 2, t.FLOAT, !1, 0, 0), t.bindVertexArray(null), t.bindBuffer(t.ARRAY_BUFFER, null);
}, lt = function(t) {
  const r = n(this, te)[t];
  if (!r)
    return u(this, g, ur).call(this);
  const i = bi(r, n(this, w)), o = n(this, de).get(t);
  if ((o == null ? void 0 : o.key) === i)
    return o.processedTexture;
  u(this, g, xt).call(this, o);
  const s = u(this, g, ee).call(this), a = r.source.imageData ?? $(r.source.width, r.source.height), c = ht(s, a);
  this.debugCounters.sourceTextureUploads += 1, this.debugCounters.texturesCreated += 1;
  const f = Nt(r, n(this, w)), l = ht(s, f), m = fi(s, f.width, f.height);
  this.debugCounters.texturesCreated += 2;
  const b = ni(s, m);
  this.debugCounters.framebuffersCreated += 1, u(this, g, cr).call(this, l, b), u(this, g, pe).call(this, l), this.debugCounters.processedTextureRebuilds += 1;
  const x = {
    framebuffer: b,
    key: i,
    processedTexture: m,
    sourceTexture: c
  };
  return n(this, de).set(t, x), m;
}, ur = function() {
  return n(this, k) ? n(this, k) : (h(this, k, ht(
    u(this, g, ee).call(this),
    $(n(this, w).width, n(this, w).height)
  )), this.debugCounters.texturesCreated += 1, n(this, k));
}, cr = function(t, r) {
  const i = u(this, g, ee).call(this), o = u(this, g, gt).call(this);
  i.bindFramebuffer(i.FRAMEBUFFER, r.framebuffer), i.viewport(0, 0, r.texture.width, r.texture.height), i.useProgram(o.copy.program), u(this, g, Je).call(this, 0, t.texture), i.uniform1i(o.copy.uniforms.u_texture, 0), u(this, g, mt).call(this), i.bindFramebuffer(i.FRAMEBUFFER, null);
}, dr = function(t, r) {
  const i = u(this, g, ee).call(this), o = r.revealLayer ?? "background", s = o === "background" ? n(this, te).foreground : n(this, te).background, a = { ...Ie, ...(s == null ? void 0 : s.reveal) || {} }, c = Me(a.trail), f = (n(this, W).trail ?? []).slice(0, zt), l = !!(s != null && s.reveal) && (n(this, W).active || (n(this, W).fade ?? 0) > 0);
  i.uniform2f(t.uniforms.u_pointer, n(this, W).x, n(this, w).height - n(this, W).y), i.uniform1f(t.uniforms.u_pointerActive, l ? 1 : 0), i.uniform1f(t.uniforms.u_pointerFade, n(this, W).fade ?? 1), i.uniform1f(t.uniforms.u_radius, a.radius), i.uniform1f(t.uniforms.u_softness, a.softness), i.uniform1f(t.uniforms.u_strength, a.strength), i.uniform1f(t.uniforms.u_time, r.time), i.uniform1f(t.uniforms.u_edgeDither, a.edgeDither), i.uniform1f(t.uniforms.u_edgeFlicker, Math.max(0, Math.min(1, a.edgeFlicker))), i.uniform1f(t.uniforms.u_edgeNoise, a.edgeNoise), i.uniform1f(t.uniforms.u_foregroundBlend, a.foregroundBlend), i.uniform1f(t.uniforms.u_revealPixelSize, Math.max(1, Math.round(a.pixelSize))), i.uniform1i(t.uniforms.u_revealLayer, o === "background" ? 0 : 1), i.uniform1i(t.uniforms.u_trailCount, c ? f.length : 0), i.uniform1f(
    t.uniforms.u_trailDustFlicker,
    c ? Math.max(0, Math.min(1, c.dustFlicker)) : 0
  ), i.uniform1f(t.uniforms.u_trailDustSize, c ? Math.max(1, c.dustSize) : 1), i.uniform1f(t.uniforms.u_trailStrength, c ? c.strength : 0);
  const m = new Float32Array(zt * 4);
  for (let b = 0; b < f.length; b += 1) {
    const x = f[b], U = b * 4;
    m[U] = x.x, m[U + 1] = n(this, w).height - x.y, m[U + 2] = x.fade, m[U + 3] = x.x * 0.37 + x.y * 0.21;
  }
  for (let b = 0; b < zt; b += 1) {
    const x = b * 4;
    i.uniform4f(t.uniforms[trailUniformNames[b]], m[x], m[x + 1], m[x + 2], m[x + 3]);
  }
}, Je = function(t, r) {
  const i = u(this, g, ee).call(this);
  i.activeTexture(i.TEXTURE0 + t), i.bindTexture(i.TEXTURE_2D, r);
}, mt = function() {
  const t = u(this, g, ee).call(this);
  t.bindVertexArray(n(this, ie) ?? null), t.drawArrays(t.TRIANGLE_STRIP, 0, 4), t.bindVertexArray(null);
}, ee = function() {
  if (!n(this, B))
    throw new S({
      code: "BACKEND_UNAVAILABLE",
      fix: "Initialize the backend with a WebGL2-capable canvas before rendering.",
      problem: "WebGL2 backend has no active context."
    });
  return n(this, B);
}, gt = function() {
  if (!n(this, N))
    throw new S({
      code: "BACKEND_UNAVAILABLE",
      fix: "Initialize WebGL2 programs before rendering.",
      problem: "WebGL2 backend has no active shader programs."
    });
  return n(this, N);
}, pt = function() {
  const t = n(this, B);
  u(this, g, bt).call(this), u(this, g, pe).call(this, n(this, k)), h(this, k, void 0), t && n(this, ce) && t.deleteBuffer(n(this, ce)), t && n(this, ie) && t.deleteVertexArray(n(this, ie)), t && n(this, N) && (t.deleteProgram(n(this, N).copy.program), t.deleteProgram(n(this, N).composite.program), this.debugCounters.programsDeleted += 2), h(this, ce, void 0), h(this, ie, void 0), h(this, N, void 0), h(this, B, void 0);
}, bt = function() {
  for (const t of n(this, de).values())
    u(this, g, xt).call(this, t);
  n(this, de).clear();
}, xt = function(t) {
  t && (oi(n(this, B), t.framebuffer), this.debugCounters.framebuffersDeleted += 1, u(this, g, pe).call(this, t.sourceTexture), u(this, g, pe).call(this, t.processedTexture));
}, pe = function(t) {
  t && (li(n(this, B), t), this.debugCounters.texturesDeleted += 1);
};
function bi(e, t) {
  return vt({
    dither: e.dither,
    filters: e.filters,
    fit: e.fit,
    opacity: e.opacity,
    output: {
      height: t.height,
      width: t.width
    },
    position: e.position,
    role: e.role,
    source: di(e.source),
    sourceSize: {
      height: e.source.height,
      width: e.source.width
    },
    visible: e.visible
  });
}
function vt(e) {
  return !e || typeof e != "object" ? JSON.stringify(e) : Array.isArray(e) ? `[${e.map(vt).join(",")}]` : `{${Object.entries(e).sort(([t], [r]) => t.localeCompare(r)).map(([t, r]) => `${JSON.stringify(t)}:${vt(r)}`).join(",")}}`;
}
const $t = {
  active: !1,
  fade: 0,
  x: 0,
  y: 0
};
function xi(e, t, r) {
  const i = t.width > 0 ? r.width / t.width : 1, o = t.height > 0 ? r.height / t.height : 1;
  return {
    pressure: e.pressure,
    x: (e.clientX - t.left) * i,
    y: (e.clientY - t.top) * o
  };
}
var fe, le, A, R, Q, fr, lr, Et;
class vi {
  constructor() {
    d(this, Q);
    d(this, fe, !1);
    d(this, le, 0);
    d(this, A, { ...$t });
    d(this, R, []);
  }
  getSnapshot({
    now: t = 0,
    reducedMotion: r = !1,
    reveal: i
  } = {}) {
    if (!n(this, fe))
      return { ...n(this, A) };
    const o = rt(i), s = Me(o.trail), a = Math.max(0, t - n(this, le)), c = !!s && n(this, A).active && a > (s ? Math.max(0, s.idleMs) : 0), f = n(this, A).active && !c, l = o.fadeMs, m = Wr({
      active: f,
      elapsedSinceInactiveMs: a,
      fadeMs: l,
      reducedMotion: r
    }), b = u(this, Q, lr).call(this, t, o, r);
    return h(this, A, {
      ...n(this, A),
      active: f,
      fade: s && !f ? 0 : m,
      trail: b
    }), { ...n(this, A) };
  }
  isFadeActive(t = {}) {
    var i;
    const r = this.getSnapshot(t);
    return !r.active && E(r.fade ?? 0) > 0 || (((i = r.trail) == null ? void 0 : i.length) ?? 0) > 0;
  }
  move(t, r, i, o = 0, s = {}) {
    const a = xi(t, r, i);
    return h(this, fe, !0), h(this, le, o), h(this, A, {
      active: !0,
      fade: 1,
      pressure: a.pressure,
      x: a.x,
      y: a.y
    }), u(this, Q, fr).call(this, a, o, s), this.getSnapshot({ ...s, now: o });
  }
  leave(t = 0, r = {}) {
    return n(this, fe) ? (h(this, le, t), h(this, A, {
      ...n(this, A),
      active: !1,
      fade: 1
    }), this.getSnapshot({ ...r, now: t })) : { ...n(this, A) };
  }
  clear() {
    return h(this, fe, !1), h(this, le, 0), h(this, A, { ...$t }), h(this, R, []), { ...n(this, A) };
  }
}
fe = new WeakMap(), le = new WeakMap(), A = new WeakMap(), R = new WeakMap(), Q = new WeakSet(), fr = function(t, r, { reducedMotion: i = !1, reveal: o }) {
  const s = Me(rt(o).trail);
  if (i || !s || s.durationMs <= 0 || s.maxPoints <= 0) {
    h(this, R, []);
    return;
  }
  u(this, Q, Et).call(this, r, s.durationMs);
  const a = n(this, R).at(-1), c = Math.max(0, s.spacing);
  a && Math.hypot(t.x - a.x, t.y - a.y) < c && r - a.time < 80 || (n(this, R).push({
    time: r,
    x: t.x,
    y: t.y
  }), n(this, R).length > s.maxPoints && n(this, R).splice(0, n(this, R).length - s.maxPoints));
}, lr = function(t, r, i) {
  const o = Me(r.trail);
  if (i || !o || o.durationMs <= 0) {
    h(this, R, []);
    return;
  }
  if (u(this, Q, Et).call(this, t, o.durationMs), n(this, R).length !== 0)
    return n(this, R).map((s) => ({
      fade: E(1 - Math.max(0, t - s.time) / o.durationMs),
      x: s.x,
      y: s.y
    })).filter((s) => s.fade > 0);
}, Et = function(t, r) {
  h(this, R, n(this, R).filter((i) => t - i.time < r));
};
function Ei(e, t, r) {
  const i = t.reveal === !0 ? Ie : t.reveal ? { ...Ie, ...t.reveal } : !1;
  return {
    dither: t.dither ?? { amount: 1, matrixSize: 4, palette: "browserbase" },
    filters: t.filters ?? [],
    fit: t.fit ?? "cover",
    opacity: t.opacity ?? 1,
    position: t.position ?? "center",
    reveal: i,
    role: e,
    source: r,
    visible: t.visible ?? !0
  };
}
async function _i(e, t = {}) {
  var i;
  const r = Ai(e);
  if (r && ((i = t.warn) == null || i.call(t, "Animated GIF playback is not available in V1; using the first frame.")), Ri(e))
    return {
      firstFrameOnly: r,
      height: e.height,
      imageData: e,
      kind: "image-data",
      width: e.width
    };
  if (Li(e))
    return {
      bitmap: e,
      firstFrameOnly: r,
      height: e.height,
      imageData: Ze(e, e.width, e.height),
      kind: "image-bitmap",
      width: e.width
    };
  if (mr(e))
    try {
      const o = await Ti(t)(e);
      return {
        bitmap: o,
        blob: e,
        firstFrameOnly: r,
        height: o.height,
        imageData: Ze(o, o.width, o.height),
        kind: "blob",
        width: o.width
      };
    } catch (o) {
      throw ut(o);
    }
  if (yi(e))
    try {
      return typeof e.decode == "function" && await e.decode(), {
        element: e,
        firstFrameOnly: r,
        height: e.naturalHeight || e.height,
        imageData: Ze(
          e,
          e.naturalWidth || e.width,
          e.naturalHeight || e.height
        ),
        kind: "html-image",
        width: e.naturalWidth || e.width
      };
    } catch (o) {
      throw ut(o);
    }
  try {
    const o = await Si(t)(e);
    return {
      element: o,
      firstFrameOnly: r,
      height: o.naturalHeight || o.height,
      imageData: Ze(
        o,
        o.naturalWidth || o.width,
        o.naturalHeight || o.height
      ),
      kind: "url",
      url: e,
      width: o.naturalWidth || o.width
    };
  } catch (o) {
    throw ut(o);
  }
}
function Ti(e) {
  const t = e.createImageBitmap ?? globalThis.createImageBitmap;
  if (!t)
    throw new S({
      code: "SOURCE_DECODE_FAILED",
      fix: "Run in a browser with createImageBitmap support or provide a decoder.",
      problem: "Image source decoding is unavailable."
    });
  return t.bind(globalThis);
}
function Si(e) {
  if (e.loadImage)
    return e.loadImage;
  if (typeof Image > "u")
    throw new S({
      code: "SOURCE_DECODE_FAILED",
      fix: "Provide a loadImage implementation when normalizing URL sources outside the browser.",
      problem: "URL image decoding is unavailable."
    });
  return async (t) => {
    const r = new Image();
    return r.crossOrigin = "anonymous", r.decoding = "async", r.src = t, await r.decode(), r;
  };
}
function ut(e) {
  return e instanceof S ? e : new S({
    cause: e,
    code: "SOURCE_DECODE_FAILED",
    fix: "Check that the image URL, blob, or bitmap is readable and CORS-enabled for pixel access.",
    problem: "Image source could not be decoded."
  });
}
function Ze(e, t, r) {
  const i = wi(t, r);
  if (!i)
    return;
  const o = i.getContext("2d", { willReadFrequently: !0 });
  if (!o)
    throw new S({
      code: "CANVAS_UNAVAILABLE",
      fix: "Run in a browser with Canvas2D support or provide ImageData sources.",
      problem: "Image source pixels could not be read."
    });
  return o.drawImage(e, 0, 0, t, r), o.getImageData(0, 0, t, r);
}
function wi(e, t) {
  if (typeof OffscreenCanvas < "u")
    return new OffscreenCanvas(e, t);
  if (typeof document > "u")
    return;
  const r = document.createElement("canvas");
  return r.width = e, r.height = t, r;
}
function Ai(e) {
  return typeof e == "string" ? /\.gif(?:[?#].*)?$/iu.test(e) : mr(e) && e.type.toLowerCase() === "image/gif";
}
function Ri(e) {
  return typeof e == "object" && e !== null && "data" in e && "width" in e && "height" in e;
}
function Li(e) {
  return typeof e == "object" && e !== null && "width" in e && "height" in e && "close" in e && !("data" in e);
}
function mr(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function yi(e) {
  return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement;
}
const gr = () => performance.now(), Ii = (e) => typeof globalThis.requestAnimationFrame == "function" ? globalThis.requestAnimationFrame(e) : globalThis.setTimeout(() => e(gr()), 16), Ci = (e) => {
  if (typeof globalThis.cancelAnimationFrame == "function") {
    globalThis.cancelAnimationFrame(e);
    return;
  }
  globalThis.clearTimeout(e);
};
var Oe, X, Ue, _e, Ge, We, H, Xe, ze, Te, y, _, et, pr, _t, tt, he;
class Fi {
  constructor({
    cancelAnimationFrame: t = Ci,
    now: r = gr,
    onActiveChange: i,
    render: o,
    requestAnimationFrame: s = Ii,
    shouldContinue: a = () => !1
  }) {
    d(this, _);
    d(this, Oe);
    d(this, X, !1);
    d(this, Ue, 0);
    d(this, _e);
    d(this, Ge);
    d(this, We);
    d(this, H);
    d(this, Xe);
    d(this, ze);
    d(this, Te);
    d(this, y, "idle");
    h(this, Oe, t), h(this, Ge, r), h(this, We, i), h(this, Xe, o), h(this, ze, s), h(this, Te, a);
  }
  getStatus() {
    return {
      dirty: n(this, X),
      frameCount: n(this, Ue),
      isActive: n(this, y) === "scheduled" || n(this, y) === "rendering",
      state: n(this, y)
    };
  }
  markDirty(t = "manual") {
    n(this, y) !== "disposed" && (h(this, X, !0), u(this, _, et).call(this));
  }
  pause() {
    u(this, _, tt).call(this) || (u(this, _, _t).call(this), u(this, _, he).call(this, "paused"));
  }
  resume() {
    n(this, y) === "paused" && (u(this, _, he).call(this, "idle"), (n(this, X) || n(this, Te).call(this, n(this, Ge).call(this))) && u(this, _, et).call(this));
  }
  dispose() {
    n(this, y) !== "disposed" && (u(this, _, _t).call(this), h(this, X, !1), u(this, _, he).call(this, "disposed"));
  }
}
Oe = new WeakMap(), X = new WeakMap(), Ue = new WeakMap(), _e = new WeakMap(), Ge = new WeakMap(), We = new WeakMap(), H = new WeakMap(), Xe = new WeakMap(), ze = new WeakMap(), Te = new WeakMap(), y = new WeakMap(), _ = new WeakSet(), et = function() {
  n(this, H) !== void 0 || n(this, y) === "disposed" || n(this, y) === "paused" || (h(this, H, n(this, ze).call(this, (t) => {
    u(this, _, pr).call(this, t);
  })), u(this, _, he).call(this, "scheduled"));
}, pr = function(t) {
  if (h(this, H, void 0), u(this, _, tt).call(this))
    return;
  const r = n(this, X), i = n(this, _e) === void 0 ? 0 : Math.max(0, t - n(this, _e));
  h(this, X, !1), u(this, _, he).call(this, "rendering"), n(this, Xe).call(this, {
    deltaTime: i,
    dirty: r,
    time: t
  }), h(this, Ue, n(this, Ue) + 1), h(this, _e, t), !u(this, _, tt).call(this) && (u(this, _, he).call(this, "idle"), (n(this, X) || n(this, Te).call(this, t)) && u(this, _, et).call(this));
}, _t = function() {
  n(this, H) !== void 0 && (n(this, Oe).call(this, n(this, H)), h(this, H, void 0));
}, tt = function() {
  return n(this, y) === "disposed" || n(this, y) === "paused";
}, he = function(t) {
  var o;
  const r = this.getStatus().isActive;
  h(this, y, t);
  const i = this.getStatus().isActive;
  r !== i && ((o = n(this, We)) == null || o.call(this, i));
};
const Mi = {
  dpr: 1,
  height: 1,
  width: 1
};
function Pi(e, t, r = {}) {
  return new Di(e, t, r);
}
var T, Se, me, L, $e, M, we, ne, Ae, Y, q, ge, Re, j, oe, Le, se, C, Ve, O, ye, P, it, Ke, p, br, xr, Tt, St, V, vr, Er, wt, Ce, At, _r, Tr, Sr, He, Ye, wr, Rt;
class Di {
  constructor(t, r, i) {
    d(this, p);
    d(this, T);
    d(this, Se);
    d(this, me);
    d(this, L);
    d(this, $e);
    d(this, M, !1);
    d(this, we, 0);
    d(this, ne, 0);
    d(this, Ae);
    d(this, Y, !1);
    d(this, q, !0);
    d(this, ge, {});
    d(this, Re);
    d(this, j, !1);
    d(this, oe);
    d(this, Le, /* @__PURE__ */ new Set());
    d(this, se, new vi());
    d(this, C);
    d(this, Ve);
    d(this, O);
    d(this, ye);
    d(this, P, Mi);
    d(this, it, /* @__PURE__ */ new WeakMap());
    d(this, Ke, 0);
    d(this, He, (t) => {
      const r = n(this, L).getBoundingClientRect(), i = n(this, se).move(
        t,
        r,
        n(this, P),
        n(this, oe).call(this),
        {
          reducedMotion: n(this, j),
          reveal: u(this, p, Ce).call(this)
        }
      );
      n(this, T).setPointer(i), u(this, p, V).call(this, "pointer");
    });
    d(this, Ye, () => {
      const t = n(this, se).leave(n(this, oe).call(this), {
        reducedMotion: n(this, j),
        reveal: u(this, p, Ce).call(this)
      });
      n(this, T).setPointer(t), u(this, p, V).call(this, "pointer");
    });
    h(this, L, t), h(this, C, r), h(this, Se, i.backendFactory ?? ((o) => o === "webgl2" ? new pi({ onError: (s) => {
      var a, c;
      return (c = (a = n(this, C)).onError) == null ? void 0 : c.call(a, s);
    } }) : new Zr())), h(this, me, Ht(r.quality)), h(this, Ve, i.requestAnimationFrame ?? Gi()), h(this, $e, i.cancelAnimationFrame ?? Wi()), h(this, oe, i.now ?? (() => Ar())), h(this, P, Yt(t, r.quality, i.devicePixelRatio)), h(this, T, u(this, p, Tt).call(this, n(this, me))), h(this, O, new Fi({
      cancelAnimationFrame: n(this, $e),
      now: n(this, oe),
      render: (o) => u(this, p, vr).call(this, o),
      requestAnimationFrame: n(this, Ve),
      shouldContinue: (o) => u(this, p, Er).call(this, o)
    })), u(this, p, _r).call(this), u(this, p, Tr).call(this, i.ResizeObserver), u(this, p, Sr).call(this, i.IntersectionObserver), this.update(r, i);
  }
  update(t, r = {}) {
    if (n(this, M))
      return;
    h(this, C, t), u(this, p, St).call(this, r.devicePixelRatio);
    const i = Ht(t.quality);
    i !== n(this, me) && (h(this, me, i), u(this, p, xr).call(this, i));
    const o = Bi(t, r.matchMedia);
    h(this, j, o);
    const s = ki(t, o), a = u(this, p, wr).call(this, s);
    if (a === n(this, Re)) {
      u(this, p, V).call(this, "manual");
      return;
    }
    h(this, Re, a), u(this, p, br).call(this, s, r);
  }
  pause() {
    h(this, Y, !0), n(this, O).pause();
  }
  resume() {
    h(this, Y, !1), n(this, q) && (n(this, O).resume(), u(this, p, V).call(this, "manual"));
  }
  async exportFrame(t = "image/png") {
    return n(this, T).exportFrame ? n(this, T).exportFrame(t) : Ui(n(this, L), t);
  }
  dispose() {
    var t, r;
    n(this, M) || (h(this, M, !0), h(this, ne, n(this, ne) + 1), n(this, O).dispose(), n(this, L).removeEventListener("pointermove", n(this, He)), n(this, L).removeEventListener("pointerleave", n(this, Ye)), (t = n(this, ye)) == null || t.disconnect(), (r = n(this, Ae)) == null || r.disconnect(), u(this, p, At).call(this), n(this, T).dispose());
  }
  getSnapshot() {
    return {
      active: !n(this, M) && !n(this, Y) && n(this, q),
      backend: n(this, T).name,
      frames: n(this, we),
      layersSignature: n(this, Re),
      size: n(this, P)
    };
  }
}
T = new WeakMap(), Se = new WeakMap(), me = new WeakMap(), L = new WeakMap(), $e = new WeakMap(), M = new WeakMap(), we = new WeakMap(), ne = new WeakMap(), Ae = new WeakMap(), Y = new WeakMap(), q = new WeakMap(), ge = new WeakMap(), Re = new WeakMap(), j = new WeakMap(), oe = new WeakMap(), Le = new WeakMap(), se = new WeakMap(), C = new WeakMap(), Ve = new WeakMap(), O = new WeakMap(), ye = new WeakMap(), P = new WeakMap(), it = new WeakMap(), Ke = new WeakMap(), p = new WeakSet(), br = async function(t, r) {
  var o, s, a, c;
  const i = n(this, ne) + 1;
  h(this, ne, i);
  try {
    const f = {}, l = /* @__PURE__ */ new Set();
    for (const m of ["background", "foreground"]) {
      const b = t[m];
      if (!b)
        continue;
      const x = await _i(b.src, {
        createImageBitmap: r.createImageBitmap,
        loadImage: r.loadImage,
        warn: r.warn
      });
      x.kind === "blob" && l.add(x), f[m] = Ei(m, b, x);
    }
    if (n(this, M) || i !== n(this, ne)) {
      qt(l);
      return;
    }
    u(this, p, At).call(this), h(this, Le, l), h(this, ge, f), n(this, T).setLayers(f), u(this, p, V).call(this, "source"), (s = (o = n(this, C)).onReady) == null || s.call(o);
  } catch (f) {
    !n(this, M) && i === n(this, ne) && ((c = (a = n(this, C)).onError) == null || c.call(a, jt(f)));
  }
}, xr = function(t) {
  n(this, T).dispose(), h(this, T, u(this, p, Tt).call(this, t)), n(this, T).setLayers(n(this, ge)), n(this, T).setPointer(n(this, se).getSnapshot()), u(this, p, V).call(this, "quality");
}, Tt = function(t) {
  var i, o;
  const r = n(this, Se).call(this, t);
  try {
    return r.init(n(this, L), n(this, P)), r;
  } catch (s) {
    (o = (i = n(this, C)).onError) == null || o.call(i, jt(s));
    throw s;
  }
}, St = function(t) {
  const r = Yt(n(this, L), n(this, C).quality, t);
  r.width === n(this, P).width && r.height === n(this, P).height && r.dpr === n(this, P).dpr || (h(this, P, r), n(this, T).resize(r), u(this, p, V).call(this, "resize"));
}, V = function(t) {
  n(this, M) || n(this, O).markDirty(t);
}, vr = function(t) {
  var r, i;
  n(this, M) || n(this, Y) || !n(this, q) || (n(this, T).setPointer(u(this, p, wt).call(this, t.time)), n(this, T).render({
    ...t,
    revealLayer: n(this, C).revealLayer ?? "background"
  }), h(this, we, n(this, we) + 1), (i = (r = n(this, C)).onStats) == null || i.call(r, {
    active: n(this, O).getStatus().isActive,
    backend: n(this, T).name,
    frames: n(this, we)
  }));
}, Er = function(t) {
  if (n(this, M) || n(this, Y) || !n(this, q))
    return !1;
  const r = u(this, p, Ce).call(this), i = u(this, p, wt).call(this, t), o = r ? { ...Ie, ...r } : void 0;
  return !n(this, j) && i.active && o && o.edgeDither > 0 && o.edgeFlicker > 0 ? !0 : n(this, se).isFadeActive({
    now: t,
    reducedMotion: n(this, j),
    reveal: r
  });
}, wt = function(t = n(this, oe).call(this)) {
  return n(this, se).getSnapshot({
    now: t,
    reducedMotion: n(this, j),
    reveal: u(this, p, Ce).call(this)
  });
}, Ce = function() {
  var t, r;
  return n(this, C).revealLayer === "foreground" ? (t = n(this, ge).background) == null ? void 0 : t.reveal : (r = n(this, ge).foreground) == null ? void 0 : r.reveal;
}, At = function() {
  qt(n(this, Le)), h(this, Le, /* @__PURE__ */ new Set());
}, _r = function() {
  n(this, L).addEventListener("pointermove", n(this, He)), n(this, L).addEventListener("pointerleave", n(this, Ye));
}, Tr = function(t) {
  const r = t ?? Xi();
  r && (h(this, ye, new r(() => {
    u(this, p, St).call(this);
  })), n(this, ye).observe(n(this, L)));
}, Sr = function(t) {
  const r = t ?? zi();
  r && (h(this, Ae, new r((i) => {
    const [o] = i;
    h(this, q, (o == null ? void 0 : o.isIntersecting) ?? !0), n(this, q) ? n(this, Y) || (n(this, O).resume(), u(this, p, V).call(this, "manual")) : n(this, O).pause();
  })), n(this, Ae).observe(n(this, L)));
}, He = new WeakMap(), Ye = new WeakMap(), wr = function(t) {
  return JSON.stringify({
    background: t.background ? u(this, p, Rt).call(this, t.background) : null,
    foreground: t.foreground ? u(this, p, Rt).call(this, t.foreground) : null
  });
}, Rt = function(t) {
  return {
    ...t,
    src: Oi(t.src, n(this, it), () => (h(this, Ke, n(this, Ke) + 1), n(this, Ke)))
  };
};
function ki(e, t) {
  var s, a;
  let r = ((s = e.layers) == null ? void 0 : s.background) ?? (e.background ? Vt(e.background, e.preset) : void 0), i = ((a = e.layers) == null ? void 0 : a.foreground) ?? (e.foreground ? Vt(e.foreground, e.preset) : void 0);
  const o = e.revealLayer ?? "background";
  return t ? (r = r ? { ...r, reveal: !1 } : void 0, i = i ? { ...i, reveal: !1 } : void 0) : o === "background" ? i = Kt(i, r == null ? void 0 : r.reveal) : r = Kt(r, i == null ? void 0 : i.reveal), {
    background: r,
    foreground: i
  };
}
function Vt(e, t) {
  return t === "browserbase" ? {
    dither: { amount: 0.85, matrixSize: 8, palette: "browserbase" },
    fit: "cover",
    src: e
  } : { src: e };
}
function Kt(e, t) {
  return !e || e.reveal !== void 0 ? e : {
    ...e,
    reveal: t ?? Ie
  };
}
function Bi(e, t) {
  if (e.motion === "full")
    return !1;
  if (e.motion === "reduced")
    return !0;
  const r = t ?? $i();
  return (r == null ? void 0 : r("(prefers-reduced-motion: reduce)").matches) ?? !1;
}
function Ht(e) {
  return typeof e == "object" && e.backend === "canvas2d" ? "canvas2d" : "webgl2";
}
function Yt(e, t, r) {
  const i = e.getBoundingClientRect(), o = Ni(t) * (r ?? Vi()), s = Math.max(1, Math.round((i.width || e.width || 1) * o)), a = Math.max(1, Math.round((i.height || e.height || 1) * o));
  return {
    dpr: o,
    height: a,
    width: s
  };
}
function Ni(e) {
  return typeof e == "object" && e.resolutionScale ? Math.max(0.1, e.resolutionScale) : e === "low" ? 0.5 : e === "medium" ? 0.75 : 1;
}
function Oi(e, t, r) {
  return typeof e == "string" ? `url:${e}` : (t.has(e) || t.set(e, r()), `object:${t.get(e)}`);
}
function qt(e) {
  var t;
  for (const r of e)
    (t = r.bitmap) == null || t.close();
  e.clear();
}
function Ui(e, t) {
  return new Promise((r, i) => {
    e.toBlob((o) => {
      o ? r(o) : i(
        new S({
          code: "CANVAS_UNAVAILABLE",
          fix: "Make sure the canvas is mounted and readable before exporting.",
          problem: "Canvas frame export failed."
        })
      );
    }, t);
  });
}
function Gi() {
  return typeof globalThis.requestAnimationFrame == "function" ? globalThis.requestAnimationFrame.bind(globalThis) : (e) => globalThis.setTimeout(() => e(Ar()), 16);
}
function Wi() {
  return typeof globalThis.cancelAnimationFrame == "function" ? globalThis.cancelAnimationFrame.bind(globalThis) : (e) => globalThis.clearTimeout(e);
}
function Xi() {
  return typeof globalThis.ResizeObserver == "function" ? globalThis.ResizeObserver : void 0;
}
function zi() {
  return typeof globalThis.IntersectionObserver == "function" ? globalThis.IntersectionObserver : void 0;
}
function $i() {
  return typeof globalThis.matchMedia == "function" ? globalThis.matchMedia.bind(globalThis) : void 0;
}
function Vi() {
  return typeof globalThis.devicePixelRatio == "number" ? globalThis.devicePixelRatio : 1;
}
function Ar() {
  var e;
  return typeof ((e = globalThis.performance) == null ? void 0 : e.now) == "function" ? globalThis.performance.now() : Date.now();
}
function jt(e) {
  return e instanceof Error ? e : new Error(String(e));
}
let Ki = ({ canvas: e, props: t }) => Pi(e, t);
function Hi(e, t) {
  const r = ot(null), i = ot(null), o = ot(t ?? {});
  return o.current = t ?? {}, Ct(() => {
    const s = r.current;
    if (!s)
      return;
    try {
      const a = Ki({
        canvas: s,
        props: o.current
      });
      return i.current = a, () => {
        i.current = null, a.dispose();
      };
    } catch (a) {
      var c;
      return (c = o.current.onError) == null || c.call(o.current, jt(a)), void 0;
    }
  }, []), Ct(() => {
    var s;
    (s = i.current) == null || s.update(o.current);
  }), Cr(
    e,
    () => ({
      pause: () => {
        var s;
        (s = i.current) == null || s.pause();
      },
      resume: () => {
        var s;
        (s = i.current) == null || s.resume();
      },
      exportFrame: async (s = "image/png") => {
        if (i.current)
          return i.current.exportFrame(s);
        const a = r.current;
        return a ? new Promise((c, f) => {
          a.toBlob((l) => {
            l ? c(l) : f(new Error("Canvas frame export failed."));
          }, s);
        }) : new Blob([], { type: s });
      }
    }),
    []
  ), { canvasRef: r };
}
const Qi = Fr(function({
  className: t,
  style: r,
  fallback: i = "Dithered particle canvas",
  width: o = 960,
  height: s = 540,
  "aria-label": a,
  ...c
}, f) {
  const { canvasRef: l } = Hi(f, {
    ...c,
    height: s,
    width: o
  });
  return /* @__PURE__ */ Ir("div", { className: t, "data-dpc-root": "", style: r, children: [
    /* @__PURE__ */ It(
      "canvas",
      {
        ref: l,
        "aria-label": a,
        "data-dpc-canvas": "",
        height: s,
        role: a ? "img" : void 0,
        width: o
      }
    ),
    /* @__PURE__ */ It("span", { hidden: !0, children: i })
  ] });
});
export {
  Qi as DitheredParticleCanvas,
  Hi as useDitheredCanvas
};
//# sourceMappingURL=index.js.map
