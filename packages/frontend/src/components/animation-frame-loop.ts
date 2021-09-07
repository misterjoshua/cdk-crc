/** Interface for a type that can be animated */
export interface IAnimatedObject {
  /** Update the animated object */
  update(deltaTime: number);
}

export interface AnimationFrameLoopOptions {
  /** Object to animate */
  readonly animatedObject: IAnimatedObject;
}

/** Animates the given `animatedObject` every browser animation frame */
export class AnimationFrameLoop {
  private readonly animatedObject: IAnimatedObject;

  /** True until the loop is asked to stop */
  private running = true;
  /** Track the last time we animated so that we can determine ∆t */
  private lastTime?: number;

  constructor(options: AnimationFrameLoopOptions) {
    this.animatedObject = options.animatedObject;
    this.requestNextAnimationFrame();
  }

  /** Stop the animation loop. */
  stop() {
    this.running = false;
  }

  private requestNextAnimationFrame() {
    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  private loop(time: number) {
    // Loop until we've been asked to stop
    if (!this.running) return;

    // Determine how much time has passed since the last animation frame and
    // give that to the animated object so that the object can animate at a
    // consistent rate.
    const deltaTime = time - (this.lastTime ?? time);
    this.lastTime = time;

    this.animatedObject.update(deltaTime);

    this.requestNextAnimationFrame();
  }
}
