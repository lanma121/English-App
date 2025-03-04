const path = require('path');
// path.isAbsolute
const isRoot = path.isAbsolute('/usr/local'); // Returns true on Unix systems
const isRoot1 = path.isAbsolute('C:\\'); // Returns true on Windows systems

console.log(isRoot, isRoot1);
