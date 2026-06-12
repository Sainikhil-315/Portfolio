/**
 * Single GSAP registry — import gsap ONLY from this module, never from 'gsap'.
 * Keeps plugin registration, easing vocabulary, and timing tokens in one place.
 */
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  CustomEase
);

ScrollTrigger.config({ ignoreMobileResize: true });

/** house ease — decisive curtain motion, no bounce */
export const EASE = {
  hop: CustomEase.create(
    'hop',
    'M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1'
  ),
  out: 'expo.out',
  inOut: 'power4.inOut',
  settle: 'power2.out',
  spring: 'elastic.out(1, 0.4)',
} as const;

/** duration tokens (seconds) */
export const D = {
  xs: 0.3,
  sm: 0.6,
  md: 0.9,
  lg: 1.2,
  curtain: 0.9,
} as const;

/** stagger tokens */
export const STAGGER = {
  chars: 0.02,
  words: 0.04,
  items: 0.08,
} as const;

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** standard matchMedia conditions for gsap.matchMedia() blocks */
export const MM = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduced: REDUCED_MOTION_QUERY,
  isDesktop: '(min-width: 768px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const;

export { gsap, useGSAP, ScrollTrigger, SplitText, CustomEase };
