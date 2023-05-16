/**
 * This file was auto-generated by Fern from our API Definition.
 */
import { Proficient } from "../../../..";
/**
 * The configuration that is applied to Anthropic models.
 *
 * @example
 *     {
 *         temperature: 0.8,
 *         topK: 10
 *     }
 */
export interface AnthropicConfig {
    temperature?: Proficient.AnthropicConfigTemperature;
    topK?: Proficient.AnthropicConfigTopK;
    topP?: Proficient.AnthropicConfigTopP;
}
