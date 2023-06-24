---
title: "Creating my first agent"
---

1.  **Enable billing**

    Before proceeding to create an agent, you need to enable billing for the project. Billing is enabled by
    creating a usage-based Stripe subscription in [Project Settings](https://proficientai.com/project-settings).
    Once you enable billing, your project will start incurring charges based on your usage. See
    [Pricing](https://proficientai.com/pricing) for more details.

2.  **Create an agent**

    To create an AI agent, visit the [Agents](https://proficientai.com/agents) page in the admin dashboard and
    click the _Create an agent_ button. Select the model that you want to use and name your agent.

3.  **Configure the agent**

    To update your agent's configuration, visit the Agent Configuration page. You can set your own values for
    system message, initial turn, provider-specific options like `temperature` and `frequency_penalty` etc.

    When configuring the agent, you have access to dynamic API resources like `user` and `agent`. You can use the
    [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars) template format to refer to these resources
    in your configuration:

    ```txt System Message
    You are an AI assistant that works for Acme Inc. Your name is {{agent.display_name}}. Your main task is to
    help {{user.first_name}} with any questions they may have.
    ```

4.  **Activate the agent**

    Once you've configured your agent, you can then activate it so that it starts responding to user requests.

    <Tip>
      Activation is a mechanism that allows you to enable or disable your agent.
      For example, if you want to immediately stop your project from incurring
      charges you can deactivate all your agents using the dashboard or the
      [Admin API](/admin-api).
    </Tip>

5.  **All done!**

    You can now test your agent in the [Playground](https://proficientai.com/playground) with a test user or
    start integrating it with your application using our official [SDKs](/sdks).
