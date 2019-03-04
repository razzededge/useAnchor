import { useEffect } from "react";

/**
 * Hook that animates scrolling to the element passed down as hash in url
 * @version 1.0.0
 */

/**
 * @param {int}  intervalId for removing previously set interval (so it won't be double launched)
 */
let intervalId;

/**
 * Animation steps will be calculated with this formula:
 * duration / interval
 * @constant {Object} defaults
 * @constant {integer} defaults.interval default interval of animation
 * @constant {integer} defaults.duration default duration of animation
 */
const defaults = {
  interval: 20,
  duration: 400
};

/**
 * gets element postion from top of the document
 * @param {string} hash takes hash that is passed down in the url
 * @return {int} pixels from top or 0 if element not found
 */
const getFromTop = hash => {
  const element = document.querySelector(`[name="${hash}"]`);
  return element ? element.offsetTop : 0;
};

/**
 * Creates configuration array for animateScrolling function
 * @param {integer} int interval amount in miliseconds
 * @param {integer} dur duration of the animation in miliseconds
 * @return {Array} calcuated values that are destructured into setInterval function with animation
 */
const configureAnimation = (int, dur) => {
  const { pageYOffset, location } = global;
  const hash = location.hash.substr(1);
  const intervalDuration = dur / int;

  const fromTop = getFromTop(hash);
  const pixels = Math.abs(fromTop - pageYOffset) / intervalDuration;
  const iterations = Math.ceil(intervalDuration);

  return [fromTop, pixels, iterations];
};

/**
 * Animates the scrolling from current window position to position of the specified element
 * @param {integer} finalFromTop final position in pixels of window from top
 * @param {integer} pixelsPerIteration amount of pixels to scroll in each iteration
 * @param {integer} iterationsLeft amount of execution iterations for this function left execute
 */
const animateScrolling = (finalFromTop, pixelsPerIteration, iterationsLeft) => {
  const { pageYOffset: top, scrollTo } = global;
  let iterations = iterationsLeft;

  let position = 0;

  /**
   * checks if element would be scrolled out on  another iteration
   * if yes: scroll to final position, clear interval and abort execution,
   */

  if (Math.abs(finalFromTop - top) < pixelsPerIteration) {
    scrollTo(0, finalFromTop);
    iterations = 0;
    clearInterval(intervalId);
    return;
  }

  /**
   *  set final position for this iteration based on current position
   *  (before/after final position of the element)
   */
  if (top < finalFromTop) {
    position = top + pixelsPerIteration;
  } else if (top > finalFromTop) {
    position = top - pixelsPerIteration;
  } else {
    position = finalFromTop;
    iterations = 0;
  }

  scrollTo(0, position);

  // clear interval when no iterations left
  if (!iterations) {
    clearInterval(intervalId);
  }
};

/**
 * Actual hook function body
 * @param {integer} int interval value in miliseconds
 * @param {integer} dur duration of animation in miliseconds
 * @return {Function} clears interval on exit
 */
const useAnchor = (int = defaults.interval, dur = defaults.duration) => {
  useEffect(
    () => {
      intervalId = setInterval(
        animateScrolling,
        int,
        ...configureAnimation(int, dur)
      );

      return () => {
        clearInterval(intervalId);
      };
    },
    [window.location.hash]
  );
};

export default useAnchor;
