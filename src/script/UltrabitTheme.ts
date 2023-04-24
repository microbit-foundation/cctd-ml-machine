export enum UltrabitSmileyVariant {
  NEON_YELLOW = 'neonYellow',
  TEAL = 'teal',
  RED = 'red',
  DARK_BLUE = 'darkBlue',
  GREEN = 'green',
  PINK = 'pink',
  SAND = 'sand',
  LIGHT_BLUE = 'lightBlue',
}

class UltrabitTheme {
  /**
   * Includes colors that are suggested by DR, select the color and a number corresponding to its wanted opacity.
   *
   * Values are returned as rgba(x,y,z,w) functions.
   *
   * ## Example:
   *
   * `backgroundColor: {UltrabitTheme.colors.neonYellow.100}`
   */
  public static colors = {
    // add more opacity variants if needed.
    neonYellow: {
      100: 'rgba(222, 242, 24, 1)',
    },
    teal: {
      100: 'rgba(100, 190, 195, 1)',
    },
    red: {
      100: 'rgba(225, 75, 75, 1)',
    },
    darkBlue: {
      100: 'rgba(40, 65, 150, 1)',
    },
    green: {
      100: 'rgba(0, 80, 80, 1)',
    },
    pink: {
      100: 'rgba(245, 205, 225, 1)',
    },
    sand: {
      100: 'rgba(240, 240, 190, 1)',
    },
    lightBlue: {
      100: 'rgba(100, 190, 195, 1)',
    },
    waterBlue: {
      100: 'rgba(122, 140, 223, 1)',
    },
    brown: {
      100: 'rgba(109, 100, 62, 1)',
    },
  };

  /**
   * The src location of ultra bit smileys.
   *
   * Select the color and variant you want.
   *
   * version where eyes are transparent and opaque
   *
   * ## Example
   *
   * `<img src={UltrabitTheme.smileys.neonYellow.opaque} />`
   */
  public static smileys = {
    neonYellow: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-02.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-10.png',
    },
    teal: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-03.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-11.png',
    },
    red: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-04.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-12.png',
    },
    darkBlue: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-05.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-13.png',
    },
    green: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-06.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-14.png',
    },
    pink: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-07.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-15.png',
    },
    sand: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-08.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-16.png',
    },
    lightBlue: {
      opaque: 'ultrabit/smileys/ULTRABIT_SMILEY-09.png',
      transparent: 'ultrabit/smileys/ULTRABIT_SMILEY-17.png',
    },
  };

  /**
   * Background images from ultra:bit
   *
   * ## Example:
   *
   * `<img src={UltrabitTheme.backgroundImages.black} />`
   */
  public static backgroundImages = {
    grayLg: 'ultrabit/background_images/gray_lg.jpg',
    grayMd: 'ultrabit/background_images/gray_md.jpg',
    black: 'ultrabit/background_images/black.jpg',
    cardboard: 'ultrabit/background_images/cardboard.jpg',
    cardboardRollup: 'ultrabit/background_images/cardboard_rollup.jpg',
  };

  /**
   * CSS selector for ultrabit font.
   *
   * Could just as easily use 'font-ultrabit' instead.
   *
   * ## Example:
   *
   * `<p class='font-ultrabit'>EXAMPLE</p>`
   *
   * or
   *
   * `<p class='{UltrabitTheme.ultrabitFont}'>EXAMPLE</p>`
   */
  public static ultrabitFont = 'font-ultrabit';

  /**
   * The partner logos provided by ultra:bit
   *
   * ## Example
   *
   * `<img src={UltrabitTheme.partnerLogos}/>`
   */
  public static partnerLogos = 'ultrabit/partner_logos.png';

  /**
   * Ultrabit logo
   *
   * ## Example
   *
   * `<img src={UltrabitTheme.ultrabitLogo}/>`
   */
  public static ultrabitLogo = 'ultrabit/ultrabit_logo.png';
}

export default UltrabitTheme;
