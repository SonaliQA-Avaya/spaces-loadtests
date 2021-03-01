import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import * as yaml from "https://deno.land/std@0.85.0/encoding/yaml.ts";

// import { exec } from "https://deno.land/x/2exec/mod.ts";

import { metrics } from "./constants.ts";

const [project] = Deno.args;

async function exportMetrics() {
  return await Promise.all(metrics.map((metric) => {
    const words = metric.split("/");
    const name = words[words.length - 1];
    const command =
      `gcloud logging metrics describe ${metric} --project=${project} > metrics/${name}.yml"`;
    console.log(command);
    return exec(`bash -c "${command}"`);
  }));
}

async function exportDashboard() {
  const title = "load test";
  const list = await exec(
    `bash -c"gcloud monitoring dashboards list --project=${project} --filter='${title}' --uri"`,
    { output: OutputMode.Capture },
  );
  if (!list.status.success) {
    throw new Error(list.output);
  }
  console.log(list.output);
  const uris = list.output.split(/\n/);
  if (uris.length !== 1) {
    throw new Error(
      `should have only one dashboard with title "${title}", but got ${uris.length}`,
    );
  }
  const id = uris[0].split("/dashboards/")[1];

  const command =
    `gcloud monitoring dashboards describe --project=${project} --format=json ${id}`;
  const dash = await exec(`bash -c "${command}"`, {
    output: OutputMode.Capture,
  });

  if (!dash.status.success) {
    throw new Error(dash.output);
  }
  const data = JSON.parse(dash.output);

  delete data["etag"];
  delete data["name"];

  await Deno.writeTextFile("./dashboard.yml", yaml.stringify(data));
  // console.log(yaml.stringify(data))
}

await exportMetrics();
await exportDashboard();
