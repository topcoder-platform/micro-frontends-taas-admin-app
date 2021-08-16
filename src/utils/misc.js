import keys from "lodash/keys";
import moment from "moment";
import { formatPlural } from "./formatters";

/**
 * Returns working periods filtered by start date.
 *
 * @param {Array} periods array of working period items that contain startDate
 * @param {string|Object} startDate value denoting start date
 * that can be accepted by momentjs
 * @returns {Array}
 */
export function filterPeriodsByStartDate(periods, startDate) {
  if (!startDate) {
    return periods;
  }
  const items = [];
  startDate = moment(startDate);
  for (let period of periods) {
    if (period.start.isSameOrAfter(startDate, "date")) {
      items.push(period);
    }
  }
  return items;
}

/**
 * Returns the option which matches the provided value or null.
 *
 * @param {{ value: string, label: string }[]} options options object
 * @param {any} value value to search for
 * @returns {?{ value: string, label: string }}
 */
export function getOptionByValue(options, value) {
  for (let i = 0, len = options.length; i < len; i++) {
    let option = options[i];
    if (option.value === value) {
      return option;
    }
  }
  return null;
}

/**
 * Returns the start and end dates of the week for the provided date.
 *
 * @param {Object} date momentjs object denoting the date
 * @returns {Array} array with two objects: [weekStart, weekEnd]
 */
export function getWeekByDate(date) {
  let d = moment(date);
  return [d.startOf("week"), d.clone().endOf("week")];
}

/**
 * Replaces string elements from the specified array using provided map object.
 *
 * @param {string[]} array array of strings
 * @param {Object} map a mapping from string keys to string values
 * @returns {string[]} array containing new string values from map
 */
export function replaceItems(array, map) {
  let result = [];
  for (let str of array) {
    if (str in map) {
      result.push(map[str]);
    }
  }
  return result;
}

export function preventDefault(event) {
  event.preventDefault();
}

/**
 * Stops event propagation.
 *
 * @param {Object} event event object
 */
export function stopPropagation(event) {
  event.stopPropagation();
}

export function stopImmediatePropagation(event) {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
}

/**
 * This function takes keys referring to truthy values in `newOptions`
 * and adds them to `oldOptions` returning a new object.
 *
 * @param {Object} oldOptions object containing key-value pairs with keys
 * mapped to boolean values
 * @param {Object} newOptions object containing key-value pairs with keys
 * mapped to truthy or falsy values
 * @returns {Object} a new updated options object
 */
export function updateOptionMap(oldOptions, newOptions) {
  oldOptions = { ...oldOptions };
  for (let key in newOptions) {
    if (Object.prototype.hasOwnProperty.call(newOptions, key)) {
      let value = newOptions[key];
      if (value) {
        oldOptions[key] = true;
      } else {
        delete oldOptions[key];
      }
    }
  }
  return oldOptions;
}

/**
 * Constructs query string to be sent to API. The provided object must contain
 * valid API query parameter names as keys. Keys that refer to values
 * that are not numbers and are falsy are ignored.
 *
 * @param {Object} params query parameters object
 * @returns {string} query string
 */
export const buildRequestQuery = (params) => {
  const queryParams = [];
  for (const paramName in params) {
    const paramValue = params[paramName];
    if (
      !(paramName in params) ||
      (!paramValue && typeof paramValue !== "number")
    ) {
      continue;
    }
    if (Array.isArray(paramValue)) {
      if (paramValue.length) {
        queryParams.push(`${paramName}=${paramValue.join(",")}`);
      }
    } else {
      queryParams.push(`${paramName}=${paramValue}`);
    }
  }
  return queryParams.join("&");
};

/**
 * Function that returns a promise which resolves after the provided delay.
 *
 * @param {number} ms number of milliseconds
 * @returns {Promise}
 */
export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const extractResponsePagination = ({ headers }) => ({
  totalCount: +headers["x-total"] || 0,
  pageCount: +headers["x-total-pages"] || 0,
  pageNumber: +headers["x-page"] || 1,
  pageSize: +headers["x-per-page"] || 10,
});

export const extractJobName = (data) => data.title;

export const extractResponseData = (response) => response.data;

export const hasKey = (obj) => {
  for (let key in obj) {
    return true;
  }
  return false;
};

export const increment = (value) => value + 1;

export const negate = (value) => !value;

export const noop = () => {};

/**
 * Converts a human-readable time string to hours.
 * E.g.
 * "2 weeks" => 336
 * "3 days" => 72
 *
 * @param {string} timeStr human-readable time (e.g. "1 weeks", "2 hours", "2 weeks 3 days")
 * @return {Number} the time in hours
 */
export const humanReadableTimeToHours = (timeStr) => {
  // units with corresponding hours
  const units = {
    hour: 1,
    day: 24,
    week: 7 * 24,
    month: 30 * 24,
  };

  let timeHrs = 0;
  const tokens = timeStr.toLowerCase().split(" ");
  keys(units).forEach((u) => {
    const tokenIdx = tokens.findIndex((token) => token.includes(u));
    if (tokenIdx > 0) {
      const unitHrs = units[u];
      const tokenTimeMs = +tokens[tokenIdx - 1] * unitHrs;
      timeHrs += tokenTimeMs;
    }
  });
  return timeHrs;
};

/**
 * Converts a time (in hours) to human-readable string.
 *
 * @param {Number} timeHrs the time in hours
 * @return {string} human-readable time string ("1 week", "2 weeks 3 days", etc.)
 */
export const hoursToHumanReadableTime = (timeHrs) => {
  // to preserve the order of keys, we need to use array in loop/iterations
  const units = [
    { key: "month", value: 30 * 24 },
    { key: "week", value: 7 * 24 },
    { key: "day", value: 24 },
    { key: "hour", value: 1 },
  ];

  let timeStr = "";
  for (const unit of units) {
    const division = Math.floor(timeHrs / unit.value);
    if (division >= 1) {
      timeStr += timeStr !== "" ? " " : "";
      timeStr += formatPlural(division, unit.key);
    }
    timeHrs -= division * unit.value;
  }
  return timeStr;
};

/**
 * Checks if the provided value is a valid payment amount. It can be a number
 * or a string that can be converted to number.
 *
 * @param {any} value payment amount
 * @returns {boolean}
 */
export function validateAmount(value) {
  let amount = +value;
  return !isNaN(amount) && amount > 0 && amount < 1e5 && !value.endsWith(".");
}
