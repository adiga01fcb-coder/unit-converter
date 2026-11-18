#!/usr/bin/env node
"use strict";

var assert = require("assert");
var U = require("../conversions.js");
var C = U.C;
var failed = 0;
var passed = 0;

function almostEqual(actual, expected, eps, msg) {
  eps = eps == null ? 1e-12 : eps;
  var ok =
    actual === expected ||
    (Number.isFinite(actual) &&
      Number.isFinite(expected) &&
      Math.abs(actual - expected) <= eps) ||
    (actual === Infinity && expected === Infinity);
  if (!ok) {
    failed += 1;
    console.error("FAIL:", msg || "", "\n  actual  :", actual, "\n  expected:", expected);
  } else {
    passed += 1;
  }
}

function exact(actual, expected, msg) {
  try {
    assert.strictEqual(actual, expected);
    passed += 1;
  } catch (e) {
    failed += 1;
    console.error("FAIL:", msg || e.message, "\n  actual  :", actual, "\n  expected:", expected);
  }
}

// --- Required textbook values ---
exact(U.miToKm(1), 1.609344, "1 mi = 1.609344 km");
exact(U.lbToKg(1), 0.45359237, "1 lb = 0.45359237 kg");
exact(U.cToF(100), 212, "100°C = 212°F");
exact(U.cToF(0), 32, "0°C = 32°F");
exact(U.cToF(-40), -40, "-40°C = -40°F");
exact(U.fToC(212), 100, "212°F = 100°C");
exact(U.usGalToL(1), 3.785411784, "1 US gal = 3.785411784 L");

// --- Inverse / identity ---
almostEqual(U.kmToMi(1.609344), 1, 1e-15, "km→mi inverse");
almostEqual(U.kgToLb(0.45359237), 1, 1e-15, "kg→lb inverse");
almostEqual(U.lToUsGal(3.785411784), 1, 1e-15, "L→gal inverse");

// --- Length ---
exact(U.inToCm(1), 2.54, "1 in = 2.54 cm");
exact(U.cmToIn(2.54), 1, "2.54 cm = 1 in");
exact(U.ftToM(1), 0.3048, "1 ft = 0.3048 m");
exact(U.ydToM(1), 0.9144, "1 yd = 0.9144 m");
almostEqual(U.ydToM(1), 3 * U.ftToM(1), 1e-15, "1 yd = 3 ft");
almostEqual(U.mToFt(0.3048), 1, 1e-15, "m→ft inverse");
almostEqual(U.mToYd(0.9144), 1, 1e-15, "m→yd inverse");

// --- Mass ---
exact(U.ozToG(1), 28.349523125, "1 oz = 28.349523125 g");
exact(U.ozToG(16), U.lbToKg(1) * 1000, "16 oz = 1 lb");
exact(U.stoneToKg(1), 6.35029318, "1 st = 6.35029318 kg");
exact(U.stoneToKg(1), 14 * U.lbToKg(1), "1 st = 14 lb");
almostEqual(U.gToOz(28.349523125), 1, 1e-15, "g→oz inverse");
almostEqual(U.kgToStone(6.35029318), 1, 1e-15, "kg→st inverse");

// --- Volume ---
almostEqual(U.flozToMl(1), 29.5735295625, 1e-15, "1 US fl oz = 29.5735295625 ml");
exact(U.flozToMl(128), U.usGalToL(1) * 1000, "128 fl oz = 1 US gal");
almostEqual(U.mlToFloz(29.5735295625), 1, 1e-12, "ml→fl oz inverse");

// --- Speed ---
exact(U.mphToKmh(1), 1.609344, "1 mph = 1.609344 km/h");
almostEqual(U.kmhToMph(100), 100 / 1.609344, 1e-15, "100 km/h in mph");

// --- Area ---
exact(U.sqftToM2(1), 0.09290304, "1 sq ft = 0.09290304 m²");
exact(U.sqftToM2(1), 0.3048 * 0.3048, "1 sq ft = (0.3048 m)²");
almostEqual(U.acreToHa(1), 0.40468564224, 1e-15, "1 acre = 0.40468564224 ha");
almostEqual(U.haToAcre(1), 10000 / 4046.8564224, 1e-15, "1 ha in acres");
exact(U.acreToHa(1) * 10000, 43560 * 0.09290304, "acre via 43560 sq ft");

// --- Power (metric hp / л.с.) ---
exact(U.hpToKw(1), 0.73549875, "1 metric hp = 0.73549875 kW");
almostEqual(U.kwToHp(1), 1 / 0.73549875, 1e-15, "1 kW in metric hp");

// --- Energy (food kcal) ---
exact(U.kcalToKj(1), 4.184, "1 kcal = 4.184 kJ");
almostEqual(U.kjToKcal(418.4), 100, 1e-12, "418.4 kJ = 100 kcal");

