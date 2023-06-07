const wpfdJsonParse = (maybeJson) => {
  try {
    return JSON.parse(maybeJson.replace(/%22/g, '"'));
  } catch (error) {
    console.log(error);
    return false;
  }

}

export default wpfdJsonParse;