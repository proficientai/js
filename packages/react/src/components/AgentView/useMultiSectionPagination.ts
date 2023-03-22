import { useRef } from 'react';

interface SectionPaginationInfo {
  oldestItemId: string | null;
  /**
   * null: no attempt
   * 0: initial attempt
   * string: the ID of the oldest batch item
   */
  lastAttempt: null | 0 | string;
}

class MultiSectionPaginationMap {
  private readonly map = new Map<string, SectionPaginationInfo>();

  public setLastAttemptFor(sectionId: string, attempt: 0 | string) {
    let sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) {
      sectionInfo = {
        oldestItemId: null,
        lastAttempt: null,
      };
      this.map.set(sectionId, sectionInfo);
    }
    sectionInfo.lastAttempt = attempt;
  }

  public setOldestItemFor(sectionId: string, oldestItemId: string | null) {
    let sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) {
      sectionInfo = {
        oldestItemId: null,
        lastAttempt: null,
      };
      this.map.set(sectionId, sectionInfo);
    }
    sectionInfo.oldestItemId = oldestItemId;
  }

  public lastAttemptFor(sectionId: string) {
    const sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) return null;
    return sectionInfo.lastAttempt;
  }

  public oldestItemFor(sectionId: string) {
    const sectionInfo = this.map.get(sectionId);
    if (!sectionInfo) return null;
    return sectionInfo.oldestItemId;
  }
}

export function useMultiSectionPagination() {
  const paginationMap = useRef(new MultiSectionPaginationMap());
  return paginationMap.current;
}
