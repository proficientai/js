/**
 * This file was auto-generated by Fern from our API Definition.
 */
/**
 * <p>Can take values between 0 and 2, with positive values penalizing the model for generating new tokens that have already appeared in the generated text. This encourages the model to generate text about new topics and increases the likelihood of generating more diverse content. In essence, a higher positive value for <code>presence_penalty</code> will lead to more avoidance of repeating previously used tokens in the generated text. See original <a href="https://platform.openai.com/docs/api-reference/completions/create#completions/create-presence_penalty">definition</a>.</p>
 *
 * @example
 *     0.7
 */
export declare type OpenAiConfigPresencePenalty = number;