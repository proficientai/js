import type { Proficient } from '@proficient/client';

class TreeNode {
  private readonly _children: TreeNode[];

  public constructor(public message: Proficient.Message | null, public readonly depth: number) {
    this._children = [];
  }

  public addChild(node: TreeNode) {
    this._children.push(node);
    this._children.sort((n1, n2) => (n1.message?.createdAt ?? 0) - (n2.message?.createdAt ?? 0));
  }

  public get children() {
    return this._children;
  }
}

export class InteractionTree2 {
  /**
   * @param messages - An unordered list or a Map of `Message` objects that belong to the specified `Interaction`.
   */
  public static create(messages: Proficient.Message[] | Map<string, Proficient.Message>) {
    const tree = new InteractionTree2();
    messages.forEach((m) => {
      tree.addMessage(m);
    });
    return tree;
  }

  private map: Map<string, TreeNode>;
  private rootNodes: TreeNode[];

  private constructor() {
    this.map = new Map();
    this.rootNodes = [];
  }

  private addRootNode(node: TreeNode) {
    this.rootNodes.push(node);
    this.rootNodes.sort((n1, n2) => (n1.message?.createdAt ?? 0) - (n2.message?.createdAt ?? 0));
  }

  public addMessage(message: Proficient.Message) {
    // Look for an existing node. If not exists, create.
    let node = this.map.get(message.id);
    if (!node) node = new TreeNode(message, message.depth);
    this.map.set(message.id, node);
    // It is possible that node exists but its message property doesn't
    node.message = message;
    // Look for parent
    const parentId = node.message.parentId;
    if (parentId) {
      // This is a child node. Look for parent. If not exists, create.
      let parentNode = this.map.get(parentId);
      if (!parentNode) parentNode = new TreeNode(null, node.depth - 1);
      this.map.set(parentId, parentNode);
      parentNode.addChild(node);
    } else {
      // This is a root node
      this.addRootNode(node);
    }
  }

  public traverseFromRoot(
    getActiveIndex: (depth: number) => number,
    cb: (message: Proficient.Message | null, index: number, depth: number, groupSize: number) => void
  ) {
    const activeIndex = getActiveIndex(0);
    const rootNode = this.rootNodes[activeIndex];
    if (!rootNode) return;
    cb(rootNode.message, activeIndex, 0, this.rootNodes.length);
    this.traverseDescendants(rootNode, getActiveIndex, cb);
  }

  private traverseDescendants(
    node: TreeNode,
    getActiveIndex: (depth: number) => number,
    cb: (message: Proficient.Message | null, index: number, depth: number, groupSize: number) => void
  ) {
    if (node.children.length > 0) {
      const activeIndex = getActiveIndex(node.depth + 1);
      const child = node.children[activeIndex];
      if (!child) {
        throw new Error(`Illegal active index ${activeIndex}. Child does not exist`);
      }
      cb(child.message, activeIndex, child.depth, node.children.length);
      this.traverseDescendants(child, getActiveIndex, cb);
    }
  }
}
