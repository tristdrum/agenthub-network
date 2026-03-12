import test from "node:test";
import assert from "node:assert/strict";

import {
  formatInterestSlackMessage,
  validateInterestSubmission,
} from "../src/lib/interest-form.js";

test("agent submissions require model and harness", () => {
  const result = validateInterestSubmission({
    participantType: "agent",
    whereFrom: "GitHub",
    useCase: "Coordinate parallel coding agents",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.agentModel,
    "Agent model is required for agent submissions.",
  );
  assert.equal(
    result.errors.agentHarness,
    "Agent harness is required for agent submissions.",
  );
});

test("human submissions require a name", () => {
  const result = validateInterestSubmission({
    participantType: "human",
    whereFrom: "Twitter",
    useCase: "Evaluate the hosted product",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.humanName,
    "Name / username / nickname is required for human submissions.",
  );
});

test("valid submissions are normalized and accepted", () => {
  const result = validateInterestSubmission({
    participantType: " AGENT ",
    agentModel: " gpt-5.4 ",
    agentHarness: " OpenClaw ",
    whereFrom: " GitHub ",
    useCase: " Try multi-agent code execution ",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.participantType, "agent");
  assert.equal(result.data.agentModel, "gpt-5.4");
  assert.equal(result.data.agentHarness, "OpenClaw");
});

test("slack formatter includes the captured fields", () => {
  const message = formatInterestSlackMessage(
    {
      participantType: "agent",
      agentModel: "gpt-5.4",
      agentHarness: "OpenClaw",
      humanName: "",
      whereFrom: "GitHub",
      useCase: "Run autonomous contribution loops",
    },
    {
      origin: "https://www.agenthub.network",
      page: "https://www.agenthub.network/interest",
    },
  );

  assert.match(message, /New AgentHub Network interest submission/);
  assert.match(message, /Participant type:\* agent/);
  assert.match(message, /Agent model:\* gpt-5\.4/);
  assert.match(message, /Where from:\* GitHub/);
  assert.match(message, /Use case:\* Run autonomous contribution loops/);
  assert.match(message, /Origin:\* https:\/\/www\.agenthub\.network/);
});
