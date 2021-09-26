function convert(x) {
  if (x instanceof Date) {
    if (isValidDate(x))
      return new Date(
        x.getTime() - x.getTimezoneOffset() * 60000
      ).toISOString();
    else return; // error
  } else if (Array.isArray(x)) {
    return x.map((y) => {
      if (y instanceof Date) {
        if (isValidDate(y)) return date2Glide(y, glideDateTimeFormat);
        else return "error";
      } else return y;
    });
  } else {
    return x;
  }
}

window.addEventListener("message", async function (event) {
  const {
    origin,
    data: { key, params },
  } = event;

  let result;
  let error;
  try {
    result = await window.function(...params);
  } catch (e) {
    result = undefined;
    try {
      error = e.toString();
    } catch (e) {
      error = "Exception can't be stringified.";
    }
  }

  const response = { key };
  if (result !== undefined) {
    result = convert(result);
    response.result = { type: "string", value: result };
  }
  if (error !== undefined) {
    response.error = error;
  }

  event.source.postMessage(response, "*");
});
