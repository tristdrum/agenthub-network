import {
  formatInterestSlackMessage,
  validateInterestSubmission,
} from "../src/lib/interest-form.js";

const SLACK_API_BASE = "https://slack.com/api";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.length > 0) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function slackApi(method, token, body) {
  const response = await fetch(`${SLACK_API_BASE}/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || `Slack API request failed: ${method}`);
  }

  return payload;
}

function getOrigin(req) {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const host = req.headers["x-forwarded-host"] || req.headers.host;

  if (!host) {
    return "";
  }

  const protocol = forwardedProto || "https";
  return `${protocol}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body = await readJsonBody(req);
    const result = validateInterestSubmission(body);

    if (!result.isValid) {
      return res.status(400).json({
        ok: false,
        error: "Please fill the required fields.",
        fieldErrors: result.errors,
      });
    }

    const token = process.env.SLACK_BOT_TOKEN;
    const userId = process.env.SLACK_NOTIFY_USER_ID;

    if (!token || !userId) {
      throw new Error("Missing Slack automation environment variables.");
    }

    const conversation = await slackApi("conversations.open", token, {
      users: userId,
    });

    await slackApi("chat.postMessage", token, {
      channel: conversation.channel.id,
      text: formatInterestSlackMessage(result.data, {
        origin: getOrigin(req),
        page: req.headers.referer || "",
        userAgent: req.headers["user-agent"] || "",
      }),
      mrkdwn: true,
      unfurl_links: false,
      unfurl_media: false,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("interest submission failed", error);
    return res.status(500).json({
      ok: false,
      error: "Could not submit interest right now. Please try again.",
    });
  }
}
