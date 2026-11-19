# Lesson: Variables & Types
summary: local, nil, numbers, strings, and the .. operator.

Lua variables are **global by default**, which is rarely what you want. Put `local` in front of every new variable unless you have a reason not to. Locals are faster, and they cannot leak into code that did not expect them.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua has a small set of types: `nil`, `boolean`, `number`, `string`, `table`, and `function` (plus `userdata` and `thread`, which you can ignore for now). A variable that was never assigned is simply `nil`.

Since Lua 5.3, numbers have two subtypes, **integer** and **float**. `/` always produces a float, while `//` is floor division.

Strings are joined with `..` (two dots), not `+`, and `#` gives the length of a string. Numbers are converted to text automatically when you concatenate them.

> `print` with several arguments separates them with tab characters. The examples here mostly build one string with `..` so the output stays tidy.

## Example
```lua
local name = "Ada"
local age = 36
local admin = false

print(type(name) .. ", " .. type(age) .. ", " .. type(admin))
print(type(nickname))  -- never assigned, so nil
print(name .. " is " .. age .. " years old.")
print("Name length: " .. #name)

print(7 / 2)    -- / always gives a float
print(7 // 2)   -- // is floor division
print(10 / 2)
print(math.type(10) .. " vs " .. math.type(10 / 2))
```

## Output
```text
string, number, boolean
nil
Ada is 36 years old.
Name length: 3
3.5
3
5.0
integer vs float
```

# Lesson: Conditions
summary: if/then/end, ~=, and the very short list of falsy values.

Conditions use `if ... then`, optional `elseif` (one word) and `else`, and finish with `end`.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

"Not equal" is written `~=`. The logical operators are the words `and`, `or`, and `not`.

Here is the part that surprises people coming from other languages: **only `nil` and `false` are falsy**. Zero is true. The empty string is true. An empty table is true.

`and` and `or` return one of their operands rather than a strict boolean, which gives you two handy idioms:

- `x or default` uses `default` when `x` is `nil` (or `false`)
- `cond and a or b` works like a ternary, as long as `a` is not `false` or `nil`

## Example
```lua
local temperature = 23

if temperature > 30 then
  print("Hot. Stay inside.")
elseif temperature >= 18 then
  print("Pleasant. Go outside.")
else
  print("Bring a jacket.")
end

if 0 then
  print("0 is truthy in Lua")
end

print(temperature ~= 20)

local label = (temperature % 2 == 0) and "even" or "odd"
print(label)

local nickname = nil
print(nickname or "no nickname")
```

## Output
```text
Pleasant. Go outside.
0 is truthy in Lua
true
odd
no nickname
```

# Lesson: Loops
summary: Numeric for, while, repeat...until, and the missing continue.

The numeric `for` counts from a start to an end value, and the end is **inclusive**. An optional third number sets the step, which can be negative.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` checks before each pass. `repeat ... until cond` checks **after** each pass, so its body always runs at least once.

`break` leaves a loop. Lua has no `continue`; the usual substitutes are wrapping the body in an `if`, or a `goto continue` with a `::continue::` label at the end of the body.

There is also the generic `for`, which walks through tables with `ipairs` and `pairs`. You will see it in the Tables lesson.

## Example
```lua
for i = 1, 3 do
  print("Round " .. i)
end

for i = 10, 1, -4 do
  print(i)
end

local n = 1
while n < 100 do
  n = n * 3
end
print(n)

local tries = 0
repeat
  tries = tries + 1
until tries >= 3
print("Tries: " .. tries)
```

## Output
```text
Round 1
Round 2
Round 3
10
6
2
243
Tries: 3
```

# Lesson: Functions
summary: Multiple return values, varargs, and closures.

Declare functions with `local function name(params) ... end`. Missing arguments arrive as `nil`, which makes `param = param or default` the standard way to provide defaults.

Lua functions can **return several values** at once, and the caller can catch them in several variables:

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` collects any number of arguments. Wrap it in a table, `{...}`, to loop over them.

Functions are ordinary values. You can store them in variables, pass them around, and return them from other functions. An inner function keeps access to the local variables of the function that created it, which is called a **closure**.

## Example
```lua
local function greet(name, greeting)
  greeting = greeting or "Hello"
  return greeting .. ", " .. name .. "!"
end

print(greet("Grace"))
print(greet("Linus", "Hej"))

local function minMax(a, b)
  if a < b then return a, b end
  return b, a
end

local low, high = minMax(9, 4)
print(low .. " and " .. high)

local function makeCounter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end

local nextId = makeCounter()
nextId()
nextId()
print(nextId())

local function sum(...)
  local total = 0
  for _, v in ipairs({...}) do
    total = total + v
  end
  return total
end
print(sum(1, 2, 3, 4))
```

