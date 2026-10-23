import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const DEMO_FPS = 30;
export const DEMO_DURATION = 210;
export const DEMO_WIDTH = 1200;
export const DEMO_HEIGHT = 675;

const CLICK_FRAME = 24;
const LINK_SENT_FRAME = 56;
const PHONE_MSG_FRAME = 52;
const PHONE_TAP_FRAME = 70;
const ID_SCREEN_FRAME = 78;
const ID_DONE_FRAME = 112;
const SELFIE_SCREEN_FRAME = 118;
const SELFIE_DONE_FRAME = 152;
const PHONE_DONE_FRAME = 160;
export const VERIFIED_FRAME = 166;
const NAME_MATCH_FRAME = 172;
const AUDIT_FRAME = 180;
const TIMER_END_FRAME = 194;

const INK = "#1e293b";
const SLATE = "#64748b";
const LINE = "#e2e8f0";
const GREEN = "#15803d";
const GREEN_BG = "#dcfce7";
const AMBER = "#b45309";
const AMBER_BG = "#fef3c7";

const font = "Inter, ui-sans-serif, system-ui, sans-serif";
const easeOut = Easing.out(Easing.cubic);

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function Check({ size = 18, color = GREEN }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Pill({ tone, label, pop }: { tone: "idle" | "waiting" | "verified"; label: string; pop: number }) {
  const bg = tone === "verified" ? GREEN_BG : tone === "waiting" ? AMBER_BG : "#f1f5f9";
  const fg = tone === "verified" ? GREEN : tone === "waiting" ? AMBER : SLATE;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: bg,
        color: fg,
        borderRadius: 999,
        padding: "6px 14px",
        fontSize: 16,
        fontWeight: 600,
        whiteSpace: "nowrap",
        flexShrink: 0,
        transform: `scale(${1 + 0.12 * pop})`,
      }}
    >
      {tone === "verified" ? <Check size={16} /> : <span style={{ width: 8, height: 8, borderRadius: 999, background: fg }} />}
      {label}
    </div>
  );
}

function Timer() {
  const frame = useCurrentFrame();
  const secs = Math.round(
    interpolate(frame, [CLICK_FRAME, TIMER_END_FRAME], [0, 58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const running = frame >= CLICK_FRAME && frame < TIMER_END_FRAME;
  const done = frame >= TIMER_END_FRAME;
  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        color: done ? GREEN : INK,
        fontSize: 34,
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.02em",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: done ? GREEN : running ? "#dc2626" : LINE,
          opacity: running ? (Math.floor(frame / 15) % 2 === 0 ? 1 : 0.35) : 1,
        }}
      />
      0:{String(secs).padStart(2, "0")}
    </div>
  );
}

