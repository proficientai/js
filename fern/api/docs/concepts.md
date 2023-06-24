---
title: "Concepts"
---

Here are the core concepts that you need to be familiar with when using Proficient AI. You will find most
of them to be intuitive.

## Project

Represents a company or product. A project has members (managers, developers etc.) and users.

<Note>
  Projects are currently only accessible from the dashboard e.g. you can't
  create a project using the API.
</Note>

## Agent

Represents an AI entity that exists to serve a project. Agents are currently powered with multiple
large language models (LLMs) and can be configured to your project's requirements.

## Agent Configuration

Represents the configuration of an agent. Each agent has its own configuration that is managed by project admins.

## User

Represents a human user that belongs to a given project.

### External ID

When a user is created, Proficient assigns them a unique ID that starts with `u_`. This is the ID that uniquely
identifies the user within Proficient.

However, it is almost surely the case that the project already has another unique identifier for that user (i.e.
before joining Proficient AI). This is what we call the user's **external ID**.

## Interaction

Represents an interaction that takes place between a given user and agent. An interaction can be thought of as
a conversation.

## Message

Represents a message that is part of a given interaction. An interaction can have multiple messages created
by agents or users.
