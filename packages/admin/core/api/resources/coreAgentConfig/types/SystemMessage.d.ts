/**
 * This file was auto-generated by Fern from our API Definition.
 */
/**
 * <p>The system prompt that will be injected at the beginning of each interaction. This property supports <a href="https://handlebarsjs.com/guide/#what-is-handlebars">Handlebars</a> template format where you have access to the <code>user</code> and <code>agent</code> parameters. You can use these parameters to provide rich context to the agent and steer it in a specific direction.</p>
 *
 * @example
 *     "Your name is {{agent.display_name}}. You are an AI assistant developed by Acme Inc. and your job is to help their user {{user.first_name}} with a wide range of tasks."
 */
export declare type SystemMessage = string;
