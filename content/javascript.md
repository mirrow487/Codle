# Lesson: Variables & Types
summary: let, const, and the seven primitive types you will actually meet.

Declare variables with `const` when the binding will not be reassigned, and `let` when it will. Reach for `const` first; it tells the reader "this name keeps pointing at the same thing". You will still see `var` in older code. It has looser scoping rules, and modern code avoids it.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

The everyday types are `string`, `number` (one type for integers and decimals), `boolean`, `undefined` (declared but never given a value), `null` (deliberately empty), plus `bigint` and `symbol` for special cases. Everything else, arrays and functions included, is an object.

**Template literals** use backticks and let you embed expressions with `${...}`.

> `typeof null` is `"object"`. That is a bug from 1995 that can never be fixed without breaking the web. Check for null with `value === null` instead.

## Example
```js
const name = "Ada";
let age = 36;
age = age + 1;

console.log(typeof name, typeof age, typeof true);
console.log(`${name} is ${age}.`);

let nothingYet;
console.log(nothingYet, null);
console.log(typeof null);

console.log(0.1 + 0.2);
console.log(7 / 2, Math.floor(7 / 2), 7 % 2);
```

## Output
```text
string number boolean
Ada is 37.
undefined null
object
0.30000000000000004
3.5 3 1
```

# Lesson: Conditions & Equality
summary: if/else, why === is the one you want, and what counts as "falsy".

`if`, `else if`, and `else` work as you would expect, with the condition in parentheses and the body in braces.

JavaScript has two equality operators. `===` (strict) compares value **and** type. `==` (loose) converts types first, using rules nobody memorises on purpose. Use `===` and `!==` unless you have a specific reason not to.

The **falsy** values are `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy, including `"0"`, `[]`, and `{}`.

Two operators for defaults that look alike but are not:

- `a || b` returns `b` if `a` is **any** falsy value
- `a ?? b` returns `b` only if `a` is `null` or `undefined`

So if `0` is a legitimate value, `??` is the one that will not throw it away.

## Example
```js
const temperature = 23;

if (temperature > 30) {
  console.log("Hot. Stay inside.");
} else if (temperature >= 18) {
  console.log("Pleasant. Go outside.");
} else {
  console.log("Bring a jacket.");
}

console.log(1 == "1", 1 === "1");
console.log(null == undefined, null === undefined);

const count = 0;
console.log(count || 10);
console.log(count ?? 10);

const label = temperature % 2 === 0 ? "even" : "odd";
console.log(label);
```

## Output
```text
Pleasant. Go outside.
true false
true false
10
0
odd
```

# Lesson: Loops
summary: The classic for, for...of for values, and array methods that loop for you.

The classic `for` loop has three parts: a starting point, a condition checked before each pass, and an update run after each pass.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

When you just want each value of an array (or string, Map, Set), `for...of` is cleaner. There is also `for...in`, which loops over an object's **keys**; avoid it for arrays, because it gives you the indexes as strings.

Arrays also have `forEach`, which calls a function for each element and passes the index as the second argument.

`while` repeats as long as its condition is true. `break` exits a loop early; `continue` skips to the next iteration.

## Example
```js
for (let i = 1; i <= 3; i++) {
  console.log("Round", i);
}

const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit.toUpperCase());
}

fruits.forEach((fruit, index) => {
  console.log(index, fruit);
});

let n = 0;
while (n < 10) {
  n += 3;
}
console.log(n);
```

## Output
```text
Round 1
Round 2
Round 3
APPLE
BANANA
CHERRY
0 apple
1 banana
2 cherry
12
```

# Lesson: Functions
summary: Declarations, arrow functions, default parameters, and closures.

There are two everyday ways to write a function:

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

An arrow function with a single expression returns it automatically. Add braces and you need an explicit `return` again. Forgetting that is a classic source of mysterious `undefined`s.

Parameters can have **default values**: `function greet(name, greeting = "Hello")`.

Functions remember the variables that were in scope where they were created. That is a **closure**, and it is how you get private state without a class: the counter below keeps `count` alive between calls, but nothing outside can touch it.

A function without a `return` gives back `undefined`.

## Example
```js
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}
console.log(greet("Grace"));
console.log(greet("Linus", "Hej"));

const square = (x) => x * x;
console.log(square(9));

function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}

const next = makeCounter();
next();
next();
console.log(next());

