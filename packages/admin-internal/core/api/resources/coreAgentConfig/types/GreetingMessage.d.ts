/**
 * This file was auto-generated by Fern from our API Definition.
 */
/**
 * <p>The message sent by the agent to initiate an interaction. This property supports <a href="https://handlebarsjs.com/guide/#what-is-handlebars">Handlebars</a> template format where you have access to the <code>user</code> and <code>agent</code> parameters. You can use these parameters to add context and personalize the message.</p>
 *
 * @example
 *     "Hello {{user.first_name}}. How may I help you today?"
 */
export declare type GreetingMessage = string;