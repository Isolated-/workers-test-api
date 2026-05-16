export default async (data) => {
  if (!data || !data.convert) {
    throw { message: `missing "convert" in body or query` };
  }

  if (typeof data.convert === "string") {
    try {
      const json = JSON.parse(data.convert);
      return json;
    } catch (error) {
      throw { message: "invalid json provided" };
    }
  }

  return JSON.stringify(data.convert);
};
