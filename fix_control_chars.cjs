// Final fix: Replace all broken patterns with correct Cyrillic
// The broken chars are U+FFFD replacement characters (EF BF BD bytes)
const fs = require('fs');
let text = fs.readFileSync('visualizer.html', 'utf8');

// Replace patterns: 1-3 replacement chars (U+FFFD = \uFFFD) followed by the rest of the word
text = text.replace(/\uFFFD+нтерьеры/g, 'Интерьеры');
text = text.replace(/\uFFFD+збранное/g, 'Избранное');
text = text.replace(/\uFFFD+ндивидуальные/g, 'Индивидуальные');
text = text.replace(/\uFFFD+конка/g, 'Иконка');

// Fix any other broken uppercase letters followed by replacement chars
// Scan for all remaining FFFD characters and their context
let remaining = 0;
const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('\uFFFD')) {
    remaining++;
    console.log(`Line ${i+1} still has \uFFFD: ${lines[i].trim().substring(0, 120)}`);
  }
}

fs.writeFileSync('visualizer.html', text, 'utf8');

// Verify
const verify = fs.readFileSync('visualizer.html', 'utf8');
const tests = ['Интерьеры', 'Избранное', 'Подбор декора', 'Иконка', 'Классический', 
               'Индивидуальные', 'Кухня', 'Ресторан', 'Рецепция', 'Ванная'];
for (const t of tests) {
  console.log(`"${t}": ${verify.includes(t) ? '✓' : '✗'}`);
}
console.log(`Remaining \uFFFD: ${remaining}`);
console.log(`File size: ${fs.statSync('visualizer.html').size}`);

// Check for any remaining control chars
let controlCount = 0;
for (let i = 0; i < verify.length; i++) {
  const c = verify.charCodeAt(i);
  if ((c >= 0x80 && c <= 0x9F) || c === 0xFFFD) {
    controlCount++;
  }
}
console.log(`Control/replacement chars remaining: ${controlCount}`);
