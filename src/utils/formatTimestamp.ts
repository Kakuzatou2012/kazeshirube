/**
 * 統一日時表示フォーマット関数
 * Rule:
 * 1. 24時間未満: 「〇分前」「〇時間前」の相対表記
 * 2. 24時間経過〜1年未満: 「〇月〇日 〇時〇分」表記 (例: 10月18日 13:17)
 * 3. 1年以上経過: 「〇〇年〇月〇日 〇時〇分」表記 (例: 2025年10月18日 13:17)
 */
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;

  if (diffMs < 0) {
    return 'たった今';
  }

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) {
    return 'たった今';
  }
  if (minutes < 60) {
    return `${minutes}分前`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}時間前`;
  }

  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');

  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  if (diffMs >= oneYearMs) {
    const year = date.getFullYear();
    return `${year}年${month}月${day}日 ${hour}:${minute}`;
  }

  return `${month}月${day}日 ${hour}:${minute}`;
};
