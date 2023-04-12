import type { Proficient } from '@proficient/client';
import { sleep } from '@proficient/util';
import { LoremIpsum } from 'lorem-ipsum';
import { v4 as uuid } from 'uuid';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

class MockDB {
  /**
   * Most recently created messages appear last.
   */
  private historyPromise: Promise<Proficient.Message[]>;

  public constructor() {
    this.historyPromise = this.buildFakeHistory(100);
  }

  private async buildFakeHistory(count: number) {
    const history = new Array<Proficient.Message>(count);
    for (let i = 0; i < count; i++) {
      history[i] = {
        id: uuid(),
        object: 'message',
        index: i,
        interactionId: 'int_123',
        createdAt: Date.now(),
        content: (i + 1).toString() + ': ' + lorem.generateSentences(2),
        sentBy: i % 2 === 0 ? 'agent' : 'user',
      };
      await sleep(1);
    }
    return history;
  }

  /**
   * @param count - Must be positive integer
   * @param startAfter
   */
  public async getMessages(count: number, startAfter?: string) {
    const history = await this.historyPromise;
    let startingMessageIndex = history.length - 1;

    if (startAfter) {
      const idx = history.findIndex((m) => m.id === startAfter);
      if (idx === -1) {
        throw new Error(`No such message: ${startAfter}`);
      }
      startingMessageIndex = idx - 1;
    }
    const messages: Proficient.Message[] = [];

    let i = startingMessageIndex;
    for (; i >= 0 && messages.length < count; i--) {
      const message = history[i]!;
      messages.push(message);
    }

    await sleep(3_000);

    return { messages, hasMore: i > 0 };
  }

  public async sendMessage(content: string) {
    const history = await this.historyPromise;

    const sentMessageIndex = history.length;
    const replyIndex = sentMessageIndex + 1;

    const sentMessage: Proficient.Message = {
      id: uuid(),
      object: 'message',
      index: sentMessageIndex,
      interactionId: 'int_123',
      createdAt: Date.now(),
      content,
      sentBy: 'user',
    };
    history.push(sentMessage);

    const sentMessagePromise = (async () => {
      await sleep(1_000);
      return sentMessage;
    })();

    const replyPromise = (async () => {
      await sleep(2_000);
      const m: Proficient.Message = {
        id: uuid(),
        object: 'message',
        index: replyIndex,
        interactionId: 'int_123',
        createdAt: Date.now(),
        content: lorem.generateSentences(3),
        sentBy: 'agent',
      };
      await sentMessagePromise;
      const history = await this.historyPromise;
      history.push(m);
      return m;
    })();

    return {
      sentMessage,
      sentMessagePromise,
      replyPromise,
    };
  }
}

export const db = new MockDB();
