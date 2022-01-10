export function createRandomId(str) {
  return `${str || ""}-${new Date().getTime()}-${Math.random()}`;
}

export function getRangeValue(val, min, max) {
  if (val === "") {
    return 0;
  }
  let number = parseFloat(val);
  let value = min !== undefined ? Math.max(number, min) : number;
  value = max !== undefined ? Math.min(value, max) : value;

  return value;
}

export function getRgbaObj(rgbaString) {
  let arr = [];
  if (!rgbaString) {
    arr = [255, 255, 255, 1];
  } else {
    let str = "";
    rgbaString.replace(/rgb\w?\((.*?)\)/g, function ($0, $1) {
      str = $1;
    });
    arr = str.split(",").map((i) => i.replace(/\s/g, ""));
  }
  return {
    r: arr[0],
    g: arr[1],
    b: arr[2],
    a: arr[3] == undefined ? 1 : arr[3],
  };
}

export function isColorEqual(color1, color2) {
  return color1.replace(/\s/g, "") === color2.replace(/\s/g, "");
}

export function getConcatValue({
  gradientType,
  linearDeg,
  pointList,
  isLinear,
}) {
  const type = isLinear ? "linear" : gradientType;
  if (!pointList.length) {
    return "";
  }

  return `${type}-gradient(${
    type === "linear" ? `${linearDeg}deg, ` : ""
  }${pointList.map(({ color, distance }) => `${color} ${distance}`)})`;
}

export function parseValue(props) {
  let pointList = [];
  let colorString = props.colorString;
  if (!colorString) {
    return { ...props, pointList: [] };
  }
  let gradientType,
    linearDeg = props.linearDeg;
  let noGradientStr = colorString.replace(
    /^(.*?)-gradient\(([\s\S]*)\)/g,
    function ($0, $1, $2) {
      gradientType = $1;
      return $2;
    }
  );
  if (gradientType === "linear") {
    noGradientStr = noGradientStr.replace(/^(\d+)deg,/g, function ($0, $1) {
      linearDeg = $1;
      return "";
    });
  }

  let list = [];
  noGradientStr.replace(/\s{0,}(rgb.*?\)\s{0,}\d+\%)/g, function ($0, $1) {
    list.push($1);
    return $1;
  });
  pointList = list.map((str) => {
    const obj = {};
    str.replace(/(rgb.*?\))\s{0,}(\d+%)/g, function ($0, $1, $2) {
      obj.color = $1;
      obj.distance = $2;
      obj.id = createRandomId();
    });
    return obj;
  });
  return { pointList, linearDeg, gradientType };
}
