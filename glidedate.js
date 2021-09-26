/********************************************************************
 * Date Test
 *
 * Conversion according to local settings
 *
 * function : glide2Date, date2Glide, isValidDate
 *
 * ------------------------------------------------------------------
 * Converting Glide to a JS Date object
 * return object Date JS
 * the glideDateallformat parameter must match the format used in
 * the array
 * ' example : type "date-time"
 *    let x = glide2Date(date, "short");
 * ' example : type { "kind": "array", "items": "string" }
 *    if (arrDate != undefined) {
 *      arrDate = arrDate.map(dt => {
 *        return glide2Date(dt, glideDateallformat);
 *      })
 *    }
 *
 * glide2Date (dt,format)
 *  dt : date received by glide
 *  format : short, medium, long
 *
 * ------------------------------------------------------------------
 * Converting a JS Date object to Glide
 * return object Date JS
 * ' use in driver.js for arrays
 *
 * date2Glide (dt, format)
 *  dt : object date (js)
 *  format : short, medium, long
 *
 * date2GlideDateOnly (dt, format)
 *  dt : object date (js)
 *  format : short, medium, long
 *
 * ------------------------------------------------------------------
 *
 * IMPORTANT :
 * - for a complete conversion of an Array String you must fill in the global
 * variable glideDateallformat with the format (short, medium or long).
 * - for a conversion of a Date-Time column, use the 'short' format
 *
 */

// Test if a date object is valid
function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// Conversion string Date or date by glide column to JS Date
function glide2Date(dt, dateformat) {
  // Detect Array & conversion
  if (Array.isArray(dt)) {
    let ret = dt.map(function (item) {
      return glide2Date(item, dateformat);
    });
    return ret;
  } else {
    return conv(dt, dateformat);
  }

  // conversion
  function conv(dt, dateformaat) {
    dt = dt.trim();

    // Test Date is ISO
    const re = new RegExp(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
    );
    if (re.exec(dt)) {
      let iso = new Date(dt);
      return new Date(iso.getTime() + iso.getTimezoneOffset() * 60000);
    }

    // Local Date
    let num = defDate[dateformat.toLowerCase()];

    let ne = dt.split(defDate.format[num].separator);

    let dtFormat = "";
    if (dateformat != "time") {
      // Month Selection : Literal or Numeric
      let mth;

      if (defDate.format[num].allformat.month == "numeric") {
        mth = parseInt(ne[defDate.format[num].monthIndex]);
      } else {
        mth =
          defDate.monthLiteral.indexOf(ne[defDate.format[num].monthIndex]) + 1;
      }

      // Format mm/dd/yyyy
      dtFormat =
        mth +
        "/" +
        ne[defDate.format[num].dayIndex] +
        "/" +
        ne[defDate.format[num].yearIndex];
    } else {
      // For Time Format, Date is today !!!
      dtFormat = new Date().toDateString();
    }

    // Add Time
    if (
      defDate.format[num].hourIndex == -1 ||
      defDate.format[num].hourIndex > ne.length - 1
    ) {
      dtFormat += ", 00:00:00";
      glideDateOnly = 1;
    } else {
      glideDateOnly = 0;
      if (defDate.format[num].hourIndex > -1) {
        dtFormat += ", " + ne[defDate.format[num].hourIndex];
      }
      if (defDate.format[num].minuteIndex > -1) {
        dtFormat += ":" + ne[defDate.format[num].minuteIndex];
      }
      if (defDate.format[num].secondIndex > -1) {
        if (Number.isInteger(parseInt(ne[defDate.format[num].secondIndex]))) {
          dtFormat += ":" + ne[defDate.format[num].secondIndex];
        } else {
          dtFormat += ":00";
        }
      }
      if (defDate.format[num].dayperiodIndex > -1) {
        if (defDate.format[num].dayperiodIndex > ne.length - 1)
          defDate.format[num].dayperiodIndex -= 1;

        dtFormat += " " + ne[defDate.format[num].dayperiodIndex];
      }
    }
    return new Date(dtFormat);
  }
}