// --- Pressure ---
almostEqual(U.atmToBar(1), 1.01325, 1e-15, "1 atm = 1.01325 bar");
almostEqual(C.PSI_PA, (0.45359237 * 9.80665) / (0.0254 * 0.0254), 1e-12, "psi definition");
almostEqual(U.atmToPsi(1), 101325 / C.PSI_PA, 1e-12, "1 atm in psi");
almostEqual(U.barToPsi(1), 100000 / C.PSI_PA, 1e-12, "1 bar in psi");
almostEqual(U.psiToAtm(U.atmToPsi(2.5)), 2.5, 1e-12, "atm↔psi roundtrip");
almostEqual(U.psiToBar(U.barToPsi(3)), 3, 1e-12, "bar↔psi roundtrip");
almostEqual(U.barToAtm(U.atmToBar(1)), 1, 1e-15, "atm↔bar roundtrip");
// well-known rounded checks
almostEqual(U.atmToPsi(1), 14.6959487755134, 1e-10, "1 atm ≈ 14.6959 psi");
almostEqual(U.barToPsi(1), 14.503773773, 1e-9, "1 bar ≈ 14.5038 psi");

// --- Fuel economy ---
almostEqual(C.L100KM_TO_MPG, (100 * 3.785411784) / 1.609344, 0, "mpg factor exact formula");
almostEqual(U.l100kmToMpg(1), C.L100KM_TO_MPG, 0, "1 L/100 km in mpg");
almostEqual(U.l100kmToMpg(10), C.L100KM_TO_MPG / 10, 1e-12, "10 L/100 km in mpg");
almostEqual(U.mpgToL100km(U.l100kmToMpg(7.5)), 7.5, 1e-12, "L/100km↔mpg roundtrip");
exact(U.l100kmToMpg(0), Infinity, "0 L/100 km is Infinity mpg");

// --- Time ---
exact(U.hoursToMinutes(1), 60, "1 h = 60 min");
exact(U.hoursToSeconds(1), 3600, "1 h = 3600 s");
exact(U.minutesToSeconds(1), 60, "1 min = 60 s");
exact(U.minutesToHours(90), 1.5, "90 min = 1.5 h");
exact(U.secondsToHours(7200), 2, "7200 s = 2 h");
exact(U.secondsToMinutes(90), 1.5, "90 s = 1.5 min");

// --- Bytes ---
exact(U.bytesConvert(1, "KB", "B", 1000), 1000, "1 KB SI = 1000 B");
exact(U.bytesConvert(1, "KB", "B", 1024), 1024, "1 KiB = 1024 B");
exact(U.bytesConvert(1, "MB", "B", 1000), 1000000, "1 MB SI = 1e6 B");
exact(U.bytesConvert(1, "MB", "B", 1024), 1048576, "1 MiB = 2^20 B");
exact(U.bytesConvert(1, "GB", "B", 1000), 1000000000, "1 GB SI = 1e9 B");
exact(U.bytesConvert(1, "GB", "B", 1024), 1073741824, "1 GiB = 2^30 B");
exact(U.bytesConvert(1, "TB", "GB", 1000), 1000, "1 TB SI = 1000 GB");
exact(U.bytesConvert(1, "TB", "GB", 1024), 1024, "1 TiB = 1024 GiB");
almostEqual(U.bytesConvert(2048, "KB", "MB", 1024), 2, 1e-15, "2048 KiB = 2 MiB");
almostEqual(U.bytesConvert(U.bytesConvert(3.5, "GB", "MB", 1000), "MB", "GB", 1000), 3.5, 1e-12, "bytes SI roundtrip");

// --- Cooking: water 1:1 with ml ---
var water = U.findIngredient("water");
exact(U.densityGPerMl(water), 1, "water density 1 g/ml");
exact(U.cookConvert(1, "tbsp", "g", water), 15, "1 tbsp water = 15 g");
exact(U.cookConvert(1, "tsp", "g", water), 5, "1 tsp water = 5 g");
exact(U.cookConvert(1, "cup", "g", water), 240, "1 cup water = 240 g");
exact(U.cookConvert(240, "g", "cup", water), 1, "240 g water = 1 cup");
exact(U.cookConvert(1, "tbsp", "tsp", water), 3, "1 tbsp = 3 tsp");
exact(U.cookConvert(1, "cup", "tbsp", water), 16, "1 cup = 16 tbsp (240/15)");

var flour = U.findIngredient("flour");
almostEqual(U.densityGPerMl(flour), 125 / 240, 0, "flour 125 g / 240 ml");
almostEqual(U.cookConvert(1, "cup", "g", flour), 125, 1e-12, "1 cup flour = 125 g");
almostEqual(U.cookConvert(1, "tbsp", "g", flour), 125 / 16, 1e-12, "1 tbsp flour = 125/16 g");

var butter = U.findIngredient("butter");
exact(U.cookConvert(1, "cup", "g", butter), 227, "1 cup butter = 227 g");
var sugar = U.findIngredient("sugar");
exact(U.cookConvert(1, "cup", "g", sugar), 200, "1 cup sugar = 200 g");
var rice = U.findIngredient("rice");
exact(U.cookConvert(1, "cup", "g", rice), 185, "1 cup rice = 185 g");

// roundtrip cooking
almostEqual(U.cookConvert(U.cookConvert(37, "g", "tsp", flour), "tsp", "g", flour), 37, 1e-12, "flour g↔tsp roundtrip");

// all ingredients listed
exact(U.INGREDIENTS.length, 13, "13 ingredients");
["water", "flour", "sugar", "butter", "rice"].forEach(function (id) {
  exact(!!U.findIngredient(id), true, "ingredient " + id + " exists");
});

console.log("Passed: " + passed + ", failed: " + failed);
if (failed) process.exit(1);
console.log("All conversion tests passed.");
