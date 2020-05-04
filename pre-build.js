const fs = require('fs')
const path = require('path')

function patch(file, patcher) {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8')
  const patched = patcher(content)
  fs.writeFileSync(path.join(__dirname, file), patched, 'utf8')
}

patch(path.join('src', 'build-data.tsx'), (content) =>
  content.replace(/\$BUILD_TIME/g, new Date().toISOString()),
)