function Cursor() {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [6, CLICK_FRAME], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const x = interpolate(t, [0, 1], [720, 522]);
  const y = interpolate(t, [0, 1], [470, 344]);
  const fade = interpolate(frame, [CLICK_FRAME + 6, CLICK_FRAME + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const press = frame >= CLICK_FRAME && frame < CLICK_FRAME + 5 ? 0.85 : 1;
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      style={{ position: "absolute", left: x, top: y, opacity: fade, transform: `scale(${press})`, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
    >
      <path d="M5 3l14 8-6.5 1.5L9 19z" fill="#fff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

function AgentPanel() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const linkChars = Math.floor(
    interpolate(frame, [CLICK_FRAME + 4, LINK_SENT_FRAME], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const link = "rv.link/c/K7M2QX".slice(0, linkChars);
  const status: "idle" | "waiting" | "verified" = frame >= VERIFIED_FRAME ? "verified" : frame >= CLICK_FRAME + 4 ? "waiting" : "idle";
  const statusLabel = status === "verified" ? "Verified" : status === "waiting" ? "Waiting for caller" : "Not verified";
  const pop = status === "verified" ? spring({ frame: frame - VERIFIED_FRAME, fps, config: { damping: 9, stiffness: 160 } }) * (1 - clamp01((frame - VERIFIED_FRAME - 10) / 8)) : 0;

  const pressed = frame >= CLICK_FRAME && frame < CLICK_FRAME + 5;
  const nameIn = spring({ frame: frame - NAME_MATCH_FRAME, fps, config: { damping: 14 } });
  const auditIn = spring({ frame: frame - AUDIT_FRAME, fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 100,
        width: 640,
        height: 520,
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        boxShadow: "0 20px 50px -24px rgba(30,41,59,0.25)",
        padding: 28,
        boxSizing: "border-box",
        color: INK,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, color: SLATE, fontWeight: 600, letterSpacing: "0.04em" }}>HELP DESK · TICKET #4821</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6, letterSpacing: "-0.01em" }}>MFA reset request</div>
          <div style={{ fontSize: 17, color: SLATE, marginTop: 4 }}>Caller: Jordan Alvarez · contractor, started Tuesday</div>
        </div>
        <Pill tone={status} label={statusLabel} pop={pop} />
      </div>

      <div style={{ height: 1, background: LINE, margin: "22px 0" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            background: INK,
            color: "#fff",
            borderRadius: 10,
            padding: "12px 18px",
            fontSize: 17,
            fontWeight: 600,
            transform: `scale(${pressed ? 0.96 : 1})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Send ID check link
        </div>
        <div style={{ fontSize: 16, color: SLATE }}>$4.00 per check</div>
      </div>

      <div
        style={{
          marginTop: 22,
          background: "#f8fafc",
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          padding: "14px 16px",
          fontSize: 16,
          minHeight: 72,
          opacity: frame >= CLICK_FRAME + 4 ? 1 : 0.5,
        }}
      >
        <div style={{ color: SLATE, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Reply to caller</div>
        <div style={{ fontVariantNumeric: "tabular-nums" }}>
          {frame >= CLICK_FRAME + 4 ? (
            <>
              Open this on your phone: <span style={{ fontWeight: 600, color: "#1d4ed8" }}>{link}</span>
              {frame < LINK_SENT_FRAME ? <span style={{ borderRight: `2px solid ${INK}`, marginLeft: 1 }} /> : null}
            </>
          ) : (
            <span style={{ color: SLATE }}>No verification sent yet</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 10}px)`, fontSize: 17 }}>
        <Check size={20} />
        <span>
          ID name <span style={{ fontWeight: 600 }}>Jordan Alvarez</span> matches ticket · live selfie matched ID photo
        </span>
      </div>

      <div style={{ marginTop: 18, opacity: auditIn, transform: `translateY(${(1 - auditIn) * 12}px)` }}>
        <div style={{ fontSize: 14, color: SLATE, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 8 }}>AUDIT LOG</div>
        <div
          style={{
            fontSize: 15,
            background: GREEN_BG,
            border: `1px solid #bbf7d0`,
            borderRadius: 10,
            padding: "10px 14px",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>2026-10-23 09:41:58 · Ticket #4821</span>
            <span style={{ color: SLATE }}>Verified by T. Okafor</span>
          </div>
          <div>Jordan Alvarez · government ID + live selfie · PASS</div>
        </div>
      </div>
    </div>
  );
}

function PhoneScreen() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const msgIn = spring({ frame: frame - PHONE_MSG_FRAME, fps, config: { damping: 13 } });
  const tapRing = frame >= PHONE_TAP_FRAME && frame < ID_SCREEN_FRAME ? interpolate(frame, [PHONE_TAP_FRAME, ID_SCREEN_FRAME], [0, 1]) : -1;

  const screen: "chat" | "id" | "selfie" | "done" =
    frame >= PHONE_DONE_FRAME ? "done" : frame >= SELFIE_SCREEN_FRAME ? "selfie" : frame >= ID_SCREEN_FRAME ? "id" : "chat";

  const cardIn = spring({ frame: frame - ID_SCREEN_FRAME - 2, fps, config: { damping: 14 } });
  const scanT = interpolate(frame, [ID_SCREEN_FRAME + 8, ID_DONE_FRAME - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const idDone = frame >= ID_DONE_FRAME;

  const selfieT = interpolate(frame, [SELFIE_SCREEN_FRAME + 6, SELFIE_DONE_FRAME - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const selfieDone = frame >= SELFIE_DONE_FRAME;
  const doneIn = spring({ frame: frame - PHONE_DONE_FRAME, fps, config: { damping: 10, stiffness: 140 } });

  const header = (title: string, step?: string) => (
    <div style={{ padding: "48px 20px 0" }}>
      {step ? <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, letterSpacing: "0.06em" }}>{step}</div> : null}
      <div style={{ fontSize: 20, fontWeight: 600, marginTop: step ? 4 : 0, letterSpacing: "-0.01em" }}>{title}</div>
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", color: INK, overflow: "hidden" }}>
      {screen === "chat" ? (
        <>
          {header("Help Desk")}
          <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ alignSelf: "flex-end", background: "#1d4ed8", color: "#fff", borderRadius: 14, padding: "10px 12px", fontSize: 14, maxWidth: 200 }}>
              Locked out, new phone. Need my MFA reset please.
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                background: "#f1f5f9",
                borderRadius: 14,
                padding: "10px 12px",
                fontSize: 14,
                maxWidth: 220,
                opacity: msgIn,
                transform: `translateY(${(1 - msgIn) * 16}px)`,
                position: "relative",
              }}
            >
              Open this on your phone:{" "}
              <span style={{ color: "#1d4ed8", fontWeight: 600, textDecoration: "underline" }}>rv.link/c/K7M2QX</span>
              {tapRing >= 0 ? (
                <span
                  style={{
                    position: "absolute",
                    left: 110,
                    top: 26,
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    border: `2px solid ${INK}`,
                    transform: `translate(-50%,-50%) scale(${0.6 + tapRing * 1.2})`,
                    opacity: 1 - tapRing,
                  }}
                />
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      {screen === "id" ? (
        <>
          {header("Scan your government ID", "STEP 1 OF 2")}
          <div style={{ padding: "22px 20px 0", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                position: "relative",
                width: 220,
                height: 140,
                borderRadius: 12,
                background: "linear-gradient(135deg,#e2e8f0,#f8fafc)",
                border: `1px solid #cbd5e1`,
                transform: `translateY(${(1 - cardIn) * 40}px) scale(${0.9 + cardIn * 0.1})`,
                opacity: cardIn,
                overflow: "hidden",
                boxShadow: "0 10px 30px -14px rgba(30,41,59,0.4)",
              }}
            >
              <div style={{ position: "absolute", left: 14, top: 14, width: 54, height: 66, borderRadius: 6, background: "#cbd5e1" }} />
              <div style={{ position: "absolute", left: 80, top: 18, width: 110, height: 9, borderRadius: 4, background: "#94a3b8" }} />
              <div style={{ position: "absolute", left: 80, top: 36, width: 80, height: 9, borderRadius: 4, background: "#cbd5e1" }} />
              <div style={{ position: "absolute", left: 80, top: 54, width: 96, height: 9, borderRadius: 4, background: "#cbd5e1" }} />
              <div style={{ position: "absolute", left: 14, top: 98, width: 190, height: 9, borderRadius: 4, background: "#cbd5e1" }} />
              {!idDone ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: scanT * 136,
                    height: 3,
                    background: "#1d4ed8",
                    boxShadow: "0 0 14px 3px rgba(29,78,216,0.45)",
                  }}
                />
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "rgba(220,252,231,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={44} />
                </div>
              )}
            </div>
          </div>
          <div style={{ padding: "18px 20px 0", fontSize: 14, color: SLATE, textAlign: "center" }}>
            {idDone ? "Document read. Checking security features." : "Hold your license or passport inside the frame."}
          </div>
        </>
      ) : null}

      {screen === "selfie" ? (
        <>
          {header("Take a live selfie", "STEP 2 OF 2")}
          <div style={{ padding: "22px 20px 0", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 170, height: 210 }}>
              <svg width={170} height={210} viewBox="0 0 170 210" style={{ position: "absolute", inset: 0 }}>
                <ellipse cx={85} cy={105} rx={74} ry={98} fill="#f1f5f9" />
                <ellipse cx={85} cy={92} rx={34} ry={40} fill="#cbd5e1" />
                <path d="M30 200 C 40 150, 130 150, 140 200 Z" fill="#cbd5e1" />
                <ellipse
                  cx={85}
                  cy={105}
                  rx={78}
                  ry={102}
                  fill="none"
                  stroke={selfieDone ? GREEN : "#1d4ed8"}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={566}
                  strokeDashoffset={566 * (1 - selfieT)}
                  transform="rotate(-90 85 105)"
                />
              </svg>
              {selfieDone ? (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(220,252,231,0.7)", borderRadius: 999 }}>
                  <Check size={48} />
                </div>
              ) : null}
            </div>
          </div>
          <div style={{ padding: "14px 20px 0", fontSize: 14, color: SLATE, textAlign: "center" }}>
            {selfieDone ? "Live face matched the ID photo." : "Look at the camera and turn your head slowly."}
          </div>
        </>
      ) : null}

      {screen === "done" ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px 24px", textAlign: "center", opacity: doneIn }}>
          <div style={{ width: 84, height: 84, borderRadius: 999, background: GREEN_BG, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${doneIn})` }}>
            <Check size={44} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, marginTop: 18, letterSpacing: "-0.01em" }}>You are verified</div>
          <div style={{ fontSize: 14, color: SLATE, marginTop: 8, lineHeight: 1.5 }}>Your help desk agent has the result. You can close this page.</div>
        </div>
      ) : null}
    </div>
  );
}

function Phone() {
  return (
    <div
      style={{
        position: "absolute",
        left: 790,
        top: 100,
        width: 300,
        height: 520,
        borderRadius: 40,
        background: INK,
        padding: 12,
        boxSizing: "border-box",
        boxShadow: "0 30px 60px -28px rgba(30,41,59,0.5)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 30, overflow: "hidden", background: "#fff" }}>
        <PhoneScreen />
        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 90, height: 26, borderRadius: 999, background: INK }} />
      </div>
    </div>
  );
}

function Labels() {
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 636, fontSize: 15, color: SLATE, fontWeight: 600, letterSpacing: "0.04em" }}>YOU · HELP DESK</div>
      <div style={{ position: "absolute", left: 790, width: 300, textAlign: "center", top: 636, fontSize: 15, color: SLATE, fontWeight: 600, letterSpacing: "0.04em" }}>CALLER · ANY PHONE</div>
    </>
  );
}

export function Demo() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#f8fafc", fontFamily: font, opacity: Math.min(fadeIn, fadeOut) }}>
      <Timer />
      <AgentPanel />
      <Phone />
      <Labels />
      <Cursor />
    </AbsoluteFill>
  );
}
