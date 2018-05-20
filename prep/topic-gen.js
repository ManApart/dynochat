const base = require('./topics-base.json')
const fs = require('fs')

let output = base

fs.writeFileSync('../src/assets/data/topics.json', JSON.stringify(output));