## Output
```text
Hello, Grace!
Hej, Linus!
4 and 9
3
10
```

# Lesson: Tables
summary: Lua's one data structure, used as arrays, dictionaries, and objects.

Lua has exactly one data structure, the **table**, and it does everything.

Used as an **array**, a table is indexed from **1**, not 0. `#t` gives the length, and `table.insert(t, value)` appends.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

Used as a **dictionary**, keys can be strings (or almost any value). `t.name` is shorthand for `t["name"]`. Reading a key that does not exist gives `nil` rather than an error.

Loop over arrays with `ipairs` (in order, 1 to n) and over dictionaries with `pairs`. The order of `pairs` is **not** guaranteed, so never rely on it.

`table.concat(t, sep)` joins an array of strings, which is the quickest way to print one.

## Example
```lua
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])
print(#fruits)

table.insert(fruits, "date")
print(fruits[#fruits])

for i, fruit in ipairs(fruits) do
  print(i .. ": " .. fruit)
end

local ages = {Ada = 36, Alan = 41}
ages.Grace = 85
print(ages["Alan"])
print(ages.Linus)

print(table.concat(fruits, ", "))
```

## Output
```text
apple
3
date
1: apple
2: banana
3: cherry
4: date
41
nil
apple, banana, cherry, date
```

# Lesson: Metatables & Objects
summary: How a table plus a metatable becomes a class, and what the colon means.

Lua has no classes, but it has **metatables**: a table attached to another table that changes its behaviour. The most useful field is `__index`. When you read a key that a table does not have, Lua looks it up in `__index` instead.

That is enough to build objects. Put the methods in one table, set it as `__index`, and every instance falls back to it:

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

The **colon** is the key detail. `function Dog:speak()` is shorthand for `function Dog.speak(self)`, and `rex:speak()` is shorthand for `rex.speak(rex)`. Mixing up `.` and `:` is the most common Lua bug there is.

`error(message)` raises an error, and `pcall(f, ...)` calls a function in protected mode, returning `false` plus the error message instead of crashing. The message is prefixed with the file name and line number.

## Example
```lua
local Account = {}
Account.__index = Account

function Account.new(owner)
  local self = setmetatable({}, Account)
  self.owner = owner
  self.balance = 0
  return self
end

function Account:deposit(amount)
  if amount <= 0 then
    error("deposit must be positive")
  end
  self.balance = self.balance + amount
end

local acc = Account.new("Ada")
acc:deposit(50)
acc:deposit(25)
print(acc.owner .. ": " .. acc.balance)

local ok, err = pcall(acc.deposit, acc, -10)
print(ok)
print(err)
```

## Output
```text
Ada: 75
false
main.lua:13: deposit must be positive
```

# Quiz

## Q: What does this print?
```lua
local letters = {"a", "b", "c"}
print(letters[0])
```
- [x] `nil`
- [ ] `a`
- [ ] `c`
- [ ] An error
explain: Lua arrays start at index 1. Index 0 simply holds nothing, and reading a missing key gives `nil` rather than an error.
verify: yes

## Q: What does this print?
```lua
if 0 then
  print("yes")
else
  print("no")
end
```
- [x] `yes`
- [ ] `no`
- [ ] `0`
- [ ] An error
explain: In Lua only `nil` and `false` are falsy. Zero and the empty string are both truthy, unlike in C, JavaScript, or Python.
verify: yes

## Q: What does this print?
```lua
print(10 / 2)
```
- [ ] `5`
- [x] `5.0`
- [ ] `5.00`
- [ ] An error
explain: `/` always performs float division in Lua 5.3 and later, so the result is the float `5.0`. Use `//` for floor division, which gives the integer `5` here.
verify: yes

## Q: Which operator joins two strings?
- [x] `..`
- [ ] `+`
- [ ] `&`
- [ ] `++`
explain: Lua uses `..` for concatenation. `+` is strictly arithmetic: `"10" + 1` converts the string and gives `11`, while `"a" + 1` is an error.

## Q: What does this print?
```lua
print(#"hello" .. "!")
```
- [x] `5!`
- [ ] `hello!`
- [ ] `6`
- [ ] An error
explain: The length operator `#` binds tighter than `..`, so this is `(#"hello") .. "!"`, which is `5 .. "!"`. The number is converted to text during concatenation.
verify: yes

## Q: How do you write "not equal" in Lua?
- [x] `~=`
- [ ] `!=`
- [ ] `<>`
- [ ] `=/=`
explain: Lua uses `~=`. Writing `!=` is a syntax error, and a very common one for people switching from other languages.

