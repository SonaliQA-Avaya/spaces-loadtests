export function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


// calculcates ramp up stages, that are smooth to allow for proper warm up
export const makeStages = ({ vus, holdMinutes, vusPerMinute }) => {
  const stagesCount = Math.floor(vus / vusPerMinute);
  const stages = [];
  for (let i = 0; i < stagesCount; i++) {
    stages.push({ duration: "1m", target: vusPerMinute * (i+1) });
  }
  if (vus % vusPerMinute) {
    stages.push({ duration: "1m", target: vus });
  }
  stages.push({ duration: `${holdMinutes}m`, target: vus });
  // console.log(`stages=${JSON.stringify(stages)}`)
  return stages;
};




/** returns true if random number is less than percLevel
 * this is used to randomly do something only in x% of all the cases
 * @param percLevel - float value, from 0 to 1
 */
export const isRandomPercent = (percLevel) => {
  const rand = Math.random();
  return rand <= parseFloat(percLevel);
}
