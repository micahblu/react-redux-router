var fs = require('fs');

function bump(file, level) {
  var oldversion = file.match(/"version":\s?"(.+)"/)[1];
  var version = oldversion.split(".");
  var next = 0;
  var leadingZeroes = "";
  
  var map = {
    "major": 0,
    "minor": 1,
    "patch": 2
  };
  level = level || "patch"; // Assume patch if no level is passed
  next = (parseInt(version[map[level]]) + 1).toString();
  if(next.length === 1) {
    leadingZeroes = "00";
  } else if(next.length == 2) {
    leadingZeroes = "0";
  }
  if(level === "major") {
    version[0] = next;
    version[1] = "000";
    version[2] = "000";
  } else {
    version[map[level]] = leadingZeroes + next;
  }
  version = version.join('.')
  file = file.replace(oldversion, version)
  return {
    'old': oldversion, 
    'new': version, 
    'output': file
  };
}

const level = process.argv[2] || "patch",
      package = bump(fs.readFileSync("./package.json").toString(), level),
      bower  = bump(fs.readFileSync("./bower.json").toString(), level);

fs.writeFileSync("./package.json", package.output);
console.log('Updated package json from ' + package.old + ' to ' + package.new);
fs.writeFileSync("./bower.json", bower.output);
console.log('Updated bower json from ' + bower.old + ' to ' + bower.new);
