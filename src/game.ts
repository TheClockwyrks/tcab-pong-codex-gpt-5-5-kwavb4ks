import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_HH,
  OBSTACLE_HW,
  OBSTACLE_SPIN_RATE,
  OBSTACLE_SWAY_AMP,
  OBSTACLE_SWAY_PERIOD,
  OBSTACLE_W,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_HALF,
  PADDLE_H,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
  readonly theta: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;

  readonly simTime: number;
  readonly muted: boolean;
}

interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

interface BallSnapshot extends BallState {
  readonly speed: number;
}

export interface CaromSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: BallSnapshot | null;
  readonly obstacles: readonly ObstacleState[];
  readonly obstacleClock: number;
  readonly obstacleClockRunning: boolean;
  readonly simTime: number;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  setObstacleClock(state: DeepReadonly<CaromState>, t: number): CaromState;
  setObstacleClockRunning(
    state: DeepReadonly<CaromState>,
    running: boolean,
  ): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): Rect | null;
}

export const BACKGROUND = "#090c13";

const COLORS = {
  field: BACKGROUND,
  grid: "#172033",
  net: "#5d718f",
  p1: "#2ee6a6",
  p2: "#ff5a7a",
  ball: "#fff7c7",
  obstacle: "#55a7ff",
  text: "#edf7ff",
  dim: "rgba(237, 247, 255, 0.6)",
  panel: "rgba(9, 12, 19, 0.72)",
  highlight: "#ffd166",
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function serveSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function obstaclePose(index: number, clock: number): ObstacleState {
  const base = OBSTACLE_CENTERS[index];
  if (!base) throw new Error(`Carom: no obstacle ${index}`);
  const phase = Math.sin((2 * Math.PI * clock) / OBSTACLE_SWAY_PERIOD);
  return {
    index,
    cx: base.x,
    cy: base.y + (index === 0 ? 1 : -1) * OBSTACLE_SWAY_AMP * phase,
    theta: OBSTACLE_SPIN_RATE * clock,
  };
}

function posesForClock(
  clock: number,
  current: readonly DeepReadonly<ObstacleState>[] = [
    obstaclePose(0, clock),
    obstaclePose(1, clock),
  ],
): ObstacleState[] {
  return current.map((obstacle) => obstaclePose(obstacle.index, clock));
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: serveSign(),
    trail: [],
  };
}

function initialPaddle(): PaddleState {
  return { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 };
}

function titleState(muted: boolean, simTime = 0, titleIndex = 0): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: titleIndex,
    titleIndex,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: { left: initialPaddle(), right: initialPaddle() },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: [obstaclePose(0, 0), obstaclePose(1, 0)],
    obstacleClock: 0,
    obstacleClockRunning: true,
    simTime,
    muted,
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...state,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
    receiver: "left",
    ball: parkedBall(),
    obstacles: [obstaclePose(0, 0), obstaclePose(1, 0)],
    obstacleClock: 0,
    obstacleClockRunning: true,
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return titleState(state.muted, state.simTime, state.titleIndex);
}

function menuLength(screen: Screen): number {
  if (screen === "title") return TITLE_ITEMS.length;
  if (screen === "howto") return 1;
  if (screen === "paused") return PAUSE_ITEMS.length;
  if (screen === "matchover") return MATCHOVER_ITEMS.length;
  return 0;
}

function menuRect(screen: Screen, index: number): Rect | null {
  const count = menuLength(screen);
  if (index < 0 || index >= count) return null;
  const w = screen === "howto" ? 300 : 360;
  const h = 56;
  const gap = 16;
  const startY = screen === "title" ? 350 : screen === "howto" ? 575 : 370;
  return {
    x: FIELD_CX - w / 2,
    y: startY + index * (h + gap),
    w,
    h,
  };
}

