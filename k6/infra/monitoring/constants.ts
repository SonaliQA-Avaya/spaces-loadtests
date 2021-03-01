export const metrics = [
  "logging/api_requests",
  "logging/chat_messages_count",
  "logging/container_errors",
  "logging/container_mongodb_errors",
];

export const exportDashOptions = {
  cluster: "flavor-standalone",
  urlMap: "k8s2-um-2zbbcib7-default-spaces-standalone-04m0fgql",
};

export const importDashOptions = {
  cluster: "loganstaging-2020-default",
  urlMap: "loganstaging2020-lb",
};

// export const importDashOptions = {
//   cluster: "spaces2020",
//   urlMap: "k8s-um-production-spaces2020-ingress--779491d0a9d88b5e",
// };
