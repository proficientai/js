import tinycolor from 'tinycolor2';

/**
 * @param color - The color to darken.
 * @param shadeCount - A number ranging from 0 to 25.
 */
export function darken(color: string, shadeCount: number) {
  return tinycolor(color)
    .darken(shadeCount * 2.5)
    .toHexString();
}

/**
 * @param color - The color to lighten.
 * @param shadeCount - A number ranging from 0 to 25.
 */
export function lighten(color: string, shadeCount: number) {
  return tinycolor(color)
    .lighten(shadeCount * 2.5)
    .toHexString();
}