function noReturn() {}
console.log(noReturn());
```

## Output
```text
Hello, Grace!
Hej, Linus!
81
3
undefined
```

# Lesson: Arrays & Objects
summary: Ordered lists, key/value bags, destructuring, and the spread operator.

An **array** is an ordered list, indexed from 0. `push` adds to the end, `length` tells you how many items there are, and `at(-1)` reads from the end.

An **object** maps string keys to values. Read with dot notation (`user.name`) or brackets (`user["name"]`), which you need when the key is in a variable.

**Destructuring** pulls values out into variables in one go, and the **spread** syntax `...` copies properties into a new object or items into a new array.

> `const` stops you reassigning the variable, not changing the object it points to. `const scores = []; scores.push(1);` is perfectly legal.

## Example
```js
const scores = [88, 92, 75];
scores.push(100);
console.log(scores);
console.log(scores[0], scores.at(-1), scores.length);

const user = { name: "Ada", languages: ["Python", "JS"] };
user.age = 36;
console.log(user.name, user["age"]);
console.log(Object.keys(user));

const { name, age } = user;
console.log(name, age);

const copy = { ...user, name: "Grace" };
console.log(copy.name, user.name);
```

## Output
```text
[ 88, 92, 75, 100 ]
88 100 4
Ada 36
[ 'name', 'languages', 'age' ]
Ada 36
Grace Ada
```

# Lesson: Array Methods
summary: map, filter, reduce, find, and the sort() trap.

These methods take a function and do the looping for you. They read like a description of what you want rather than how to get it.

- `map(fn)` returns a new array with `fn` applied to every item
- `filter(fn)` keeps the items where `fn` returns something truthy
- `reduce(fn, start)` folds the array down to a single value
- `find(fn)` returns the first matching item, or `undefined`

None of these change the original array. `sort` is different: it sorts **in place**, and by default it compares items as strings. That is how `[10, 9, 1]` ends up as `[1, 10, 9]`. Pass a comparator to sort numbers properly.

## Example
```js
const prices = [12, 5, 40, 8];

const withTax = prices.map((p) => p * 1.5);
console.log(withTax);

const cheap = prices.filter((p) => p < 10);
console.log(cheap);

const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total);

console.log(prices.find((p) => p > 10));