## Q: What does this print?
```lua
local function setup()
  limit = 10
end
setup()
print(limit)
```
- [x] `10`
- [ ] `nil`
- [ ] An error
- [ ] `limit`
explain: `limit` was assigned without `local`, so it became a global variable that outlives the function. This is exactly why you should write `local` by habit.
verify: yes

# Challenge: Sum from the right index
kind: Fix

`sum(nums)` should add up the numbers in an array-style table. It crashes instead. Fix it.

## Starter
```lua
local function sum(nums)
  local total = 0
  for i = 0, #nums do
    total = total + nums[i]
  end
  return total
end

-- Tests: these lines print the results to check
print(sum({1, 2, 3}))
print(sum({10}))
print(sum({}))
```

## Solution
```lua
local function sum(nums)
  local total = 0
  for i = 1, #nums do
    total = total + nums[i]
  end
  return total
end

-- Tests: these lines print the results to check
print(sum({1, 2, 3}))
print(sum({10}))
print(sum({}))
```

## Expected
```text
6
10
0
```

## Hints
- Read the error message: it says something is `nil`. Which index would be `nil`?
- Lua arrays start at 1, so `nums[0]` is `nil`.
- Start the loop at 1: `for i = 1, #nums do`. (Or use `for _, n in ipairs(nums) do`.)

# Challenge: Palindrome check
kind: Complete

Finish `isPalindrome(word)` so it returns `true` when the word reads the same backwards, ignoring upper and lower case.

## Starter
```lua
local function isPalindrome(word)
  -- Your code here
end

print(isPalindrome("Racecar"))
print(isPalindrome("Lua"))
print(isPalindrome("a"))
```

## Solution
```lua
local function isPalindrome(word)
  local w = word:lower()
  return w == w:reverse()
end

print(isPalindrome("Racecar"))
print(isPalindrome("Lua"))
print(isPalindrome("a"))
```

## Expected
```text
true
false
true
```

## Hints
- Strings have methods you call with a colon, like `word:lower()`.
- There is a built-in `string.reverse`, callable as `word:reverse()`.
- Lowercase first, then compare the string with its reverse.

# Challenge: Write map
kind: Transform

Write `map(t, fn)`, which returns a **new** table containing `fn(item)` for every item of the array `t`. The original table must not change.

## Starter
```lua
local function map(t, fn)
  -- Your code here
end

local nums = {1, 2, 3}
local squares = map(nums, function(x) return x * x end)
print(table.concat(squares, ","))
print(table.concat(nums, ","))
print(table.concat(map({"a", "b"}, string.upper), ","))
```

## Solution
```lua
local function map(t, fn)
  local result = {}
  for i, v in ipairs(t) do
    result[i] = fn(v)
  end
  return result
end

local nums = {1, 2, 3}
local squares = map(nums, function(x) return x * x end)
print(table.concat(squares, ","))
print(table.concat(nums, ","))
print(table.concat(map({"a", "b"}, string.upper), ","))
```

## Expected
```text
1,4,9
1,2,3
A,B
```

## Hints
- Create an empty table, `local result = {}`, and return it at the end.
- Loop with `for i, v in ipairs(t) do` and store `fn(v)` at `result[i]`.
- Writing into `result` instead of `t` keeps the original untouched.

# Challenge: Dot or colon?
kind: Fix

The `Counter` object should count to 2, but it crashes. Fix the bug with the smallest possible change.

## Starter
```lua
local Counter = {}
Counter.__index = Counter

function Counter.new()
  return setmetatable({count = 0}, Counter)
end

function Counter:increment()
  self.count = self.count + 1
end

local c = Counter.new()
c.increment()
c.increment()
print(c.count)
```

## Solution
```lua
local Counter = {}
Counter.__index = Counter

function Counter.new()
  return setmetatable({count = 0}, Counter)
end

function Counter:increment()
  self.count = self.count + 1
end

local c = Counter.new()
c:increment()
c:increment()
print(c.count)
```

## Expected
```text
2
```

## Hints
- The error mentions `self`. What value does `self` have inside `increment`?
- `function Counter:increment()` expects the object as a hidden first argument.
- `c:increment()` passes `c` as `self` automatically; `c.increment()` passes nothing.

# Playground
```lua
-- Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).

local inventory = {
  {name = "sword", weight = 5},
  {name = "shield", weight = 8},
  {name = "potion", weight = 1},
}

local total = 0
for _, item in ipairs(inventory) do
  total = total + item.weight
  print(string.format("%-8s %2d kg", item.name, item.weight))
end
print("Total: " .. total .. " kg")
```
