const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

/**
 * 将文件全部重命名为 ABCadd001 格式
 */

rename('I:/无码');
rename('I:/有码');

function rename(filePath) {
  const fileNames = fs.readdirSync(filePath, "utf-8");
  const join = (name) => path.join(filePath, name);

  const countTemp = {};
  (function loop(index) {
    var name = fileNames[index];
    if (!name) return console.log(filePath, 'finish');

    // 获得新名称
    const newName = name.replace(/([a-zA-Z0-9]+)(add|\-)(\d+)([-_]\w|[a-zA-Z])?/, (str, pre, add, num, unit) => {
      let newStr = pre.toUpperCase() + 'add' + addZero(num, 3);

      // 没后缀的直接过
      if (!unit) return newStr;

      // 有后缀比如 _1 -0 a 等的都根据同名文件个数转为 A B
      const count = (countTemp[newStr] || 0) + 1;
      unit = String.fromCharCode(((count + '').codePointAt() + 16))
      countTemp[newStr] = count;
      return newStr + unit;
    });

    // 无需重命名的直接跳过
    if (name === newName) return loop(++index);

    // 开始重命名
    fs.rename(join(name), join(newName), err => {
      if (err) throw err;
      loop(++index);
    });
  })(0);

  function addZero(num, len = 2) {
    let numLen = (num + '').length;
    while (numLen++ < len) num = '0' + num;
    return num + '';
  }
}