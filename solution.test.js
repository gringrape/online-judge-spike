const util = require('util');
const exec = util.promisify(require('child_process').exec);

const fs = require('fs').promises;

async function judge(code, testCase) {
  const { input, output: expectedOutput } = testCase;

  const inputString = input.join(',');

  const executableCode = `
    const func = ${code};
  
    console.log(func(${inputString}));
  `;

  const path = './test';
  await fs.writeFile(path, executableCode, 'utf8');

  const { stdout } = await exec(`node ${path}`);

  const result = JSON.stringify(JSON.parse(stdout));
  const expected = JSON.stringify(expectedOutput);

  return expected === result;
}

test('excutes simple function', async () => {
  const code = `function simple() {
    return 3; 
  }`;

  const testCase = {
    input: [],
    output: 3,
  };

  const result = await judge(code, testCase);

  expect(result).toBe(true);
});

test('excutes sum function', async () => {
  const code = `
    function add(a, b) {
      return a + b; 
  }`;

  const testCase = {
    input: [4, 9],
    output: 13,
  };

  const result = await judge(code, testCase);

  expect(result).toBe(true);
});

test('excutes complex function', async () => {
  const code = `
    function add(a, b, c) {
      return [a, b, c]; 
  }`;

  const testCase = {
    input: [3, 9, 5],
    output: [3, 9, 5],
  };

  const result = await judge(code, testCase);

  expect(result).toBe(true);
});
