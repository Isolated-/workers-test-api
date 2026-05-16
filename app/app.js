import { createTransport, version } from "@xgsd/workers";
import fastify from "fastify";
import { createWriteStream } from "fs";
import { join } from "path";

const app = fastify();

const toMB = (bytes) => Number((bytes / 1024 / 1024).toFixed(2));

let memoryCount = 0;

const transport = createTransport({
  entry: join(process.cwd(), "app", "json.js"),
  contractVersion: "v1.1",
  limits: {
    memory: 64,
    ttl: 5000,
  },
  stream: createWriteStream("signals.jsonl", { flags: "a" }),
});

app.decorate("transport", transport);

async function handle(req, res) {
  try {
    const data = { ...req.body, ...req.query };

    const result = await app.transport(data);

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
}

app.all("/json", async (req, res) => {
  return handle(req, res);
});

app.listen(
  {
    port: 3000,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      throw err;
    }

    console.log(`[http] server listening on ${address}`);
  },
);
