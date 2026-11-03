"use strict";

// Минимальные объявления для CommonJS без @types/node
declare const require: (id: string) => any;
declare const module: { exports: unknown };

// Импортируемые функции не типизируем (нет .d.ts)
const makeOrdinal = require("./makeOrdinal");
const isFinite = require("./isFinite"); // глобальная isFinite не конфликтует: файл — модуль
const isSafeNumber = require("./isSafeNumber");

const TEN = 10;
const ONE_HUNDRED = 100;
const ONE_THOUSAND = 1000;
const ONE_MILLION = 1000000;
const ONE_BILLION = 1000000000; //         1.000.000.000 (9)
const ONE_TRILLION = 1000000000000; //     1.000.000.000.000 (12)
const ONE_QUADRILLION = 1000000000000000; // 1.000.000.000.000.000 (15)
const MAX = 9007199254740992; // 9.007.199.254.740.992 (15)

const LESS_THAN_TWENTY: readonly string[] = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENTHS_LESS_THAN_HUNDRED: readonly string[] = [
  "zero",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

type NumberLike = number | string;

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param number
 * @param [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns
 */
function toWords(number: NumberLike, asOrdinal?: boolean): string {
  let words: string;
  const num: number = parseInt(String(number), 10);

  if (!isFinite(num)) {
    throw new TypeError(
      "Not a finite number: " + number + " (" + typeof number + ")",
    );
  }
  if (!isSafeNumber(num)) {
    throw new RangeError(
      "Input is not a safe number, it’s either too large or too small.",
    );
  }
  words = generateWords(num);
  return asOrdinal ? makeOrdinal(words) : words;
}

function generateWords(number: number, words?: string[]): string {
  let remainder = 0;
  let word = "";
  let wordsAcc: string[] | undefined = words;

  // We’re done
  if (number === 0) {
    return !wordsAcc ? "zero" : wordsAcc.join(" ").replace(/,$/, "");
  }
  // First run
  if (!wordsAcc) {
    wordsAcc = [];
  }
  // If negative, prepend “minus”
  if (number < 0) {
    wordsAcc.push("minus");
    number = Math.abs(number);
  }

  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number]!;
  } else if (number < ONE_HUNDRED) {
    remainder = number % TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)]!;
    // In case of remainder, we need to handle it here to be able to add the “-”
    if (remainder) {
      word += "-" + LESS_THAN_TWENTY[remainder];
      remainder = 0;
    }
  } else if (number < ONE_THOUSAND) {
    remainder = number % ONE_HUNDRED;
    word = generateWords(Math.floor(number / ONE_HUNDRED)) + " hundred";
  } else if (number < ONE_MILLION) {
    remainder = number % ONE_THOUSAND;
    word = generateWords(Math.floor(number / ONE_THOUSAND)) + " thousand,";
  } else if (number < ONE_BILLION) {
    remainder = number % ONE_MILLION;
    word = generateWords(Math.floor(number / ONE_MILLION)) + " million,";
  } else if (number < ONE_TRILLION) {
    remainder = number % ONE_BILLION;
    word = generateWords(Math.floor(number / ONE_BILLION)) + " billion,";
  } else if (number < ONE_QUADRILLION) {
    remainder = number % ONE_TRILLION;
    word = generateWords(Math.floor(number / ONE_TRILLION)) + " trillion,";
  } else if (number <= MAX) {
    remainder = number % ONE_QUADRILLION;
    word =
      generateWords(Math.floor(number / ONE_QUADRILLION)) + " quadrillion,";
  }

  wordsAcc.push(word);
  return generateWords(remainder, wordsAcc);
}

module.exports = toWords;

export {}; // делаем файл модулем, чтобы не конфликтовать с глобальными именами
