import { get, writable } from "svelte/store";
import type { Writable } from 'svelte/store';

export type AnimationEffectParameters = {
  onAnimate: () => void;
  onFinished: () => void;
  onStop?: () => void;
  delay: number;
  duration: number;
}

export class AnimationLoop {
  isActive: boolean;
  millisecondsLength: number;
  effects: AnimationEffect[];
  interval: NodeJS.Timer = undefined;
  
  /**
   * Animation Loop that holds AnimationEffect triggers.
   * These triggers have a delay and a duration, which will be triggered
   * Every time the animation loop runs.
   * Interval length has to be larger than the largest effect duration. Otherwise
   * That effect won't trigger in accordance to provided variables
   * @param animationMillisecondsLength 
   */
  constructor(animationMillisecondsLength: number) {
    this.isActive = false;
    this.millisecondsLength = animationMillisecondsLength;
    this.effects = [];
  }

  /**
   * set the length of intervals in accordance to the necessary wait.
   * Interval length has to be larger than the largest effect duration. Otherwise
   * That effect won't trigger in accordance to provided variables
   * @param milliseconds length of each animation loop
   */
  setIntervalLength(milliseconds: number) {
    // Don't do anything, when no change has been done
    if(this.millisecondsLength === milliseconds) return;

    this.millisecondsLength = milliseconds;

    // If intervals are inactive, we don't need to do anything else.
    if(this.isActive === false) return;
    
    this.updateInterval()
  }

  /**
   * Set animation loop state. Use this function to activate the animation loop
   * Also use this to deactivate loop. If state is already the same, nothing happens.
   * If new state, it updates the state and updates the interval and resets effects in accordance.
   * @param active new state
   */
  setState(active: boolean) {
    // Ignore if state is same as requested
    if(active === this.isActive) return;

    // Update active variable
    this.isActive = active;

    this.updateInterval();
  }

  /**
   * Clears all timers and timeouts.
   * If activate, it sets up a new interval that run every round.
   */
  private updateInterval() {
    // Clear all existing timeouts
    this.clearAllTimers();

    // If inactive. Leave intervals clear
    if(!this.isActive) return;
    
    // Get function for interval
    const triggerAnimation = this.getAnimationTrigger();

    // Setup interval for future animations
    this.interval = setInterval(triggerAnimation,this.millisecondsLength);

    // Perform first animation round
    triggerAnimation();
  }

  /**
   * Generates a function that uses this animations loops effects.
   * @returns a function that triggers all effects when called. Triggering means the animation will
   * be played after the designated delay.
   */
  private getAnimationTrigger() : ()=>void {
    const effects = this.effects;
    return () => {effects.forEach(effect => {effect.trigger()})};
  }

  /**
   * Add effects to animation loop.
   * Resets interval if animation loop is active
   * @param effects arbitrary amount of effects
   */
  addEffect(...effects: AnimationEffect[]) {
    if (effects && effects.length)
        for (var effect of effects)
            this.effects.push(effect);
    
    // Reset animation when new effects are added
    this.updateInterval();
  }
  
  /**
   * Removes effect from loop. It resets the timeouts inside the effect.
   * This prevents any variable mutation and access that it should not make.
   * @param effects effects that we wish to remove
   */
  removeEffect(...effects: AnimationEffect[]) {
    if (effects && effects.length)
        for (var effect of effects)
          this.stopEffectAndRemove(effect);
  }

  /**
   * Removes effect from interval effects array.
   * Stops effect if it is currently running.
   * @param effect 
   */
  private stopEffectAndRemove(effect: AnimationEffect) {
    const index = this.effects.findIndex(effectFromArray => effectFromArray === effect);
    if(index === -1) return;
    
    effect.stop();
    this.effects.splice(index,1);
  }

  /**
   * Total reset of all timers and timeouts within both the interval
   * and all its effects
   */
  private clearAllTimers() {
    this.effects.forEach(effect => {effect.stop()});
    clearInterval(this.interval);
  }

}

export class AnimationEffect {
  private onAnimate: () => void;
  private onFinished: () => void;
  private onStop: () => void | undefined;
  private delay: number;
  private duration: number;
  private timeout: NodeJS.Timeout;
  private finishedTimeout: NodeJS.Timeout;

  /**
   * Makes an animationEffect that runs after 'delay' milliseconds.
   * The effect is then active for 'duration' milliseconds.
   * 'onAnimate' is triggered after 'delay'.
   * 'onFinished' is triggered after 'delay' + 'duration'.
   * 'onStop' is called when the animationEffect is asked to stop.
   * Parameters are passed as an object to make instantiation of the
   * effects readable.
   * @param effectParameters defines the state of this effect.
   */
  constructor(effectParameters: AnimationEffectParameters) {
    this.onAnimate = effectParameters.onAnimate;
    this.onFinished = effectParameters.onFinished;
    this.delay = effectParameters.delay;
    this.duration = effectParameters.duration;
    this.onStop = effectParameters.onStop;
  }

  /**
   * Trigger delay function, such that onAnimate will be triggered after
   * 'delay'. onFinished will be triggered after 'delay' + 'duration'
   */
  trigger () {
    AnimationEffect.internalTrigger(this)
  }

  /**
   * Sets up timeouts in accordance to the effects variables
   * After 'delay' it will trigger onAnimate.
   * Then after 'duration' it will trigger onFinished
   * @param effect
   */
  private static internalTrigger(effect: AnimationEffect) {
    effect.timeout = setTimeout(()=>{
      effect.onAnimate();
      effect.finishedTimeout = setTimeout(effect.onFinished,effect.duration);
    },effect.delay);
  }

  /**
   * Stops effect by clearing all timeouts.
   */
  stop() {
    this.onStop?.();
    clearTimeout(this.timeout);
    clearTimeout(this.finishedTimeout);
  }
};


export class BooleanEffectTrigger {
  animationEffect: AnimationEffect;
  value: Writable<boolean>;

  /**
   * Some effects are dependent on a single boolean to activate
   * some CSS properties or something else. To remove boilerplate
   * code, this class holds an animationEffect and a writable which
   * one can listen to from classes. This reduces the necessary inputs
   * to the parameters:
   * @param delay delay before performing animation
   * @param duration length of animation
   */
  constructor (delay: number, duration: number) {
    this.value = writable(false);
    this.animationEffect = new AnimationEffect({
      onAnimate: () => {
        this.value.set(true);
      },
      onFinished: () => {
        this.value.set(false);
      },
      onStop: () => {
        this.value.set(false);
      },
      delay,
      duration,
    });
  }
}