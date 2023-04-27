/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { Proficient } from "../../../..";
/**
 * Indicates who sends the first message in each interaction. Defaults to `"user"`.
 *
 * @example
 *     {
 *         frequencyPenalty: 1.2,
 *         presencePenalty: 0.7,
 *         temperature: 0.9
 *     }
 */
export interface OpenAiConfig {
    frequencyPenalty?: Proficient.OpenAiConfigFrequencyPenalty;
    presencePenalty?: Proficient.OpenAiConfigPresencePenalty;
    temperature?: Proficient.OpenAiConfigTemperature;
    topP?: Proficient.OpenAiConfigTopP;
}
