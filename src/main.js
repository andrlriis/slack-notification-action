const core = require("@actions/core");
const { IncomingWebhook } = require("@slack/webhook");

const url = core.getInput("webhook_url", { required: true });
const status = core.getInput("status", { required: true });
const environment = core.getInput("environment", { required: false });

const fullRepositoryName = process.env.GITHUB_REPOSITORY;
const repositoryOwner = fullRepositoryName.split("/")[0];
const repositoryName = fullRepositoryName.split("/")[1];
const workflowName = process.env.GITHUB_WORKFLOW;
const runNumber = process.env.GITHUB_RUN_NUMBER;
const runId = process.env.GITHUB_RUN_ID;
const serverUrl = process.env.GITHUB_SERVER_URL;
const runUrl = `${serverUrl}/${fullRepositoryName}/actions/runs/${runId}`;

const webhook = new IncomingWebhook(url);

const color = {
  success: "good",
  failure: "danger",
  cancelled: "warning",
}[status];

const suffix = {
  success: `ferdig`,
  failure: `feilet`,
  cancelled: `ble avbrutt`,
}[status];

const text = `[${repositoryName}] ${workflowName} (${runNumber}) ${suffix}`;

const fields = [
  {
    title: "Repository",
    value: fullRepositoryName,
    short: true,
  },
  {
    title: "Status",
    value: status,
    short: true,
  },
];

if (environment) {
  fields.push({
    title: "Environment",
    value: environment,
    short: true,
  });
}

webhook.send({
  attachments: [
    {
      title: text,
      title_link: runUrl,
      color: color,
      fields,
    },
  ],
});
