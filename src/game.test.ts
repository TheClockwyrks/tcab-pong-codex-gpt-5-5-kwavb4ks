import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  P1_X1,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  SERVE_SPEED,
} from "./constants";
import { BACKGROUND, game } from "./game";

function makeEngine(stepMs = 1000 / 60) {
  const canvas = createCanvas(1280, 720) as unknown as HTMLCanvasElement;
  return createEngine({
    canvas,
    width: FIELD_W,
    height: FIELD_H,
    background: BACKGROUND,
    game,
    clock: new ConstantClock(stepMs),
    surface: {
      cssWidth: () => FIELD_W,
      cssHeight: () => FIELD_H,
      dpr: () => 1,
      events: () => new EventTarget(),
    },
  });
}

describe("Carom simulation", () => {
  it("initializes the title state and debug snapshot", async () => {
    const engine = makeEngine();
    await engine.initialize();

    const snap = engine.debug.snapshot(engine.state);

    expect(snap.version).toBe(1);
    expect(snap.screen).toBe("title");
    expect(snap.mode).toBe("solo");
    expect(snap.score).toEqual({ p1: 0, p2: 0 });
    expect(snap.ball?.held).toBe(true);
    expect(snap.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).not.toBeNull();
  });

  it("serves from countdown toward the receiver without advancing the ball that frame", async () => {
    const engine = makeEngine(1000);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setReceiver(state, "right"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(1);
    const ball = engine.debug.snapshot(engine.state).ball;

    expect(engine.state.screen).toBe("playing");
    expect(ball?.held).toBe(false);
    expect(ball?.x).toBe(FIELD_W / 2);
    expect(ball?.y).toBe(FIELD_H / 2);
    expect(ball?.speed).toBeCloseTo(SERVE_SPEED, 6);
    expect(ball?.vx).toBeGreaterThan(0);
    expect(ball?.vy).toBeGreaterThan(0);
  });

  it("adds paddle spin from driven paddle motion", async () => {
    const engine = makeEngine(1000 / 240);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) =>
      engine.debug.setPaddleVy(state, "left", PADDLE_SPEED),
    );

    await engine.advance(3);
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.ball?.vx).toBeGreaterThan(0);
    expect(snap.ball?.spin).toBeGreaterThan(0);
    expect(snap.paddles.left.vy).toBeGreaterThan(0);
  });

  it("scores, parks the ball, and sends the next serve toward the scored-on side", async () => {
    const engine = makeEngine(1000 / 60);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setBallHeld(state, false));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 4, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 100, 0));

    await engine.advance(1);
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.score).toEqual({ p1: 1, p2: 0 });
    expect(snap.receiver).toBe("right");
    expect(snap.screen).toBe("countdown");
    expect(snap.ball?.held).toBe(true);
    expect(snap.ball?.trail).toHaveLength(0);
  });

  it("clamps driven paddles and reports the actual integrated velocity", async () => {
    const engine = makeEngine(1000 / 60);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) =>
      engine.debug.setPaddleCy(state, "left", PADDLE_MIN_CY),
    );
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) =>
      engine.debug.setPaddleVy(state, "left", -PADDLE_SPEED),
    );

    await engine.advance(1);
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.paddles.left.cy).toBe(PADDLE_MIN_CY);
    expect(snap.paddles.left.vy).toBe(0);
    expect(snap.paddles.left.drivenVy).toBe(-PADDLE_SPEED);
  });
});
