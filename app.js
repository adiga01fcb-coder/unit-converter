(function () {
  "use strict";

  var U = window.UnitConv;
  if (!U) return;

  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s+/g, "").replace(",", ".");
    if (s === "" || s === "+" || s === "-" || s === "." || s === "-." || s === "+.") return NaN;
    var n = Number(s);
    return n;
  }

  function formatNum(n) {
    if (n === Infinity || n === -Infinity) return "∞";
    if (!Number.isFinite(n)) return "";
    if (n === 0) return "0";
    var abs = Math.abs(n);
    if (abs >= 1e12 || (abs < 1e-7 && abs > 0)) {
      return n.toExponential(6).replace(".", ",").replace("e+", "×10^").replace("e-", "×10^-");
    }
    var digits;
    if (abs >= 10000) digits = 4;
    else if (abs >= 100) digits = 6;
    else if (abs >= 1) digits = 8;
    else digits = 10;
    var rounded = Number(n.toPrecision(12));
    return rounded.toLocaleString("ru-RU", {
      maximumFractionDigits: digits,
      useGrouping: true
    });
  }

  function formatDensity(n) {
    return Number(n).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
      useGrouping: false
    });
  }

  /* ---------- Pair converters ---------- */

  var PAIRS = {
    "mi-km": {
      aName: "Мили",
      bName: "Километры",
      aToB: U.miToKm,
      bToA: U.kmToMi,
      defaultA: 1,
      quick: [1, 5, 10, 26.2, 100]
    },
    "lb-kg": {
      aName: "Фунты",
      bName: "Килограммы",
      aToB: U.lbToKg,
      bToA: U.kgToLb,
      defaultA: 1,
      quick: [1, 5, 10, 150, 200]
    },
    "c-f": {
      aName: "°C",
      bName: "°F",
      aToB: U.cToF,
      bToA: U.fToC,
      defaultA: 100,
      quick: [-40, 0, 20, 36.6, 100]
    },
    "l-gal": {
      aName: "Литры",
      bName: "Галлоны (США)",
      aToB: U.lToUsGal,
      bToA: U.usGalToL,
      defaultA: 1,
      quick: [1, 3.785411784, 5, 10, 50]
    },
    "in-cm": {
      aName: "Дюймы",
      bName: "Сантиметры",
      aToB: U.inToCm,
      bToA: U.cmToIn,
      defaultA: 1,
      quick: [1, 12, 16, 32, 100]
    },
    "ft-m": {
      aName: "Футы",
      bName: "Метры",
      aToB: U.ftToM,
      bToA: U.mToFt,
      defaultA: 1,
      quick: [1, 6, 10, 100, 5280]
    },
    "oz-g": {
      aName: "Унции",
      bName: "Граммы",
      aToB: U.ozToG,
      bToA: U.gToOz,
      defaultA: 1,
      quick: [1, 8, 16, 32, 100]
    },
    "ml-floz": {
      aName: "Миллилитры",
      bName: "Жидкие унции (США)",
      aToB: U.mlToFloz,
      bToA: U.flozToMl,
      defaultA: 100,
      quick: [30, 100, 250, 500, 1000]
    },
    "kmh-mph": {
      aName: "Км/ч",
      bName: "Миль/ч",
      aToB: U.kmhToMph,
      bToA: U.mphToKmh,
      defaultA: 100,
      quick: [30, 60, 100, 120, 200]
    },
    "m2-sqft": {
      aName: "Кв. метры",
      bName: "Кв. футы",
      aToB: U.m2ToSqft,
      bToA: U.sqftToM2,
      defaultA: 1,
      quick: [1, 10, 50, 100, 1000]
    },
    "ha-acre": {
      aName: "Гектары",
      bName: "Акры",
      aToB: U.haToAcre,
      bToA: U.acreToHa,
      defaultA: 1,
      quick: [0.5, 1, 5, 10, 100]
    },
    "yd-m": {
      aName: "Ярды",
      bName: "Метры",
      aToB: U.ydToM,
      bToA: U.mToYd,
      defaultA: 1,
      quick: [1, 10, 100, 1000]
    },
    "kw-hp": {
      aName: "Киловатты",
      bName: "Л.с. (метрические)",
      aToB: U.kwToHp,
      bToA: U.hpToKw,
      defaultA: 1,
      quick: [0.73549875, 1, 50, 100, 150]
    },
    "kcal-kj": {
      aName: "Килокалории",
      bName: "Килоджоули",
      aToB: U.kcalToKj,
      bToA: U.kjToKcal,
      defaultA: 100,
      quick: [1, 100, 250, 500, 2000]
    },
    "l100-mpg": {
      aName: "Л/100 км",
      bName: "mpg (США)",
      aToB: U.l100kmToMpg,
      bToA: U.mpgToL100km,
      defaultA: 8,
      quick: [4, 6, 8, 10, 12]
    },
    "st-kg": {
      aName: "Стоуны",
      bName: "Килограммы",
      aToB: U.stoneToKg,
      bToA: U.kgToStone,
      defaultA: 1,
      quick: [1, 8, 10, 12, 15]
    }
  };

  function bindPair(section) {
    var id = section.getAttribute("data-pair");
    var cfg = PAIRS[id];
    if (!cfg) return;
    var inputA = section.querySelector('[data-end="a"]');
    var inputB = section.querySelector('[data-end="b"]');
    var labelA = section.querySelector('[data-label="a"]');
    var labelB = section.querySelector('[data-label="b"]');
    var swapBtn = section.querySelector(".swap");
    var tbody = section.querySelector("[data-quick]");
    var flipped = false;

    function names() {
      return flipped
        ? { a: cfg.bName, b: cfg.aName, aToB: cfg.bToA, bToA: cfg.aToB }
        : { a: cfg.aName, b: cfg.bName, aToB: cfg.aToB, bToA: cfg.bToA };
    }

    function renderLabels() {
      var n = names();
      labelA.textContent = n.a;
      labelB.textContent = n.b;
      renderQuick();
    }

    function renderQuick() {
      if (!tbody) return;
      var n = names();
      var ha = section.querySelector("[data-quick-a]");
      var hb = section.querySelector("[data-quick-b]");
      if (ha) ha.textContent = n.a;
      if (hb) hb.textContent = n.b;
      tbody.innerHTML = "";
      cfg.quick.forEach(function (valA) {
        var left = flipped ? cfg.aToB(valA) : valA;
        var right = n.aToB(left);
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatNum(left) + "</td><td>" + formatNum(right) + "</td>";
        tr.addEventListener("click", function () {
          inputA.value = formatNum(left);
          inputB.value = formatNum(right);
        });
        tbody.appendChild(tr);
      });
    }

    function fromA() {
      var v = parseNum(inputA.value);
      if (!Number.isFinite(v)) {
        if (inputA.value.trim() === "") inputB.value = "";
        return;
      }
      inputB.value = formatNum(names().aToB(v));
    }

    function fromB() {
      var v = parseNum(inputB.value);
      if (!Number.isFinite(v)) {
        if (inputB.value.trim() === "") inputA.value = "";
        return;
      }
      inputA.value = formatNum(names().bToA(v));
    }

    inputA.addEventListener("input", fromA);
    inputB.addEventListener("input", fromB);

    swapBtn.addEventListener("click", function () {
      var va = inputA.value;
      inputA.value = inputB.value;
      inputB.value = va;
      flipped = !flipped;
      renderLabels();
    });

    renderLabels();
    inputA.value = formatNum(cfg.defaultA);
    fromA();
  }

  /* ---------- Cooking ---------- */

  function bindCooking(section) {
    var ingredientSel = section.querySelector("[data-ingredient]");
    var fromUnit = section.querySelector("[data-from-unit]");
    var toUnit = section.querySelector("[data-to-unit]");
    var inputA = section.querySelector('[data-end="a"]');
    var inputB = section.querySelector('[data-end="b"]');
    var swapBtn = section.querySelector(".swap");
    var densNote = section.querySelector("[data-density-note]");
    var tbody = section.querySelector("[data-quick]");

    U.INGREDIENTS.forEach(function (ing) {
      var opt = document.createElement("option");
      opt.value = ing.id;
      opt.textContent = ing.name;
      ingredientSel.appendChild(opt);
    });
    ingredientSel.value = "flour";

    function fillUnits(sel, value) {
      sel.innerHTML = "";
      Object.keys(U.COOK_UNITS).forEach(function (id) {
        var opt = document.createElement("option");
        opt.value = id;
        opt.textContent = U.COOK_UNITS[id].name;
        sel.appendChild(opt);
      });
      sel.value = value;
    }
    fillUnits(fromUnit, "g");
    fillUnits(toUnit, "tbsp");

    function ingredient() {
      return U.findIngredient(ingredientSel.value);
    }

    function updateNote() {
      var ing = ingredient();
      var d = U.densityGPerMl(ing);
      densNote.textContent =
        ing.name +
        ": " +
        formatNum(ing.gPerCup) +
        " г на чашку 240 мл (" +
        formatDensity(d) +
        " г/мл). Столовая ложка = 15 мл, чайная = 5 мл.";
    }

    function fromA() {
      var ing = ingredient();
      var va = parseNum(inputA.value);
      if (Number.isFinite(va)) {
        inputB.value = formatNum(U.cookConvert(va, fromUnit.value, toUnit.value, ing));
      } else if (inputA.value.trim() === "") {
        inputB.value = "";
      }
    }

    function fromB() {
      var ing = ingredient();
      var vb = parseNum(inputB.value);
      if (Number.isFinite(vb)) {
        inputA.value = formatNum(U.cookConvert(vb, toUnit.value, fromUnit.value, ing));
      } else if (inputB.value.trim() === "") {
        inputA.value = "";
      }
    }

    function renderQuick() {
      var ing = ingredient();
      var grams = [5, 15, 50, 100, 125, 200, 240];
      tbody.innerHTML = "";
      grams.forEach(function (g) {
        var tbsp = U.cookConvert(g, "g", "tbsp", ing);
        var tsp = U.cookConvert(g, "g", "tsp", ing);
        var cup = U.cookConvert(g, "g", "cup", ing);
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatNum(g) + "</td><td>" +
          formatNum(tbsp) + "</td><td>" +
          formatNum(tsp) + "</td><td>" +
          formatNum(cup) + "</td>";
        tr.addEventListener("click", function () {
          fromUnit.value = "g";
          toUnit.value = "tbsp";
          inputA.value = formatNum(g);
          fromA();
        });
        tbody.appendChild(tr);
      });
    }

    function refreshFromA() {
      updateNote();
      fromA();
      renderQuick();
    }

    ingredientSel.addEventListener("change", refreshFromA);
    fromUnit.addEventListener("change", refreshFromA);
    toUnit.addEventListener("change", refreshFromA);
    inputA.addEventListener("input", fromA);
    inputB.addEventListener("input", fromB);
    swapBtn.addEventListener("click", function () {
      var fu = fromUnit.value;
      fromUnit.value = toUnit.value;
      toUnit.value = fu;
      var va = inputA.value;
      inputA.value = inputB.value;
      inputB.value = va;
    });

    inputA.value = "100";
    refreshFromA();
  }

  /* ---------- Bytes ---------- */

  function bindBytes(section) {
    var inputA = section.querySelector('[data-end="a"]');
    var inputB = section.querySelector('[data-end="b"]');
    var unitA = section.querySelector("[data-from-unit]");
    var unitB = section.querySelector("[data-to-unit]");
    var baseBtns = section.querySelectorAll("[data-base]");
    var swapBtn = section.querySelector(".swap");
    var tbody = section.querySelector("[data-quick]");
    var note = section.querySelector("[data-base-note]");
    var base = 1000;

    var units = [
      { id: "B", si: "байты (Б)", iec: "байты (Б)" },
      { id: "KB", si: "килобайты (КБ, 1000)", iec: "кибибайты (КиБ, 1024)" },
      { id: "MB", si: "мегабайты (МБ, 1000)", iec: "мебибайты (МиБ, 1024)" },
      { id: "GB", si: "гигабайты (ГБ, 1000)", iec: "гибибайты (ГиБ, 1024)" },
      { id: "TB", si: "терабайты (ТБ, 1000)", iec: "тебибайты (ТиБ, 1024)" }
    ];

    function relabelUnits() {
      [unitA, unitB].forEach(function (sel) {
        var current = sel.value || (sel === unitA ? "MB" : "GB");
        sel.innerHTML = "";
        units.forEach(function (u) {
          var opt = document.createElement("option");
          opt.value = u.id;
          opt.textContent = base === 1000 ? u.si : u.iec;
          sel.appendChild(opt);
        });
        sel.value = current;
      });
      note.textContent =
        base === 1000
          ? "Сейчас используется десятичная система СИ: 1 КБ = 1000 байт, 1 МБ = 1000 КБ, 1 ГБ = 1000 МБ."
          : "Сейчас используется двоичная система IEC: 1 КиБ = 1024 байта, 1 МиБ = 1024 КиБ, 1 ГиБ = 1024 МиБ.";
    }

    function fromA() {
      var v = parseNum(inputA.value);
      if (!Number.isFinite(v)) {
        if (inputA.value.trim() === "") inputB.value = "";
        return;
      }
      inputB.value = formatNum(U.bytesConvert(v, unitA.value, unitB.value, base));
    }

    function fromB() {
      var v = parseNum(inputB.value);
      if (!Number.isFinite(v)) {
        if (inputB.value.trim() === "") inputA.value = "";
        return;
      }
      inputA.value = formatNum(U.bytesConvert(v, unitB.value, unitA.value, base));
    }

    function renderQuick() {
      var samples = [
        [1, "KB"],
        [1, "MB"],
        [1, "GB"],
        [700, "MB"],
        [4.7, "GB"]
      ];
      tbody.innerHTML = "";
      samples.forEach(function (s) {
        var toB = U.bytesConvert(s[0], s[1], "B", base);
        var toMB = U.bytesConvert(s[0], s[1], "MB", base);
        var toGB = U.bytesConvert(s[0], s[1], "GB", base);
        var label = units.filter(function (u) { return u.id === s[1]; })[0];
        var name = base === 1000 ? label.si : label.iec;
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + formatNum(s[0]) + " " + name.split(" ")[0] + "</td><td>" +
          formatNum(toB) + "</td><td>" +
          formatNum(toMB) + "</td><td>" +
          formatNum(toGB) + "</td>";
        tr.addEventListener("click", function () {
          unitA.value = s[1];
          unitB.value = "B";
          inputA.value = formatNum(s[0]);
          fromA();
        });
        tbody.appendChild(tr);
      });
    }

    function refresh() {
      baseBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", String(Number(b.getAttribute("data-base")) === base));
      });
      relabelUnits();
      fromA();
      renderQuick();
    }

    baseBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        base = Number(btn.getAttribute("data-base"));
        refresh();
      });
    });
    unitA.addEventListener("change", fromA);
    unitB.addEventListener("change", fromA);
    inputA.addEventListener("input", fromA);
    inputB.addEventListener("input", fromB);
    swapBtn.addEventListener("click", function () {
      var u = unitA.value;
      unitA.value = unitB.value;
      unitB.value = u;
      var va = inputA.value;
      inputA.value = inputB.value;
      inputB.value = va;
    });

    relabelUnits();
    unitA.value = "MB";
    unitB.value = "GB";
    inputA.value = "1024";
    refresh();
  }

  /* ---------- Pressure: atm / bar / psi ---------- */

  function bindPressure(section) {
    var atm = section.querySelector("[data-atm]");
    var bar = section.querySelector("[data-bar]");
    var psi = section.querySelector("[data-psi]");
    var tbody = section.querySelector("[data-quick]");
    var lock = false;

    function fill(source, atmVal) {
      if (lock) return;
      lock = true;
      if (source !== atm) atm.value = formatNum(atmVal);
      if (source !== bar) bar.value = formatNum(U.atmToBar(atmVal));
      if (source !== psi) psi.value = formatNum(U.atmToPsi(atmVal));
      lock = false;
    }

    atm.addEventListener("input", function () {
      var v = parseNum(atm.value);
      if (Number.isFinite(v)) fill(atm, v);
    });
    bar.addEventListener("input", function () {
      var v = parseNum(bar.value);
      if (Number.isFinite(v)) fill(bar, U.barToAtm(v));
    });
    psi.addEventListener("input", function () {
      var v = parseNum(psi.value);
      if (Number.isFinite(v)) fill(psi, U.psiToAtm(v));
    });

    var samples = [0.5, 1, 2, 5, 10];
    tbody.innerHTML = "";
    samples.forEach(function (a) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + formatNum(a) + "</td><td>" +
        formatNum(U.atmToBar(a)) + "</td><td>" +
        formatNum(U.atmToPsi(a)) + "</td>";
      tr.addEventListener("click", function () {
        fill(null, a);
      });
      tbody.appendChild(tr);
    });

    fill(null, 1);
  }

  /* ---------- Time: h / min / s ---------- */

  function bindTime(section) {
    var h = section.querySelector("[data-hours]");
    var m = section.querySelector("[data-minutes]");
    var s = section.querySelector("[data-seconds]");
    var tbody = section.querySelector("[data-quick]");
    var lock = false;

    function fill(source, hours) {
      if (lock) return;
      lock = true;
      if (source !== h) h.value = formatNum(hours);
      if (source !== m) m.value = formatNum(U.hoursToMinutes(hours));
      if (source !== s) s.value = formatNum(U.hoursToSeconds(hours));
      lock = false;
    }

    h.addEventListener("input", function () {
      var v = parseNum(h.value);
      if (Number.isFinite(v)) fill(h, v);
    });
    m.addEventListener("input", function () {
      var v = parseNum(m.value);
      if (Number.isFinite(v)) fill(m, U.minutesToHours(v));
    });
    s.addEventListener("input", function () {
      var v = parseNum(s.value);
      if (Number.isFinite(v)) fill(s, U.secondsToHours(v));
    });

    var samples = [0.5, 1, 1.5, 2, 24];
    tbody.innerHTML = "";
    samples.forEach(function (hours) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + formatNum(hours) + "</td><td>" +
        formatNum(U.hoursToMinutes(hours)) + "</td><td>" +
        formatNum(U.hoursToSeconds(hours)) + "</td>";
      tr.addEventListener("click", function () { fill(null, hours); });
      tbody.appendChild(tr);
    });

    fill(null, 1);
  }

  function fillDensityTable(table) {
    var tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    U.INGREDIENTS.forEach(function (ing) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + ing.name + "</td><td>" +
        formatNum(ing.gPerCup) + "</td><td>" +
        formatDensity(U.densityGPerMl(ing)) + "</td>";
      tbody.appendChild(tr);
    });
  }

  document.querySelectorAll("[data-pair]").forEach(bindPair);
  var cooking = document.querySelector("[data-kind='cooking']");
  if (cooking) bindCooking(cooking);
  var bytes = document.querySelector("[data-kind='bytes']");
  if (bytes) bindBytes(bytes);
  var pressure = document.querySelector("[data-kind='pressure']");
  if (pressure) bindPressure(pressure);
  var time = document.querySelector("[data-kind='time']");
  if (time) bindTime(time);
  var densTable = document.querySelector("[data-density-table]");
  if (densTable) fillDensityTable(densTable);
})();
