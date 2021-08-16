import moment from "moment";
import isNumber from "lodash/isNumber";
import {
  DATETIME_FORMAT_UI,
  DATE_FORMAT_UI,
  PAYMENT_STATUS_LABELS,
} from "constants/workPeriods";
import {
  PLATFORM_WEBSITE_URL,
  TAAS_BASE_PATH,
  TOPCODER_WEBSITE_URL,
} from "../constants";

const rxWhitespace = /\s+/;

/**
 * Creates a challenge URL using challenge id.
 *
 * @param {string} challengeId challenge id
 * @returns {string}
 */
export function formatChallengeUrl(challengeId) {
  return `${TOPCODER_WEBSITE_URL}/challenges/${challengeId}`;
}

/**
 * Returns formatted date for working period rows.
 *
 * @param {any} date any value accepted by MomentJS
 * @returns {string}
 */
export function formatDate(date) {
  return date ? moment(date).format(DATE_FORMAT_UI) : "-";
}

/**
 * Formats the provided time in UTC-0 as time in local timezone.
 *
 * @param {number} dateTime number of milliseconds since UTC epoch
 * @returns {string}
 */
export function formatDateTimeAsLocal(dateTime) {
  return moment(dateTime).format(DATETIME_FORMAT_UI);
}

/**
 * Returns a string denoting whether the specified start date corresponds to the
 * current period or future period.
 *
 * @param {*} startDate start date
 * @param {*} currentStartDate start date of currently selected period
 * @returns {string}
 */
export function formatDateLabel(startDate, currentStartDate) {
  let start = moment(startDate);
  let currentStart = moment(currentStartDate);
  if (start.isSame(currentStart, "date")) {
    return "Current Period";
  }
  if (start.isAfter(currentStart, "date")) {
    return "Future Period";
  }
  return "";
}

/**
 * Formats working period's date range.
 *
 * @param {number|string} startDate working period start date
 * @param {number|string} endDate working period end date
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
  let start = moment(startDate);
  let end = moment(endDate);
  return `${start.format("DD MMM, YYYY")} to ${end.format("DD MMM, YYYY")}`;
}

/**
 * Formats payment status.
 *
 * @param {string} status payment status as defined by PAYMENT_STATUS enum constant
 * @returns {string}
 */
export function formatPaymentStatus(status) {
  let paymentStatus = PAYMENT_STATUS_LABELS[status];
  if (!paymentStatus) {
    let words = status.split(rxWhitespace);
    for (let i = 0, len = words.length; i < len; i++) {
      let word = words[i];
      words[i] = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    }
    paymentStatus = words.join(" ");
  }
  return paymentStatus;
}

/**
 * Creates the string with the number of items and the word describing the item
 * possibly in plural form.
 *
 * @param {number} count number of items
 * @param {string} baseWord word describing the item
 * @returns {string}
 */
export function formatPlural(count, baseWord) {
  return `${count} ${baseWord}${count > 1 ? "s" : ""}`;
}

/**
 * Returns "is" or "are" for singular/plural phrases.
 *
 * @param {number} count
 * @returns {string} "is" or "are"
 */
export function formatIsAre(count) {
  return count > 1 ? "are" : "is";
}

/**
 * Formats user handle link.
 *
 * @param {number|string} rbProjectId ResourceBooking project id
 * @param {string} rbId ResourceBooking id
 * @returns {string}
 */
export function formatUserHandleLink(rbProjectId, rbId) {
  return `${PLATFORM_WEBSITE_URL}${TAAS_BASE_PATH}/myteams/${rbProjectId}/rb/${rbId}`;
}

/**
 * Formats working period's weekly rate.
 *
 * @param {number} weeklyRate working period's weekly rate
 * @returns {string}
 */
export function formatWeeklyRate(weeklyRate) {
  return isNumber(weeklyRate) ? currencyFormatter.format(weeklyRate) : "-";
}

/**
 * Formats numbers as US dollar sum.
 */
export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
