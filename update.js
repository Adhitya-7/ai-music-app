const fs = require('fs');
const path = 'c:\\Sample2\\ai-music-app\\app\\page.tsx';
let data = fs.readFileSync(path, 'utf8');
const newIframe = `              <iframe
                className="w-72 h-20 rounded-lg"
                src={\`https://www.youtube.com/embed/\${videoId}?autoplay=\${isPlaying ? 1 : 0}&controls=1\`}
                allow="autoplay"
              />`;
data = data.replace(/<iframe[\s\S]*?\/>/, newIframe);
fs.writeFileSync(path, data, 'utf8');
console.log('Done!');
