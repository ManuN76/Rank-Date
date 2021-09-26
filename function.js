window.function = function (arr, rankItem, des) {
  if (arr == undefined) return undefined;
  if (rankItem == undefined) return undefined;
  des = des.value ?? 0;

  let rkItem = rankItem.value ?? "";
  rkItem = glide2Date(rkItem, "short");

  let sorted = glide2Date([...arr.value], "short");

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