function pointInRect(x: number, y: number, rect: Rect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function menuItemAt(screen: Screen, x: number, y: number): number | null {
  for (let i = 0; i < menuLength(screen); i += 1) {
    const rect = menuRect(screen, i);
    if (rect && pointInRect(x, y, rect)) return i;
  }
  return null;
}

function moveMenu(index: number, count: number, dir: -1 | 1): number {
  return (index + dir + count) % count;
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  requestedVy: number,
  dt: number,
): PaddleState {
  const nextCy = clamp(
    paddle.cy + requestedVy * dt,
    PADDLE_MIN_CY,
    PADDLE_MAX_CY,
  );
  const vy = dt > 0 ? (nextCy - paddle.cy) / dt : 0;
  return { ...paddle, cy: nextCy, vy };
}

function humanVy(up: number, down: number): number {
  return (down - up) * PADDLE_SPEED;
}

function updatePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): { readonly left: PaddleState; readonly right: PaddleState } {
  const p1Up = api.input.value("p1-up");
  const p1Down = api.input.value("p1-down");
  const p2Up = api.input.value("p2-up");
  const p2Down = api.input.value("p2-down");

  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : state.mode === "solo"
      ? humanVy(Math.max(p1Up, p2Up), Math.max(p1Down, p2Down))
      : humanVy(p1Up, p1Down);

  let rightVy = 0;
  if (state.paddles.right.driven) {
    rightVy = state.paddles.right.drivenVy;
  } else if (state.mode === "versus") {
    rightVy = humanVy(p2Up, p2Down);
  } else if (state.ai.movement) {
    const ball = state.ball;
    let target = AI_HOME_Y;
    let deadzone = AI_HOME_DEADZONE;
    if (
      state.ai.tracking &&
      state.screen === "playing" &&
      ball !== null &&
      ball.vx > 0
    ) {
      target = ball.y - ball.vy * AI_REACT;
      deadzone = AI_DEADZONE;
    }
    const diff = target - state.paddles.right.cy;
    rightVy =
      Math.abs(diff) <= deadzone
        ? 0
        : Math.sign(diff) *
          Math.min(AI_SPEED, Math.abs(diff) / Math.max(dt, 1e-9));
  }

  return {
    left: integratePaddle(state.paddles.left, leftVy, dt),
    right: integratePaddle(state.paddles.right, rightVy, dt),
  };
}

function speedOf(ball: DeepReadonly<BallState>): number {
  return Math.hypot(ball.vx, ball.vy);
}

function addTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

interface PhysicsEvents {
  wall: boolean;
  paddle: boolean;
  obstacle: boolean;
}

function collideWalls(ball: BallState, events: PhysicsEvents): BallState {
  if (ball.y - BALL_R < 0 && ball.vy < 0) {
    events.wall = true;
    return { ...ball, y: BALL_R, vy: -ball.vy };
  }
  if (ball.y + BALL_R > FIELD_H && ball.vy > 0) {
    events.wall = true;
    return { ...ball, y: FIELD_H - BALL_R, vy: -ball.vy };
  }
  return ball;
}

type Face = "left" | "right" | "top" | "bottom";

function rectHitFace(
  x: number,
  y: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
): Face | null {
  if (
    x <= x0 - BALL_R ||
    x >= x1 + BALL_R ||
    y <= y0 - BALL_R ||
    y >= y1 + BALL_R
  ) {
    return null;
  }
  const depths = [
    { face: "left" as const, value: x - (x0 - BALL_R) },
    { face: "right" as const, value: x1 + BALL_R - x },
    { face: "top" as const, value: y - (y0 - BALL_R) },
    { face: "bottom" as const, value: y1 + BALL_R - y },
  ];
  return depths.reduce((best, next) => (next.value < best.value ? next : best))
    .face;
}

