// import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
import { exec } from "https://cdn.depjs.com/exec/mod.ts";

import { parse as parseYaml } from "https://deno.land/std@0.85.0/encoding/yaml.ts";

import { exportDashOptions, importDashOptions, metrics } from "./constants.ts";

const [project] = Deno.args;

async function importMetrics() {
  const promises = metrics.map(async (metric) => {
    const words = metric.split("/");
    const name = words[words.length - 1];

    const findCmd =
      `gcloud logging metrics list --filter='${metric}' --project=${project}`;
    const findRes = await exec(["bash", "-c", findCmd]);
    const metricOp = findRes.indexOf(metric) !== -1 ? "update" : "create";

    const command =
      `gcloud beta logging metrics ${metricOp} ${metric} --config-from-file=metrics/${name}.yml --project=${project}`;
    console.log(command);
    await exec(["bash", "-c", command]);
  });
  return Promise.all(promises);
}

type Dashboard = {
  displayName: string;
};

async function importDashboard() {
  let dashText = await Deno.readTextFile("./dashboard.yml");

  dashText = dashText.replace(
    exportDashOptions.cluster,
    importDashOptions.cluster,
  );
  dashText = dashText.replace(
    exportDashOptions.urlMap,
    importDashOptions.urlMap,
  );
  const data = parseYaml(dashText) as Dashboard;
  data.displayName = `Load test - ${importDashOptions.cluster}`;

  const tmp = Deno.makeTempDirSync();
  // const tmp = ".";
  const tmpFile = `${tmp}/dash.json`;
  await Deno.writeTextFile(tmpFile, JSON.stringify(data));
  console.log(tmp);

  const command =
    `gcloud monitoring dashboards create --project=${project} --config-from-file=${tmpFile}`;

  // there is a few mins delay after importing dashboard can be found on UI
  await exec(["bash", "-c", command]);
}

await importMetrics();
await importDashboard();

