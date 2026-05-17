import crypto from "crypto";

const SUPPORTED_ALGORITHMS = ["sha256", "sha512"];
const SUPPORTED_ENCODING = ["hex", "base64", "base64url"];

export default async (body) => {
  const data = {
    data: body.data,
    hash: body.hash,
    alg: body.alg ?? "sha256",
    encoding: body.encoding ?? "base64",
  };

  if (!SUPPORTED_ALGORITHMS.includes(data.alg)) {
    throw {
      message: `"${data.alg}" is not supported, supported: ${SUPPORTED_ALGORITHMS.join(",")}`,
    };
  }

  if (!SUPPORTED_ENCODING.includes(data.encoding)) {
    throw {
      message: `"${data.encoding}" is not supported, supported: ${SUPPORTED_ENCODING.join(",")}`,
    };
  }

  const compare = crypto
    .createHash(data.alg)
    .update(JSON.stringify(data.data))
    .digest();

  let output = {
    hash: compare.toString(data.encoding),
    alg: data.alg,
    encoding: data.encoding,
  };

  if (data.hash) {
    try {
      output["equal"] = crypto.timingSafeEqual(
        compare,
        Buffer.from(data.hash, data.encoding),
      );
    } catch {
      output["equal"] = false;
    }
  }

  return output;
};
