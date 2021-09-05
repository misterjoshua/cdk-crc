import React, { useEffect, useRef, useState } from 'react';

export const ParticularlyHeroic: React.FC = (props) => {
  const containerRef = useRef<HTMLDivElement>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    setDimensions();

    window.addEventListener('resize', setDimensions);
    return () => window.removeEventListener('resize', setDimensions);

    function setDimensions() {
      setWidth(containerRef.current.clientWidth);
      setHeight(containerRef.current.clientHeight);
    }
  }, [setWidth, setHeight, containerRef]);

  const backdropRef = useRef<HTMLCanvasElement>();
  const foregroundRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    // We need to know the width/height before we create an animation.
    if (!width || !height) return;

    for (const canvas of [backdropRef.current, foregroundRef.current]) {
      canvas.width = width;
      canvas.height = height;
    }

    drawBackdrop({
      canvas: backdropRef.current,
      width,
      height,
    });

    const animator = new CanvasAnimator({
      animatedObject: new CirclesAnimation({
        backgroundImage: backdropRef.current,
        canvas: foregroundRef.current,
        width,
        height,
      }),
    });

    return () => animator.stop();
  }, [width, height, backdropRef, foregroundRef]);

  return (
    <section ref={containerRef} className="hero-container">
      <canvas ref={backdropRef} className="backdrop" />
      <canvas ref={foregroundRef} className="foreground" />

      <div className="hero-contents">{props.children}</div>

      <style jsx>{`
        .hero-container {
          background: black;
          width: 100%;
          position: relative;
        }

        .hero-contents {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
        }

        .foreground {
          position: absolute;
          top: 0;
          left: 0;
          background: #000;
        }
      `}</style>
    </section>
  );
};

export interface IAnimatedObject {
  update(timeElapsed: number);
}

export interface IDrawableObject extends IAnimatedObject {
  draw(context: CanvasRenderingContext2D);
}

export interface CanvasAnimatorOptions {
  readonly animatedObject: IAnimatedObject;
}

export class CanvasAnimator {
  private readonly animatedObject: IAnimatedObject;

  private running = true;
  private lastTime?: number;

  constructor(options: CanvasAnimatorOptions) {
    this.animatedObject = options.animatedObject;
    this.requestNextAnimationFrame();
  }

  requestNextAnimationFrame() {
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  stop() {
    this.running = false;
  }

  loop(time: number) {
    // Loop until we've been asked to stop
    if (!this.running) return;

    const deltaTime = time - (this.lastTime ?? time);
    this.lastTime = time;

    this.animatedObject.update(deltaTime);

    this.requestNextAnimationFrame();
  }
}

export interface CirclesAnimationOptions {
  readonly backgroundImage: HTMLCanvasElement;
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
}

export class CirclesAnimation implements IAnimatedObject {
  private readonly backgroundImage: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  public readonly worldWidth: number;
  public readonly worldHeight: number;

  private readonly sprites: AnimationSprite[] = [];

  constructor(options: CirclesAnimationOptions) {
    this.backgroundImage = options.backgroundImage;
    this.context = options.canvas.getContext('2d');

    this.worldWidth = options.width;
    this.worldHeight = options.height;

    console.log(`${this.worldWidth} x ${this.worldHeight}`);

    const sizeBase = this.worldWidth + this.worldHeight;
    for (let i = 0; i < sizeBase * 0.03; i++) {
      const sprite = new AnimationSprite(this, {
        radius: rand(1, sizeBase * 0.03),
        x: rand(0, this.worldWidth),
        y: rand(0, this.worldHeight),
        angle: rand(0, FULL_CIRCLE),
        speed: rand(0.01, 0.03),
        tick: rand(0, 10000),
      });

      this.sprites.push(sprite);
    }
  }

  public update(deltaTime: number) {
    const ctx = this.context;

    ctx.clearRect(0, 0, this.worldWidth, this.worldHeight);

    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.drawImage(this.backgroundImage, 0, 0);
    ctx.globalCompositeOperation = 'lighter';

    for (const sprite of this.sprites) {
      sprite.update(deltaTime);
      sprite.draw(ctx);
    }
  }
}

export interface AnimationSpriteState {
  radius: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  tick: number;
}

class AnimationSprite implements IDrawableObject {
  constructor(
    private readonly world: CirclesAnimation,
    private readonly state: AnimationSpriteState,
  ) {}

  update(deltaTime: number) {
    const state = this.state;

    // Movement at an angle at a velocity
    state.x += Math.cos(state.angle) * state.speed * deltaTime;
    state.y += Math.sin(state.angle) * state.speed * deltaTime;
    state.angle += rand(-0.05, 0.05);

    // Teleport to the other side when exiting the scene
    if (state.x - state.radius > this.world.worldWidth) state.x = -state.radius;
    if (state.x + state.radius < 0)
      state.x = this.world.worldWidth + state.radius;
    if (state.y - state.radius > this.world.worldWidth) state.y = -state.radius;
    if (state.y + state.radius < 0)
      state.y = this.world.worldHeight + state.radius;

    // Increase the tick
    state.tick = (state.tick + 1) % 10000;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const state = this.state;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.arc(state.x, state.y, state.radius, 0, FULL_CIRCLE);
    ctx.fillStyle = hsla(0, 0, 100, 0.075 + Math.cos(state.tick * 0.02) * 0.05);
    ctx.fill();
  }
}

interface DrawBackdropParams {
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  readonly baseHue?: number;
}

function drawBackdrop(options: DrawBackdropParams) {
  const ctx = options.canvas.getContext('2d');

  const sizeBase = options.width + options.height;
  const count = Math.floor(sizeBase * 0.3);
  const baseHue = options.baseHue ?? 250;

  const opt = {
    radiusMin: 1,
    radiusMax: sizeBase * 0.04,
    blurMin: 10,
    blurMax: sizeBase * 0.04,
    hueMin: baseHue,
    hueMax: baseHue + 100,
    saturationMin: 10,
    saturationMax: 70,
    lightnessMin: 20,
    lightnessMax: 50,
    alphaMin: 0.1,
    alphaMax: 0.5,
  };

  ctx.clearRect(0, 0, options.width, options.height);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = 0; i < count; i++) {
    const radius = rand(opt.radiusMin, opt.radiusMax);
    const blur = rand(opt.blurMin, opt.blurMax);
    const x = rand(0, options.width);
    const y = rand(0, options.height);
    const hue = rand(opt.hueMin, opt.hueMax);
    const saturation = rand(opt.saturationMin, opt.saturationMax);
    const lightness = rand(opt.lightnessMin, opt.lightnessMax);
    const alpha = rand(opt.alphaMin, opt.alphaMax);

    ctx.shadowColor = hsla(hue, saturation, lightness, alpha);
    ctx.shadowBlur = blur;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, FULL_CIRCLE);
    ctx.closePath();
    ctx.fill();
  }
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function hsla(h: number, s: number, l: number, a: number): string {
  return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

const FULL_CIRCLE = Math.PI * 2;
export const ParticularlyHeroicInner: React.FC = (props) => (
  <div className="nice-box">
    {props.children}

    <style jsx>{`
      .nice-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        background: rgba(0, 0, 0, 0.7);
        color: white;
        width: 100%;
        margin: 2rem;
        padding: 2rem;
        min-height: 50vh;
      }

      @media screen and (min-width: 600px) {
        .nice-box {
          max-width: 600px;
        }
      }
    `}</style>
  </div>
);
