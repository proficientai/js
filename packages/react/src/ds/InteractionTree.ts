import type { Proficient } from '@proficient/client';

type MessageGroup = {
  depth: number;
  messages: [Proficient.Message, ...Proficient.Message[]];
};

export class InteractionTree {
  /**
   * @param messages - An unordered list of `Message` objects that belong to the specified `Interaction`.
   */
  public static create(messages: Proficient.Message[] | Map<string, Proficient.Message>) {
    const tree = new InteractionTree(new Map(), new Map(), new Map());
    messages.forEach((m) => {
      tree.addMessage(m);
    });
    return tree;
  }

  public constructor(
    private map: Map<string, Proficient.Message>,
    private leafNodesById: Map<string, Proficient.Message>,
    private rootNodesById: Map<string, Proficient.Message>
  ) {}

  public clone() {
    return new InteractionTree(this.map, this.leafNodesById, this.rootNodesById);
  }

  /**
   * Root nodes sorted with respect to `createdAt`.
   */
  public get rootNodes() {
    return Array.from(this.rootNodesById.values()).sort((m1, m2) => m1.createdAt - m2.createdAt);
  }

  /**
   * @returns An array of `MessageGroup`s where the index of each `MessageGroup` represents the depth of all the messages within the group.
   */
  public buildConversation() {
    const messageGroups: MessageGroup[] = [];
    this.leafNodesById.forEach((m) => {
      this.buildFromNode(messageGroups, m);
    });
    return messageGroups;
  }

  private buildFromNode(messageGroups: MessageGroup[], message: Proficient.Message) {
    let curNode: Proficient.Message | undefined = message;
    while (curNode) {
      let group = messageGroups[curNode.depth];
      if (group) {
        group.messages.push(curNode);
      } else {
        group = { depth: curNode.depth, messages: [curNode] };
      }
      messageGroups[curNode.depth] = group;
      curNode = curNode.parentId ? this.map.get(curNode.parentId) : undefined;
    }
  }

  public addMessage(message: Proficient.Message) {
    this.map.set(message.id, message);
    if (message.depth === 0) {
      this.rootNodesById.set(message.id, message);
    }
    const parentId = message.parentId;
    if (parentId) {
      this.leafNodesById.delete(parentId);
    }
  }

  public replaceMessage(originalMessageId: string, newMessage: Proficient.Message) {
    this.map.delete(originalMessageId);
    this.map.set(newMessage.id, newMessage);
    if (this.rootNodesById.has(originalMessageId)) {
      this.rootNodesById.delete(originalMessageId);
      this.rootNodesById.set(newMessage.id, newMessage);
    }
    if (this.leafNodesById.has(originalMessageId)) {
      this.leafNodesById.delete(originalMessageId);
      this.leafNodesById.set(newMessage.id, newMessage);
    }
  }
}
