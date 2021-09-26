window.function = function (arr, format, jl, sep, rankItem, dateonly, des) {
  if (arr == undefined && jl == undefined) return undefined;
  if (rankItem == undefined) return undefined;

  format = format.value ?? "short";
  jl = jl.value ?? "";
  sep = sep.value ?? "|";
  dateonly = dateonly.value ?? 0;
  des = des.value ?? 0;

  // Rank Item
  let rkItem = rankItem.value ?? "";
  rkItem = glide2Date(rkItem, "short");
  if (dateonly) {
    rkItem = new Date(rkItem.toDateString());
  }

  // Array
  if (arr != undefined) {
    arr = [...arr.value];
  } else {
    arr = jl.split(sep);
  }
  let sorted = glide2Date(arr, format);
  if (dateonly) {
    sorted = sorted.map(function (item) {
      return new Date(item.toDateString());
    });
  }

  // Sort
  if (des) {
    // Sort Descending
    sorted.sort((a, b) => b - a);
  } else {
    // Sort Ascending
    sorted.sort((a, b) => a - b);
  }

  // indexOf for Date
  // https://stackoverflow.com/questions/27450867/how-to-correctly-use-javascript-indexof-in-a-date-array
  return sorted.map(Number).indexOf(+rkItem) + 1;
};
