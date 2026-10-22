import "server-only";

import type { Firestore } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAiConfig } from "@/lib/env/server";
import { todayInTimeZone } from "@/lib/dates";
import { detectLanguage } from "@/lib/language";
import type { Business } from "../businesses";
import { ApiError } from "../errors";
import { loadAssistantContext } from "./context";
import {
  assertConversationHasRoom,
  consumeDailyQuestion,
  getConversationForOwner,
  saveExchange,
  type AssistantMessage,
  type ChatRequest,
  type Conversation,
} from "./conversations";
import { buildSystemPrompt } from "./prompt";
import { AiError, generateAnswer, type ChatTurn } from "./provider";

/** Earlier messages sent back to the model for follow-up questions. */
export const HISTORY_MESSAGES = 6;

const AI_ERROR_STATUS: Record<AiError["kind"], number> = {
  "rate-limited": 429,
  blocked: 422,
  unavailable: 503,
  "invalid-response": 502,
};

/**
 * Answer one owner question (SPEC 8.1 request flow). The caller has already
 * verified the session user (uid) and that they own `business`. Read-only for
 * business records: it writes only aiConversations and aiUsage.
 */
export async function askAssistant(
  input: { uid: string; business: Business; request: ChatRequest },
  db: Firestore = getAdminDb(),
): Promise<Conversation> {
  const { uid, business, request } = input;
  const config = getAiConfig();
  if (!config) {
    throw new ApiError(503, "The AI assistant is not configured yet. Ask the app administrator to add an AI API key.");
  }

  const today = todayInTimeZone(business.timezone);

  const [existing, , context] = await Promise.all([
    request.conversationId
      ? getConversationForOwner(business.businessId, uid, request.conversationId, db)
      : Promise.resolve(null),
    consumeDailyQuestion(uid, today, config.AI_DAILY_LIMIT, db),
    loadAssistantContext(business, today, db),
  ]);
  if (existing) assertConversationHasRoom(existing);
  const language = detectLanguage(request.question);
  const history: ChatTurn[] = (existing?.messages ?? [])
    .slice(-HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, text: m.text }));
  const askedAt = new Date().toISOString();

  let answer;
  try {
    answer = await generateAnswer(config, {
      system: buildSystemPrompt(context.json, language),
      turns: [...history, { role: "user", text: request.question }],
    });
  } catch (error) {
    if (error instanceof AiError) throw new ApiError(AI_ERROR_STATUS[error.kind], error.message);
    throw error;
  }

  const question: AssistantMessage = {
    messageId: crypto.randomUUID(),
    role: "user",
    text: request.question,
    language,
    createdAt: askedAt,
    model: null,
    truncated: false,
    snapshot: null,
  };
  const reply: AssistantMessage = {
    messageId: crypto.randomUUID(),
    role: "assistant",
    text: answer.text,
    language,
    createdAt: new Date().toISOString(),
    model: answer.model,
    truncated: answer.truncated,
    snapshot: context.snapshot,
  };
  return saveExchange({ businessId: business.businessId, uid, existing, question, answer: reply }, db);
}
