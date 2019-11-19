const find = (a, b, x, y, w) => {
  const p = quad(a * a + 1, -2 * x + 2 * a * b - 2 * a * y, x * x + y * y - 2 * b * y + b * b - w * w / 4);
  return [{
    x: p[ 0 ],
    y: a * p[ 0 ] + b,
  }, {
    x: p[ 1 ],
    y: a * p[ 1 ] + b,
  }]
}

const quad = (a, b, c) => {
  const delta = (b * b - 4 * a * c)
  if(delta === 0){
    return [-b / (2 * a), -b / (2 * a)];
  } else if(delta < 0){
    return [];
  } else{
    return [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)];
  }
}

export const toRectangle = (x1, y1, x2, y2, w) => {
  if (x1 === x2) {
    return [{
      x: x1 - w / 2,
      y: y1,
    }, {
      x: x1 + w / 2,
      y: y1,
    }, {
      x: x2 + w / 2,
      y: y2,
    }, {
      x: x2 - w / 2,
      y: y2,
    }];
  } else if (y1 === y2) {
    return [{
      x: x1,
      y: y1 - w / 2,
    }, {
      x: x1,
      y: y1 + w / 2,
    }, {
      x: x2,
      y: y2 + w / 2,
    }, {
      x: x2,
      y: y2 - w / 2,
    }];
  } else {
    const a = (-x1 + x2) / (y1 - y2);
    const b1 = y1 - a * x1;
    const b2 = y2 - a * x2;
    const p1 = find(a, b1, x1, y1, w);
    const p2 = find(a, b2, x2, y2, w);
    return [p1[ 0 ], p1[ 1 ], p2[ 1 ], p2[ 0 ]];
  }
};

export const distance = (pos1, pos2) => {
  return (pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y);
};

export const calStraightLine = (pos1, pos2) => {
  if (pos1.x === pos2.x || pos1.y === pos2.y) {
    return pos2;
  }
  const distanceX = Math.abs(pos1.x - pos2.x);
  const distanceY = Math.abs(pos1.y - pos2.y);
  if (Math.abs(Math.atan(distanceY / distanceX)) <= Math.PI / 18) {
    return {
      x: pos2.x,
      y: pos1.y,
    };
  }
  if (Math.abs(Math.atan(distanceX / distanceY)) <= Math.PI / 18) {
    return {
      x: pos1.x,
      y: pos2.y,
    };
  }
  return pos2;
};
