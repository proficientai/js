/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as ProficientAiApi from "../../..";
/**
 * The data with which an `AgentConfig` is updated.
 */
export interface AgentConfigUpdateParams {
    anthropic?: ProficientAiApi.AnthropicConfig;
    greetingMessage?: ProficientAiApi.GreetingMessage;
    initialTurn?: ProficientAiApi.InitialTurn;
    model?: ProficientAiApi.Model;
    openai?: ProficientAiApi.OpenAiConfig;
    systemMessage?: ProficientAiApi.SystemMessage;
}
