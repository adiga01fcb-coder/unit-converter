/**
 * Точные коэффициенты и чистые функции пересчёта единиц.
 * Общий модуль для страницы (браузер) и тестов (Node).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.UnitConv = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var G_STANDARD = 9.80665;
  var LB_TO_KG = 0.45359237;
  var IN_TO_M = 0.0254;
  var PSI_PA = (LB_TO_KG * G_STANDARD) / (IN_TO_M * IN_TO_M);

  var C = {
    MI_TO_KM: 1.609344,
    LB_TO_KG: LB_TO_KG,
    US_GAL_TO_L: 3.785411784,
    IN_TO_CM: 2.54,
    FT_TO_M: 0.3048,
    OZ_TO_G: 28.349523125,
    US_FLOZ_TO_ML: 29.5735295625,
    SQFT_TO_M2: 0.09290304,
    ACRE_TO_M2: 4046.8564224,
    HA_TO_M2: 10000,
    YD_TO_M: 0.9144,
    METRIC_HP_W: 735.49875,
    METRIC_HP_TO_KW: 0.73549875,
    KCAL_TO_KJ: 4.184,
    ATM_PA: 101325,
    BAR_PA: 100000,
    PSI_PA: PSI_PA,
    STONE_TO_LB: 14,
    STONE_TO_KG: 14 * LB_TO_KG,
    TBSP_ML: 15,
    TSP_ML: 5,
    CUP_ML: 240
  };

  C.L100KM_TO_MPG = (100 * C.US_GAL_TO_L) / C.MI_TO_KM;
  C.ATM_TO_PSI = C.ATM_PA / C.PSI_PA;
  C.BAR_TO_PSI = C.BAR_PA / C.PSI_PA;
  C.ATM_TO_BAR = C.ATM_PA / C.BAR_PA;

  /**
   * Кулинарные массы на 1 чашку 240 мл (распространённые справочные значения).
   * Плотность г/мл = gPerCup / 240.
   */
  var INGREDIENTS = [
    { id: "water", name: "Вода", gPerCup: 240 },
    { id: "milk", name: "Молоко", gPerCup: 245 },
    { id: "flour", name: "Мука пшеничная", gPerCup: 125 },
    { id: "sugar", name: "Сахар-песок", gPerCup: 200 },
    { id: "powder", name: "Сахарная пудра", gPerCup: 120 },
    { id: "butter", name: "Сливочное масло", gPerCup: 227 },
    { id: "oil", name: "Растительное масло", gPerCup: 218 },
    { id: "rice", name: "Рис сырой", gPerCup: 185 },
    { id: "salt", name: "Соль поваренная", gPerCup: 292 },
    { id: "honey", name: "Мёд", gPerCup: 340 },
    { id: "cocoa", name: "Какао-порошок", gPerCup: 100 },
    { id: "sourcream", name: "Сметана", gPerCup: 230 },
    { id: "oats", name: "Овсяные хлопья", gPerCup: 90 }
  ];

  var COOK_UNITS = {
    g: { id: "g", name: "граммы", toMl: null },
    tbsp: { id: "tbsp", name: "столовые ложки", toMl: C.TBSP_ML },
    tsp: { id: "tsp", name: "чайные ложки", toMl: C.TSP_ML },
    cup: { id: "cup", name: "чашки", toMl: C.CUP_ML }
  };

  function densityGPerMl(ingredient) {
    return ingredient.gPerCup / C.CUP_ML;
  }

  function cookToGrams(value, unitId, ingredient) {
    if (unitId === "g") return value;
    var unit = COOK_UNITS[unitId];
    var ml = value * unit.toMl;
    return ml * densityGPerMl(ingredient);
  }

  function gramsToCook(grams, unitId, ingredient) {
    if (unitId === "g") return grams;
    var unit = COOK_UNITS[unitId];
    var ml = grams / densityGPerMl(ingredient);
    return ml / unit.toMl;
  }

  function cookConvert(value, fromId, toId, ingredient) {
    return gramsToCook(cookToGrams(value, fromId, ingredient), toId, ingredient);
  }

  function findIngredient(id) {
    for (var i = 0; i < INGREDIENTS.length; i++) {
      if (INGREDIENTS[i].id === id) return INGREDIENTS[i];
    }
    return INGREDIENTS[0];
  }

  function miToKm(mi) { return mi * C.MI_TO_KM; }
  function kmToMi(km) { return km / C.MI_TO_KM; }
  function lbToKg(lb) { return lb * C.LB_TO_KG; }
  function kgToLb(kg) { return kg / C.LB_TO_KG; }
  function cToF(c) { return (c * 9) / 5 + 32; }
  function fToC(f) { return ((f - 32) * 5) / 9; }
  function usGalToL(gal) { return gal * C.US_GAL_TO_L; }
  function lToUsGal(l) { return l / C.US_GAL_TO_L; }
  function inToCm(inches) { return inches * C.IN_TO_CM; }
  function cmToIn(cm) { return cm / C.IN_TO_CM; }
  function ftToM(ft) { return ft * C.FT_TO_M; }
  function mToFt(m) { return m / C.FT_TO_M; }
  function ozToG(oz) { return oz * C.OZ_TO_G; }
  function gToOz(g) { return g / C.OZ_TO_G; }
  function flozToMl(floz) { return floz * C.US_FLOZ_TO_ML; }
  function mlToFloz(ml) { return ml / C.US_FLOZ_TO_ML; }
  function mphToKmh(mph) { return mph * C.MI_TO_KM; }
  function kmhToMph(kmh) { return kmh / C.MI_TO_KM; }
  function sqftToM2(sqft) { return sqft * C.SQFT_TO_M2; }
  function m2ToSqft(m2) { return m2 / C.SQFT_TO_M2; }
  function acreToHa(acre) { return (acre * C.ACRE_TO_M2) / C.HA_TO_M2; }
  function haToAcre(ha) { return (ha * C.HA_TO_M2) / C.ACRE_TO_M2; }
  function ydToM(yd) { return yd * C.YD_TO_M; }
  function mToYd(m) { return m / C.YD_TO_M; }
  function hpToKw(hp) { return hp * C.METRIC_HP_TO_KW; }
  function kwToHp(kw) { return kw / C.METRIC_HP_TO_KW; }
  function kcalToKj(kcal) { return kcal * C.KCAL_TO_KJ; }
  function kjToKcal(kj) { return kj / C.KCAL_TO_KJ; }
  function atmToPsi(atm) { return atm * C.ATM_TO_PSI; }
  function psiToAtm(psi) { return psi / C.ATM_TO_PSI; }
  function barToPsi(bar) { return bar * C.BAR_TO_PSI; }
  function psiToBar(psi) { return psi / C.BAR_TO_PSI; }
  function atmToBar(atm) { return atm * C.ATM_TO_BAR; }
  function barToAtm(bar) { return bar / C.ATM_TO_BAR; }
  function l100kmToMpg(l) { return l === 0 ? Infinity : C.L100KM_TO_MPG / l; }
  function mpgToL100km(mpg) { return mpg === 0 ? Infinity : C.L100KM_TO_MPG / mpg; }
  function stoneToKg(st) { return st * C.STONE_TO_KG; }
  function kgToStone(kg) { return kg / C.STONE_TO_KG; }

  function hoursToMinutes(h) { return h * 60; }
  function hoursToSeconds(h) { return h * 3600; }
  function minutesToHours(m) { return m / 60; }
  function minutesToSeconds(m) { return m * 60; }
  function secondsToHours(s) { return s / 3600; }
  function secondsToMinutes(s) { return s / 60; }

  /**
   * Байты. base = 1000 (СИ: кБ, МБ, ГБ) или 1024 (IEC: КиБ, МиБ, ГиБ).
   * Единицы: B, KB, MB, GB, TB (множитель = base^n).
   */
  var BYTE_POWERS = { B: 0, KB: 1, MB: 2, GB: 3, TB: 4 };

  function bytesConvert(value, fromUnit, toUnit, base) {
    var fromP = BYTE_POWERS[fromUnit];
    var toP = BYTE_POWERS[toUnit];
    if (fromP == null || toP == null) throw new Error("Unknown byte unit");
    if (base !== 1000 && base !== 1024) throw new Error("Byte base must be 1000 or 1024");
    return value * Math.pow(base, fromP - toP);
  }

  function toBytes(value, unit, base) {
    return bytesConvert(value, unit, "B", base);
  }

  return {
    C: C,
    INGREDIENTS: INGREDIENTS,
    COOK_UNITS: COOK_UNITS,
    densityGPerMl: densityGPerMl,
    findIngredient: findIngredient,
    cookToGrams: cookToGrams,
    gramsToCook: gramsToCook,
    cookConvert: cookConvert,
    miToKm: miToKm,
    kmToMi: kmToMi,
    lbToKg: lbToKg,
    kgToLb: kgToLb,
    cToF: cToF,
    fToC: fToC,
    usGalToL: usGalToL,
    lToUsGal: lToUsGal,
    inToCm: inToCm,
    cmToIn: cmToIn,
    ftToM: ftToM,
    mToFt: mToFt,
    ozToG: ozToG,
    gToOz: gToOz,
    flozToMl: flozToMl,
    mlToFloz: mlToFloz,
    mphToKmh: mphToKmh,
    kmhToMph: kmhToMph,
    sqftToM2: sqftToM2,
    m2ToSqft: m2ToSqft,
    acreToHa: acreToHa,
    haToAcre: haToAcre,
    ydToM: ydToM,
    mToYd: mToYd,
    hpToKw: hpToKw,
    kwToHp: kwToHp,
    kcalToKj: kcalToKj,
    kjToKcal: kjToKcal,
    atmToPsi: atmToPsi,
    psiToAtm: psiToAtm,
    barToPsi: barToPsi,
    psiToBar: psiToBar,
    atmToBar: atmToBar,
    barToAtm: barToAtm,
    l100kmToMpg: l100kmToMpg,
    mpgToL100km: mpgToL100km,
    stoneToKg: stoneToKg,
    kgToStone: kgToStone,
    hoursToMinutes: hoursToMinutes,
    hoursToSeconds: hoursToSeconds,
    minutesToHours: minutesToHours,
    minutesToSeconds: minutesToSeconds,
    secondsToHours: secondsToHours,
    secondsToMinutes: secondsToMinutes,
    BYTE_POWERS: BYTE_POWERS,
    bytesConvert: bytesConvert,
    toBytes: toBytes
  };
});
