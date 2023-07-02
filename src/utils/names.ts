const getNameFromPath = (path: string) => {
  const name = path.split("\\").pop();

  if (!name) return path;

  if (path.includes(".txt")) {
    return name.split(".txt")[0];
  }

  if (path.includes(".log")) {
    return name.split(".log")[0];
  }

  return path;
};

export default getNameFromPath;