function paddleBounce(
  ball: BallState,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): BallState {
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(speedOf(ball) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function collidePaddle(
  ball: BallState,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
  events: PhysicsEvents,
): BallState {
  const x0 = side === "left" ? P1_X0 : P2_X0;
  const x1 = side === "left" ? P1_X1 : P2_X1;
  const y0 = paddle.cy - PADDLE_HALF;
  const y1 = paddle.cy + PADDLE_HALF;
  const face = rectHitFace(ball.x, ball.y, x0, x1, y0, y1);
  if (face === null) return ball;
  if (face === "left" || face === "right") {
    events.paddle = true;
    return paddleBounce(ball, side, paddle);
  }
  events.wall = true;
  if (face === "top") {
    return {
      ...ball,
      y: y0 - BALL_R,
      vy: ball.vy > 0 ? -ball.vy : ball.vy,
    };
  }
  return {
    ...ball,
    y: y1 + BALL_R,
    vy: ball.vy < 0 ? -ball.vy : ball.vy,
  };
}

function collideObstacle(
  ball: BallState,
  obstacle: DeepReadonly<ObstacleState>,
  events: PhysicsEvents,
): BallState {
  const cos = Math.cos(obstacle.theta);
  const sin = Math.sin(obstacle.theta);
  const dx = ball.x - obstacle.cx;
  const dy = ball.y - obstacle.cy;
  const lx = dx * cos + dy * sin;
  const ly = -dx * sin + dy * cos;
  const qx = clamp(lx, -OBSTACLE_HW, OBSTACLE_HW);
  const qy = clamp(ly, -OBSTACLE_HH, OBSTACLE_HH);
  const ox = lx - qx;
  const oy = ly - qy;
  const dist = Math.hypot(ox, oy);
  const inside =
    lx >= -OBSTACLE_HW &&
    lx <= OBSTACLE_HW &&
    ly >= -OBSTACLE_HH &&
    ly <= OBSTACLE_HH;
  if (!inside && dist >= BALL_R) return ball;

  let nlx = 0;
  let nly = 0;
  let push: number;
  if (inside) {
    const left = lx + OBSTACLE_HW;
    const right = OBSTACLE_HW - lx;
    const top = ly + OBSTACLE_HH;
    const bottom = OBSTACLE_HH - ly;
    const min = Math.min(left, right, top, bottom);
    if (min === left) {
      nlx = -1;
      push = left + BALL_R;
    } else if (min === right) {
      nlx = 1;
      push = right + BALL_R;
    } else if (min === top) {
      nly = -1;
      push = top + BALL_R;
    } else {
      nly = 1;
      push = bottom + BALL_R;
    }
  } else {
    nlx = dist > 0 ? ox / dist : 1;
    nly = dist > 0 ? oy / dist : 0;
    push = BALL_R - dist;
  }

  const nx = nlx * cos - nly * sin;
  const ny = nlx * sin + nly * cos;
  const dot = ball.vx * nx + ball.vy * ny;
  const reflected =
    dot < 0
      ? { vx: ball.vx - 2 * dot * nx, vy: ball.vy - 2 * dot * ny }
      : { vx: ball.vx, vy: ball.vy };
  if (dot < 0) events.obstacle = true;
  return {
    ...ball,
    x: ball.x + nx * push,
    y: ball.y + ny * push,
    vx: reflected.vx,
    vy: reflected.vy,
  };
}

function advanceBall(
  inputBall: DeepReadonly<BallState>,
  paddles: { readonly left: PaddleState; readonly right: PaddleState },
  obstacles: readonly DeepReadonly<ObstacleState>[],
  dt: number,
  events: PhysicsEvents,
): BallState {
  let ball: BallState = { ...inputBall, trail: [...inputBall.trail] };
  const initialSpeed = speedOf(ball);
  const steps = Math.max(1, Math.ceil((initialSpeed * dt) / MAX_SUBSTEP));
  const h = dt / steps;
  for (let i = 0; i < steps; i += 1) {
    const speed = speedOf(ball);
    if (speed > 0) {
      const angle = (ball.spin / speed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ball = {
        ...ball,
        vx: ball.vx * cos - ball.vy * sin,
        vy: ball.vx * sin + ball.vy * cos,
      };
    }
    ball = {
      ...ball,
      spin: ball.spin * 0.5 ** (h / SPIN_HALFLIFE),
      x: ball.x + ball.vx * h,
      y: ball.y + ball.vy * h,
    };
    ball = collideWalls(ball, events);
    ball = collidePaddle(ball, "left", paddles.left, events);
    ball = collidePaddle(ball, "right", paddles.right, events);
    for (const obstacle of obstacles) {
      ball = collideObstacle(ball, obstacle, events);
    }
  }
  return ball;
}

function serveBall(ball: DeepReadonly<BallState>, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function scoreWinner(score: {
  readonly p1: number;
  readonly p2: number;
}): Side | null {
  if (score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD) return "left";
  if (score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD) return "right";
  return null;
}

function maybeScore(state: CaromState, events: PhysicsEvents): CaromState {
  const ball = state.ball;
  if (!ball) return state;
  const scorer =
    ball.x - BALL_R > FIELD_W ? "left" : ball.x + BALL_R < 0 ? "right" : null;
  if (scorer === null) return state;
  events.wall = false;
  const score =
    scorer === "left"
      ? { p1: state.score.p1 + 1, p2: state.score.p2 }
      : { p1: state.score.p1, p2: state.score.p2 + 1 };
  const winner = scoreWinner(score);
  if (winner) {
    return { ...state, score, winner, screen: "matchover", menuIndex: 0 };
  }
  return {
    ...state,
    score,
    receiver: scorer === "left" ? "right" : "left",
    ball: parkedBall(),
    screen: "countdown",
  };
}

function playEvents(api: UpdateApi, events: PhysicsEvents): void {
  if (events.paddle) api.audio.play(CUES.paddleHit);
  if (events.wall) api.audio.play(CUES.wallBounce);
  if (events.obstacle) api.audio.play(CUES.obstacleBounce);
}

function confirmTitle(
  state: DeepReadonly<CaromState>,
  index: number,
): CaromState {
  const base = { ...state, titleIndex: index };
  if (index === 0) return startMatch(base, "solo");
  if (index === 1) return startMatch(base, "versus");
  return { ...base, screen: "howto", menuIndex: 0 };
}

function confirmMenu(state: DeepReadonly<CaromState>): CaromState {
  if (state.screen === "title") return confirmTitle(state, state.menuIndex);
  if (state.screen === "howto") return returnToTitle(state);
  if (state.screen === "paused") {
    if (state.menuIndex === 0) return { ...state, screen: state.resumeScreen };
    if (state.menuIndex === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return { ...state };
}

function readMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  let next: CaromState = { ...state };
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");

  if (state.screen === "countdown" || state.screen === "playing") {
    if (pause)
      return {
        ...next,
        screen: "paused",
        resumeScreen: state.screen,
        menuIndex: 0,
      };
    return next;
  }

  if (state.screen === "paused" && (pause || back)) {
    return { ...next, screen: state.resumeScreen };
  }
  if (state.screen === "howto" && (confirm || back))
    return returnToTitle(state);
  if (state.screen === "matchover" && back) return returnToTitle(state);

  const count = menuLength(state.screen);
  if (count > 0) {
    if (up) {
      next = { ...next, menuIndex: moveMenu(state.menuIndex, count, -1) };
    } else if (down) {
      next = { ...next, menuIndex: moveMenu(state.menuIndex, count, 1) };
    } else if (confirm) {
      next = confirmMenu(next);
    }
  }

  if (!confirm && count > 0) {
    const pointer = api.input.pointer();
    const hovered = menuItemAt(next.screen, pointer.x, pointer.y);
    if (hovered !== null) next = { ...next, menuIndex: hovered };

    let pressedIndex: number | null = null;
    let releasedIndex: number | null = null;
    for (const sample of api.input.pointerSamples()) {
      const index = menuItemAt(next.screen, sample.x, sample.y);
      if (index !== null) next = { ...next, menuIndex: index };
      if (sample.type === "down") pressedIndex = index;
      if (sample.type === "up") releasedIndex = index;
    }
    if (api.input.pointerPressed()) pressedIndex = hovered;
    if (api.input.pointerReleased()) releasedIndex = hovered;
    if (
      pressedIndex !== null &&
      releasedIndex !== null &&
      pressedIndex === releasedIndex
    ) {
      next = confirmMenu({ ...next, menuIndex: releasedIndex });
    }
  }

  return next;
}

function advanceWorld(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  let next: CaromState = { ...state };
  if (state.screen !== "countdown" && state.screen !== "playing") return next;

  const paddles = updatePaddles(state, api, dt);
  next = { ...next, paddles };
  const events: PhysicsEvents = { wall: false, paddle: false, obstacle: false };

  if (state.ball) {
    let ball: BallState = { ...state.ball, trail: [...state.ball.trail] };
    if (state.screen === "countdown" && ball.held) {
      const holdTimer = Math.max(0, ball.holdTimer - dt);
      ball = { ...ball, x: FIELD_CX, y: FIELD_CY, holdTimer };
      if (holdTimer <= 0) {
        ball = serveBall(ball, state.receiver);
        next = { ...next, screen: "playing" };
      }
    } else if (state.screen === "playing" && !ball.held) {
      ball = advanceBall(ball, paddles, state.obstacles, dt, events);
    }
    next = {
      ...next,
      ball: addTrail(ball, state.simTime + dt),
    };
  }

  if (state.obstacleClockRunning) {
    const obstacleClock = state.obstacleClock + dt;
    next = {
      ...next,
      obstacleClock,
      obstacles: posesForClock(obstacleClock, state.obstacles),
    };
  } else {
    next = {
      ...next,
      obstacles: posesForClock(state.obstacleClock, state.obstacles),
    };
  }

  next = maybeScore(next, events);
  if (next !== state && next.ball !== null && events.paddle) {
    next = { ...next, ball: next.ball };
  }
  if (state.ball && next.ball !== state.ball) playEvents(api, events);
  if (next.screen !== state.screen && next.screen !== "playing")
    api.audio.play(CUES.score);
  return next;
}

function reconcileState(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...state,
    obstacles: posesForClock(state.obstacleClock, state.obstacles),
    ball: state.ball ? { ...state.ball, trail: [...state.ball.trail] } : null,
  };
}

function requireBall(state: DeepReadonly<CaromState>): DeepReadonly<BallState> {
  if (!state.ball) throw new Error("Carom: no ball is present");
  return state.ball;
}

function withBall(
  state: DeepReadonly<CaromState>,
  edit: (ball: DeepReadonly<BallState>) => BallState,
): CaromState {
  return { ...state, ball: edit(requireBall(state)) };
}

function setPaddle(
  state: DeepReadonly<CaromState>,
  side: Side,
  paddle: PaddleState,
): CaromState {
  return { ...state, paddles: { ...state.paddles, [side]: paddle } };
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  return {
    version: CAROM_DEBUG_VERSION,
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { ...state.score },
    winner: state.winner,
    muted: state.muted,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball
      ? {
          ...state.ball,
          speed: speedOf(state.ball),
          trail: [...state.ball.trail],
        }
      : null,
    obstacles: posesForClock(state.obstacleClock, state.obstacles),
    obstacleClock: state.obstacleClock,
    obstacleClockRunning: state.obstacleClockRunning,
    simTime: state.simTime,
  };
}

function makeDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...state, ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...state, ball: parkedBall() }),
    spawnObstacle: (state, index) => {
      if (!OBSTACLE_CENTERS[index])
        throw new Error(`Carom: no obstacle ${index}`);
      const obstacle = obstaclePose(index, state.obstacleClock);
      const others = state.obstacles.filter((item) => item.index !== index);
      return {
        ...state,
        obstacles: [...others, obstacle].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => titleState(state.muted),
    reconcile: (state) => reconcileState(state),
    setScreen: (state, screen) => ({ ...state, screen }),
    setMode: (state, mode) => ({ ...state, mode }),
    setMenuIndex: (state, index) => ({ ...state, menuIndex: index }),
    setTitleIndex: (state, index) => ({ ...state, titleIndex: index }),
    setResumeScreen: (state, resumeScreen) => ({ ...state, resumeScreen }),
    setScore: (state, p1, p2) => ({ ...state, score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...state, winner }),
    setReceiver: (state, receiver) => ({ ...state, receiver }),
    setPaddleCy: (state, side, cy) =>
      setPaddle(state, side, { ...state.paddles[side], cy }),
    setPaddleVy: (state, side, vy) =>
      setPaddle(state, side, { ...state.paddles[side], drivenVy: vy }),
    setPaddleDriven: (state, side, driven) =>
      setPaddle(state, side, { ...state.paddles[side], driven }),
    setBallPosition: (state, x, y) =>
      withBall(state, (ball) => ({ ...ball, x, y })),
    setBallVelocity: (state, vx, vy) =>
      withBall(state, (ball) => ({ ...ball, vx, vy })),
    setBallSpin: (state, spin) =>
      withBall(state, (ball) => ({ ...ball, spin })),
    setBallHeld: (state, held) =>
      withBall(state, (ball) => ({ ...ball, held })),
    setBallHoldTimer: (state, holdTimer) =>
      withBall(state, (ball) => ({ ...ball, holdTimer })),
    setBallServeSign: (state, serveSign) =>
      withBall(state, (ball) => ({ ...ball, serveSign })),
    drawBallServeSign: (state) =>
      withBall(state, (ball) => ({ ...ball, serveSign: serveSign() })),
    setAiTracking: (state, tracking) => ({
      ...state,
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...state,
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...state, muted }),
    setObstacleClock: (state, obstacleClock) => ({
      ...state,
      obstacleClock,
      obstacles: posesForClock(obstacleClock, state.obstacles),
    }),
    setObstacleClockRunning: (state, obstacleClockRunning) => ({
      ...state,
      obstacleClockRunning,
    }),
    snapshot,
    menuItemRect: (state, index) => menuRect(state.screen, index),
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("mode", (s) => s.mode);
  api.diagnostics.register("score", (s) => `${s.score.p1}-${s.score.p2}`);
  api.diagnostics.register("ball", (s) =>
    s.ball ? `${s.ball.x.toFixed(1)},${s.ball.y.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball v", (s) =>
    s.ball ? `${s.ball.vx.toFixed(1)},${s.ball.vy.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball speed", (s) =>
    s.ball ? speedOf(s.ball).toFixed(1) : "none",
  );
  api.diagnostics.register("spin", (s) =>
    s.ball ? s.ball.spin.toFixed(1) : "none",
  );
  api.diagnostics.register(
    "p1",
    (s) => `${s.paddles.left.cy.toFixed(1)} ${s.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "p2",
    (s) => `${s.paddles.right.cy.toFixed(1)} ${s.paddles.right.vy.toFixed(1)}`,
  );
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    api.audio.define(CUES.paddleHit, {
      wave: "square",
      freq: 520,
      freqTo: 250,
      gain: 0.16,
      durationMs: 70,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "triangle",
      freq: 310,
      freqTo: 470,
      gain: 0.13,
      durationMs: 55,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "sawtooth",
      freq: 760,
      freqTo: 380,
      gain: 0.11,
      durationMs: 80,
    });
    api.audio.define(CUES.score, {
      wave: "sine",
      freq: 220,
      freqTo: 880,
      gain: 0.18,
      durationMs: 180,
    });
    registerDiagnostics(api);
    return [titleState(false), makeDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    const mutePressed = api.input.pressed("mute");
    if (mutePressed) api.audio.setMuted(!api.audio.muted());
    let next = readMenuInput(state, api);
    next = advanceWorld(next, api, dt);
    return {
      ...next,
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const { ctx } = api;
    drawField(ctx);
    const dim = state.screen === "title" || state.screen === "howto";
    ctx.save();
    if (dim) ctx.globalAlpha = 0.38;
    drawPlayfield(ctx, state);
    ctx.restore();
    if (state.screen === "title") drawTitle(ctx, state);
    if (state.screen === "howto") drawHowTo(ctx, state);
    if (state.screen === "countdown") drawCountdown(ctx, state);
    if (state.screen === "playing") drawHud(ctx, state);
    if (state.screen === "paused") drawPause(ctx, state);
    if (state.screen === "matchover") drawMatchOver(ctx, state);
  },
};

function drawField(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = COLORS.field;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 1;
  for (let x = 80; x < FIELD_W; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, FIELD_H);
    ctx.stroke();
  }
  for (let y = 80; y < FIELD_H; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(FIELD_W, y);
    ctx.stroke();
  }
}

function drawPlayfield(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.save();
  ctx.strokeStyle = COLORS.net;
  ctx.lineWidth = 6;
  ctx.setLineDash([18, 22]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 28);
  ctx.lineTo(NET_X, FIELD_H - 28);
  ctx.stroke();
  ctx.restore();

  for (const obstacle of state.obstacles) drawObstacle(ctx, obstacle);
  drawPaddle(ctx, "left", state.paddles.left);
  drawPaddle(ctx, "right", state.paddles.right);
  if (state.ball) drawBall(ctx, state.ball);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): void {
  const x = side === "left" ? P1_X0 : P2_X0;
  ctx.save();
  ctx.shadowColor = side === "left" ? COLORS.p1 : COLORS.p2;
  ctx.shadowBlur = 18;
  ctx.fillStyle = side === "left" ? COLORS.p1 : COLORS.p2;
  roundedRect(ctx, x, paddle.cy - PADDLE_HALF, PADDLE_W, PADDLE_H, 8);
  ctx.fill();
  ctx.restore();
}

function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: DeepReadonly<ObstacleState>,
): void {
  ctx.save();
  ctx.translate(obstacle.cx, obstacle.cy);
  ctx.rotate(obstacle.theta);
  ctx.shadowColor = COLORS.obstacle;
  ctx.shadowBlur = 20;
  ctx.fillStyle = COLORS.obstacle;
  roundedRect(
    ctx,
    -OBSTACLE_W / 2,
    -OBSTACLE_H / 2,
    OBSTACLE_W,
    OBSTACLE_H,
    10,
  );
  ctx.fill();
  ctx.restore();
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: DeepReadonly<BallState>,
): void {
  if (ball.trail.length > 1) {
    ctx.save();
    ctx.lineCap = "round";
    for (let i = 1; i < ball.trail.length; i += 1) {
      const a = ball.trail[i - 1];
      const b = ball.trail[i];
      if (!a || !b) continue;
      ctx.strokeStyle = `rgba(255, 247, 199, ${i / ball.trail.length / 1.4})`;
      ctx.lineWidth = BALL_R * (i / ball.trail.length);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.save();
  ctx.shadowColor = COLORS.ball;
  ctx.shadowBlur = 20;
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.save();
  ctx.fillStyle = COLORS.text;
  ctx.font = "700 54px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.score.p1), FIELD_CX - 110, 70);
  ctx.fillText(String(state.score.p2), FIELD_CX + 110, 70);
  ctx.font = "600 20px Inter, system-ui, sans-serif";
  ctx.fillStyle = COLORS.dim;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    106,
  );
  ctx.restore();
}

function drawMenuItem(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
  index: number,
  text: string,
): void {
  const rect = menuRect(state.screen, index);
  if (!rect) return;
  const selected = state.menuIndex === index;
  ctx.save();
  roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
  ctx.fillStyle = selected
    ? "rgba(255, 209, 102, 0.18)"
    : "rgba(237, 247, 255, 0.08)";
  ctx.fill();
  ctx.strokeStyle = selected ? COLORS.highlight : "rgba(237, 247, 255, 0.26)";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();
  ctx.fillStyle = selected ? COLORS.highlight : COLORS.text;
  ctx.font = "700 24px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2);
  ctx.restore();
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = "900 112px Inter, system-ui, sans-serif";
  ctx.shadowColor = COLORS.obstacle;
  ctx.shadowBlur = 30;
  ctx.fillText(TITLE_TEXT, FIELD_CX, 220);
  ctx.shadowBlur = 0;
  ctx.fillStyle = COLORS.dim;
  ctx.font = "600 24px Inter, system-ui, sans-serif";
  ctx.fillText("curve the rally, bank the angles", FIELD_CX, 268);
  TITLE_ITEMS.forEach((item, index) => drawMenuItem(ctx, state, index, item));
  ctx.restore();
}

function drawHowTo(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.save();
  ctx.fillStyle = COLORS.panel;
  roundedRect(ctx, 245, 120, 790, 410, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.text;
  ctx.textAlign = "center";
  ctx.font = "800 42px Inter, system-ui, sans-serif";
  ctx.fillText("HOW TO PLAY", FIELD_CX, 180);
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillStyle = COLORS.dim;
  const lines = [
    "W/S moves the left paddle. Arrow keys move the right paddle in Versus.",
    "In Solo, either vertical control moves you and the right paddle defends.",
    "Strike while moving to add spin. Spin bends the ball after contact.",
    "Use the swaying obstacles for bank shots. P pauses, M mutes.",
  ];
  lines.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 250 + index * 48),
  );
  drawMenuItem(ctx, state, 0, "BACK");
  ctx.restore();
}

function drawCountdown(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawHud(ctx, state);
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.highlight;
  ctx.font = "900 86px Inter, system-ui, sans-serif";
  const time = state.ball ? Math.ceil(state.ball.holdTimer) : 0;
  ctx.fillText(time > 0 ? String(time) : "GO", FIELD_CX, FIELD_CY - 90);
  ctx.restore();
}

function drawPause(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawHud(ctx, state);
  ctx.save();
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = "900 58px Inter, system-ui, sans-serif";
  ctx.fillText("PAUSED", FIELD_CX, 275);
  PAUSE_ITEMS.forEach((item, index) => drawMenuItem(ctx, state, index, item));
  ctx.restore();
}

function drawMatchOver(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawHud(ctx, state);
  ctx.save();
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.text;
  ctx.font = "900 56px Inter, system-ui, sans-serif";
  const winner =
    state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS";
  ctx.fillText(winner, FIELD_CX, 250);
  ctx.font = "700 36px Inter, system-ui, sans-serif";
  ctx.fillStyle = COLORS.dim;
  ctx.fillText(`${state.score.p1} - ${state.score.p2}`, FIELD_CX, 304);
  MATCHOVER_ITEMS.forEach((item, index) =>
    drawMenuItem(ctx, state, index, item),
  );
  ctx.restore();
}
