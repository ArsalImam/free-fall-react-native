const getAcceleration = (x, y, z) => {
  return Math.sqrt(x * x + y * y + z * z);
};

export default getAcceleration;
