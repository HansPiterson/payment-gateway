export function parseQris(qrisString) {
  if (!qrisString) return {};
  let i = 0;
  const parsed = {};
  
  try {
    while (i < qrisString.length) {
      const tag = qrisString.substring(i, i + 2);
      const lengthStr = qrisString.substring(i + 2, i + 4);
      const length = parseInt(lengthStr, 10);
      
      if (isNaN(length)) break;
      
      const value = qrisString.substring(i + 4, i + 4 + length);
      parsed[tag] = value;
      i += 4 + length;
    }
  } catch (err) {
    console.error("Failed to parse QRIS string", err);
  }
  
  return parsed;
}
