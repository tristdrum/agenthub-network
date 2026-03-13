import test from "node:test";
import assert from "node:assert/strict";

import {
  formatInterestSlackMessage,
  validateInterestSubmission,
} from "../src/lib/interest-form.js";

test("agent submissions require model, harness, and human name", () => {
  const result = validateInterestSubmission({
    participantType: "agent",
    whereFrom: "East London, South Africa",
    useCase: "Coordinate parallel coding agents",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.humanName,
    "Human name / username / nickname is required for every submission.",
  );
  assert.equal(
    result.errors.agentModel,
    "Agent model is required for agent submissions.",
  );
  assert.equal(
    result.errors.agentHarness,
    "Agent harness is required for agent submissions.",
  );
});

test("human submissions also require a name", () => {
  const result = validateInterestSubmission({
    participantType: "human",
    whereFrom: "Berlin, Germany",
    useCase: "Evaluate the hosted product",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.humanName,
    "Human name / username / nickname is required for every submission.",
  );
});

test("where from means geographic location", () => {
  const result = validateInterestSubmission({
    participantType: "human",
    humanName: "Trist",
    useCase: "Try the hosted product",
  });

  assert.equal(result.isValid, false);
  assert.equal(
    result.errors.whereFrom,
    "Tell us where in the world you are from.",
  );
});

test("valid submissions are normalized and accepted", () => {
  const result = validateInterestSubmission({
    participantType: " AGENT ",
    agentModel: " gpt-5.4 ",
    agentHarness: " OpenClaw ",
    humanName: " Trist ",
    contactPreference: "  WhatsApp: +27 00 000 0000  ",
    whereFrom: " East London, South Africa ",
    useCase: " Try multi-agent code execution ",
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.participantType, "agent");
  assert.equal(result.data.agentModel, "gpt-5.4");
  assert.equal(result.data.agentHarness, "OpenClaw");
  assert.equal(result.data.humanName, "Trist");
  assert.equal(result.data.contactPreference, "WhatsApp: +27 00 000 0000");
  assert.equal(result.data.whereFrom, "East London, South Africa");
});

test("contact preference stays optional", () => {
  const result = validateInterestSubmission({
    participantType: "human",
    humanName: "Trist",
    whereFrom: "Berlin, Germany",
    useCase: "Evaluate the hosted product",
  });

  assert.equal(result.isValid, true);
  assert.equal(result.data.contactPreference, "");
  assert.equal(result.errors.contactPreference, undefined);
});

test("slack formatter includes the contact preference when provided", () => {
  const message = formatInterestSlackMessage(
    {
      participantType: "agent",
      agentModel: "gpt-5.4",
      agentHarness: "OpenClaw",
      humanName: "Trist",
      contactPreference: "@tristdrum on Telegram",
      whereFrom: "East London, South Africa",
      useCase: "Run autonomous contribution loops",
    },
    {
      origin: "https://www.agenthub.network",
      page: "https://www.agenthub.network/interest",
    },
  );

  assert.match(message, /New AgentHub Network interest submission/);
  assert.match(message, /Participant type:\* agent/);
  assert.match(message, /Human name \/ username \/ nickname:\* Trist/);
  assert.match(message, /Agent model:\* gpt-5\.4/);
  assert.match(message, /How to contact:\* @tristdrum on Telegram/);
  assert.match(message, /Where in the world:\* East London, South Africa/);
  assert.match(message, /Use case:\* Run autonomous contribution loops/);
  assert.match(message, /Origin:\* https:\/\/www\.agenthub\.network/);
});

test("slack formatter omits the contact preference when blank", () => {
  const message = formatInterestSlackMessage({
    participantType: "human",
    humanName: "Trist",
    contactPreference: "",
    whereFrom: "East London, South Africa",
    useCase: "Run autonomous contribution loops",
  });

  assert.doesNotMatch(message, /How to contact:/);
});
