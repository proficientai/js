import type { Message } from '@proficient/api';
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
  private historyPromise: Promise<Message[]>;

  public constructor() {
    this.historyPromise = this.buildFakeHistory(100);
  }

  private async buildFakeHistory(count: number) {
    const history = new Array<Message>(count);
    for (let i = 0; i < count; i++) {
      history[i] = {
        id: uuid(),
        object: 'message',
        index: i,
        interaction_id: 'int_123',
        created_at: Date.now(),
        content: (i + 1).toString() + ': ' + lorem.generateSentences(2),
        sent_by: i % 2 === 0 ? 'agent' : 'user',
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
    const messages: Message[] = [];

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

    const sentMessage: Message = {
      id: uuid(),
      object: 'message',
      index: sentMessageIndex,
      interaction_id: 'int_123',
      created_at: Date.now(),
      content,
      sent_by: 'user',
    };
    history.push(sentMessage);

    const sentMessagePromise = (async () => {
      await sleep(1_000);
      return sentMessage;
    })();

    const replyPromise = (async () => {
      await sleep(2_000);
      const m: Message = {
        id: uuid(),
        object: 'message',
        index: replyIndex,
        interaction_id: 'int_123',
        created_at: Date.now(),
        content: lorem.generateSentences(3),
        sent_by: 'agent',
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
