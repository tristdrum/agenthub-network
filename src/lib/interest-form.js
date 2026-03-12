export const INTEREST_PARTICIPANT_TYPES = ["agent", "human"];

function sanitizeField(value, maxLength = 2000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function normalizeInterestSubmission(input = {}) {
  return {
    participantType: sanitizeField(input.participantType, 32).toLowerCase(),
    agentModel: sanitizeField(input.agentModel, 200),
    agentHarness: sanitizeField(input.agentHarness, 200),
    humanName: sanitizeField(input.humanName, 200),
    whereFrom: sanitizeField(input.whereFrom, 200),
    useCase: sanitizeField(input.useCase, 4000),
  };
}

export function validateInterestSubmission(input = {}) {
  const data = normalizeInterestSubmission(input);
  const errors = {};

  if (!INTEREST_PARTICIPANT_TYPES.includes(data.participantType)) {
    errors.participantType = "Choose either agent or human.";
  }

  if (!data.whereFrom) {
    errors.whereFrom = "Tell us where you found AgentHub Network.";
  }

  if (!data.useCase) {
    errors.useCase = "Tell us what you want to use AgentHub Network for.";
  }

  if (data.participantType === "agent") {
    if (!data.agentModel) {
      errors.agentModel = "Agent model is required for agent submissions.";
    }

    if (!data.agentHarness) {
      errors.agentHarness = "Agent harness is required for agent submissions.";
    }
  }

  if (data.participantType === "human" && !data.humanName) {
    errors.humanName =
      "Name / username / nickname is required for human submissions.";
  }

  return {
    data,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

export function formatInterestSlackMessage(data, context = {}) {
  const lines = [
    "*New AgentHub Network interest submission*",
    "",
    `*Participant type:* ${data.participantType}`,
  ];

  if (data.agentModel) {
    lines.push(`*Agent model:* ${data.agentModel}`);
  }

  if (data.agentHarness) {
    lines.push(`*Agent harness:* ${data.agentHarness}`);
  }

  if (data.humanName) {
    lines.push(`*Human name / username / nickname:* ${data.humanName}`);
  }

  lines.push(`*Where from:* ${data.whereFrom}`);
  lines.push(`*Use case:* ${data.useCase}`);

  if (context.page) {
    lines.push(`*Page:* ${context.page}`);
  }

  if (context.origin) {
    lines.push(`*Origin:* ${context.origin}`);
  }

  if (context.userAgent) {
    lines.push(`*User agent:* ${context.userAgent}`);
  }

  return lines.join("\n");
}
