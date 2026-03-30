// default settings and A4 dimensions , base config for the whole app
export const A4_WIDTH  = 794; //Yes a4 is 794x1123 and not 800x1280
export const A4_HEIGHT = 1123;

export const DEFAULT_SETTINGS = {
  fontFamily: 'Caveat',
  fontSize: 22,
  fontColor: 'black',

  lineSpacing: 32,
  lineSpacingNoiseEnabled: false,
  lineSpacingNoiseMax: 2,
  lineSlopeEnabled: false,
  lineSlopeMax: 0.3,
  lineFontNoiseEnabled: false,
  lineFontNoiseMax: 1,

  wordSpacing: 5,
  wordSpacingNoiseEnabled: false,
  wordSpacingNoiseMax: 2,
  wordBaselineEnabled: false,
  wordBaselineMax: 1.5,
  wordRotationEnabled: false,
  wordRotationMax: 0.8,

  letterSpacing: 0,
  letterSpacingNoiseEnabled: false,
  letterSpacingNoiseMax: 0.5,

  inkBlurEnabled: false,
  inkBlurAmount: 0.3,
  inkFlowEnabled: false,
  inkFlowAmount: 0,
  inkShadowEnabled: false,
  inkShadowAmount: 0.5,

  paperType: 'blank',
  paperColor: 'white',
  paperLineColor: 'lightsteelblue',
  paperTextureEnabled: false,
  paperShadowEnabled: false,
  paperCustomBg: null,

  paperMarginLeftEnabled: false,
  paperMarginLeft: 80,
  paperMarginTopEnabled: false,
  paperMarginTop: 60,
  paperMarginRightEnabled: false,
  paperMarginRight: 40,
  marginLineColor: 'black',

  pageWidth: A4_WIDTH,
  pageHeight: A4_HEIGHT,
};
