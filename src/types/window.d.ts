import type Lenis from "lenis";

export {};

declare global {
  interface Window {
    __tanoRestoreY?: number;
    __tanoLenis?: Lenis;
  }
}
