import tinycolor from 'tinycolor2';

export function darken(color: string, amount: number) {
  return tinycolor(color).darken(amount).toHexString();
}

export function lighten(color: string, amount: number) {
  return tinycolor(color).lighten(amount).toHexString();
}

export function brighten(color: string, amount: number) {
  return tinycolor(color).brighten(amount).toHexString();
}
