import { createTransport, version } from "@xgsd/workers";
import fastify from "fastify";
import { createWriteStream } from "fs";
import { join } from "path";

const app = fastify();

const toMB = (bytes) => Number((bytes / 1024 / 1024).toFixed(2));

let memoryCount = 0;

const hashTransport = createTransport({
  entry: join(process.cwd(), "app", "hash.js"),
  contractVersion: "v1.1",
  limits: {
    memory: 64,
    ttl: 5000,
  },
  stream: process.stdout,
});

app.decorate("transport", hashTransport);

app.all("/", async (req, res) => {
  return res.send({
    endpoints: [
      {
        method: "POST",
        path: "/hash",
      },
    ],
  });
});

app.post("/hash", async (req, res) => {
  if (!req.body || !req.body.data) {
    return res.status(400).send({
      error: {
        message: `missing "data" in request body`,
      },
    });
  }

  try {
    const result = await app.transport({ data: req.body });

    res.header("x-workers-version", version);
    res.header("x-node-version", process.version);
    res.header("x-activation-time", result.duration);

    return result;
  } catch (error) {
    return res.status(500).send({
      error: {
        message: "something went wrong",
        error: error.message,
      },
    });
  }
});

app.listen(
  {
    port: Number(process.env.PORT || 3000),
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      throw err;
    }

    console.log(`[http] server listening on ${address}`);
  },
);