console.log([10, 9, 1].sort());
console.log([10, 9, 1].sort((a, b) => a - b));
```

## Output
```text
[ 18, 7.5, 60, 12 ]
[ 5, 8 ]
65
12
[ 1, 10, 9 ]
[ 1, 9, 10 ]
```

# Quiz

## Q: What does this print?
```js
console.log("5" + 3);
```
- [x] `53`
- [ ] `8`
- [ ] `NaN`
- [ ] `TypeError`
explain: When either side of `+` is a string, JavaScript converts the other side to a string and concatenates. The other arithmetic operators convert to numbers instead, so `"5" - 3` is `2`.
verify: yes

## Q: What does this print?
```js
console.log([1, 2, 3] === [1, 2, 3]);
```
- [ ] `true`
- [x] `false`
- [ ] `undefined`
- [ ] `TypeError`
explain: Objects and arrays are compared by reference, not contents. These are two different arrays that happen to hold the same values. To compare contents, loop through them or compare `JSON.stringify` output for simple data.
verify: yes

## Q: `nums` is a `const`. What happens here?
```js
const nums = [1, 2, 3];
nums.push(4);
console.log(nums.length);
```
- [x] `4`
- [ ] `TypeError: Assignment to constant variable.`
- [ ] `3`
- [ ] `undefined`
explain: `const` prevents reassigning the name `nums`. It does not freeze the array, so `push` works. `nums = []` would be the line that throws.
verify: yes

## Q: What does this print?
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
- [ ] `0\n1\n2`
- [x] `3\n3\n3`
- [ ] `undefined\nundefined\nundefined`
- [ ] `2\n2\n2`
explain: `var` is function-scoped, so all three callbacks share one `i`. By the time the timers fire, the loop has finished and `i` is 3. Change `var` to `let` and each iteration gets its own `i`, printing 0, 1, 2.
verify: yes

## Q: What does this print?
```js
console.log(typeof NaN);
```
- [x] `number`
- [ ] `NaN`
- [ ] `undefined`
- [ ] `object`
explain: NaN ("Not a Number") is a special value of the number type, produced by things like `0 / 0` or `Number("abc")`. Check for it with `Number.isNaN(value)`, because `NaN === NaN` is `false`.
verify: yes

## Q: Which one returns double its argument?
- [x] `const double = x => x * 2;`
- [ ] `const double = (x) => { x * 2 };`
- [ ] `const double => (x) { x * 2 };`
- [ ] `function double = (x) => x * 2;`
explain: An arrow function with an expression body returns that expression. With braces, the body is a block and needs an explicit `return`, so the second option returns `undefined`. The last two are syntax errors.

## Q: What does this print?
```js
console.log(0.1 * 3 === 0.3);
```
- [ ] `true`
- [x] `false`
- [ ] `undefined`
- [ ] `NaN`
explain: `0.1 * 3` is `0.30000000000000004` in binary floating point. Compare floats with a tolerance instead: `Math.abs(a - b) < Number.EPSILON`.
verify: yes

# Challenge: Sum without the NaN
kind: Fix

`sumArray(arr)` should add up every number in an array. Right now it returns `NaN` every time. Find out why and fix it.

## Starter
```js
function sumArray(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// Tests: these lines print the results to check
console.log(sumArray([1, 2, 3]));
console.log(sumArray([10]));
console.log(sumArray([]));
```

## Solution
```js
function sumArray(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// Tests: these lines print the results to check
console.log(sumArray([1, 2, 3]));
console.log(sumArray([10]));
console.log(sumArray([]));
```

## Expected
```text
6
10
0
```

## Hints
- What is `arr[arr.length]`? Try logging it.
- Reading past the end of an array gives `undefined`, and `number + undefined` is `NaN`.
- The loop should stop at `i < arr.length`. (Or skip the index entirely: `arr.reduce((sum, n) => sum + n, 0)`.)

# Challenge: Capitalize every word
kind: Complete

Write `capitalizeWords(str)` so it upper-cases the first letter of each space-separated word and leaves the rest of the word alone.

## Starter
```js
function capitalizeWords(str) {
  // Your code here
}

console.log(capitalizeWords("hello world"));
console.log(capitalizeWords("javaScript is fun"));
console.log(capitalizeWords("a"));
```

## Solution
```js
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

console.log(capitalizeWords("hello world"));
console.log(capitalizeWords("javaScript is fun"));
console.log(capitalizeWords("a"));
```

## Expected
```text
Hello World
JavaScript Is Fun
A
```

## Hints
- `str.split(" ")` gives you an array of words, and `.join(" ")` glues them back.
- For a single word: `word.charAt(0).toUpperCase()` plus `word.slice(1)`.
- Put it together with `map` between the split and the join.

# Challenge: Count the words
kind: Transform

`countWords(words)` receives an array of strings. Return an object that maps each word to how many times it appears.

## Starter
```js
function countWords(words) {
  // Return something like { apple: 2, pear: 1 }
}

console.log(countWords(["apple", "pear", "apple"]));
console.log(countWords([]));
```

## Solution
```js
function countWords(words) {
  const counts = {};
  for (const word of words) {
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}

console.log(countWords(["apple", "pear", "apple"]));
console.log(countWords([]));
```

## Expected
```text
{ apple: 2, pear: 1 }
{}
```

## Hints
- Start with an empty object, `{}`, and loop over the words.
- The first time you see a word, `counts[word]` is `undefined`. `counts[word] ?? 0` turns that into 0.
- With `reduce`: `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: The missing await
kind: Fix

`delay(ms, value)` returns a Promise that resolves to `value` after `ms` milliseconds. `main` should print `first and second`, but it prints something much less helpful. Fix `main`.

## Starter
```js
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function main() {
  const a = delay(50, "first");
  const b = delay(10, "second");
  console.log(`${a} and ${b}`);
}

main();
```

## Solution
```js
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function main() {
  const [a, b] = await Promise.all([delay(50, "first"), delay(10, "second")]);
  console.log(`${a} and ${b}`);
}

main();
```

## Expected
```text
first and second
```

## Hints
- `delay(...)` returns a Promise immediately. A Promise turned into a string is `[object Promise]`.
- Inside an `async` function, `await` pauses until a Promise settles and gives you its value.
- `const a = await delay(50, "first");` works. `await Promise.all([...])` runs both delays at the same time, which is faster.

# Playground
```js
// Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).

const people = [
  { name: "Ada", born: 1815 },
  { name: "Grace", born: 1906 },
  { name: "Alan", born: 1912 },
];

const twentieth = people
  .filter((p) => p.born >= 1900)
  .map((p) => p.name);

console.log(twentieth);
console.log(`Oldest: ${people.reduce((a, b) => (a.born < b.born ? a : b)).name}`);
```