// Conversion JS Date to Glide
function date2Glide(dt, dateformat) {
  let num = defDate[dateformat.toLowerCase()];

  if (glideDateOnly) {
    return new Intl.DateTimeFormat(lang, defDate.format[num].dateformat).format(
      dt
    );
  } else {
    return new Intl.DateTimeFormat(lang, defDate.format[num].allformat).format(
      dt
    );
  }
}

// Conversion JS Date to Glide Date Only
function date2GlideDateOnly(dt, dateformat) {
  let num = defDate[dateformat.toLowerCase()];
  return new Intl.DateTimeFormat(lang, defDate.format[num].dateformat).format(
    dt
  );
}
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

let glideDateallformat = "short";

let glideDateOnly = 0;

let lang = navigator.language;

let defDate = {
  short: 0,
  medium: 1,
  long: 2,
  time: 3,

  format: [
    {
      name: "short",
      allformat: {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
      dateformat: { year: "numeric", month: "numeric", day: "numeric" },
      separator: "",
      dayIndex: -1,
      monthIndex: -1,
      yearIndex: -1,
      hourIndex: -1,
      minuteIndex: -1,
      secondIndex: -1,
      dayperiodIndex: -1,
    },
    {
      name: "medium",
      allformat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
      dateformat: { year: "numeric", month: "long", day: "numeric" },
      separator: "",
      dayIndex: -1,
      monthIndex: -1,
      yearIndex: -1,
      hourIndex: -1,
      minuteIndex: -1,
      secondIndex: -1,
      dayperiodIndex: -1,
    },
    {
      name: "long",
      allformat: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
      dateformat: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
      separator: "",
      dayIndex: -1,
      monthIndex: -1,
      yearIndex: -1,
      hourIndex: -1,
      minuteIndex: -1,
      secondIndex: -1,
      dayperiodIndex: -1,
    },
    {
      name: "time",
      allformat: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
      separator: "",
      dayIndex: -1,
      monthIndex: -1,
      yearIndex: -1,
      hourIndex: -1,
      minuteIndex: -1,
      secondIndex: -1,
      dayperiodIndex: -1,
    },
  ],
  monthLiteral: [],
};

// --------------------------------------
// execute only once at YC initialization
// --------------------------------------

// Month Literal
const dateTest = { month: "long" };
for (let i = 1; i < 13; i++) {
  const dateallformat2 = new Intl.DateTimeFormat(lang, dateTest);
  let fx = dateallformat2.formatToParts(new Date(i + "/1/2021"));
  defDate.monthLiteral.push(fx[0].value);
}

// Short, Medium, Long
for (let num = 0; num < defDate.format.length; num++) {
  const dateallformat1 = new Intl.DateTimeFormat(
    lang,
    defDate.format[num].allformat
  );

  let formats = dateallformat1.formatToParts();

  // separator
  let sep = "";
  for (let b = 0; b < formats.length; b++) {
    if (formats[b].type == "literal") {
      sep += "|" + formats[b].value;
      formats.splice(b, 1);
    }
  }
  sep = "(?:," + sep + ")+";
  var re = new RegExp(sep, "g");
  defDate.format[num].separator = re;

  for (let a = 0; a < formats.length; a++) {
    // Day index
    if (formats[a].type == "day") {
      defDate.format[num].dayIndex = a;
    }

    // Month index
    if (formats[a].type == "month") {
      defDate.format[num].monthIndex = a;
    }

    // Year index
    if (formats[a].type == "year") {
      defDate.format[num].yearIndex = a;
    }

    // Hour index
    if (formats[a].type == "hour") {
      defDate.format[num].hourIndex = a;
    }

    // Minute index
    if (formats[a].type == "minute") {
      defDate.format[num].minuteIndex = a;
    }

    // Second index
    if (formats[a].type == "second") {
      defDate.format[num].secondIndex = a;
    }

    // dayPeriod index
    if (formats[a].type == "dayPeriod") {
      defDate.format[num].dayperiodIndex = a;
    }
  }
}
