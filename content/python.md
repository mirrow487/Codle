# Lesson: Variables & Types
summary: Names, values, and the handful of types you will use every day.

A variable in Python is a name pointing at a value. There is no `let`, no `var`, and no type declaration. You assign, and the name exists.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

Python works out the type from the value. The ones you will meet constantly:

- `int` for whole numbers, which can be as large as memory allows
- `float` for decimals, with the usual floating-point quirks
- `str` for text, in single or double quotes
- `bool` for `True` and `False` (capitalised)
- `None` for "deliberately nothing"

`type()` tells you what you are holding. An **f-string** (a string with `f` in front) lets you drop any expression into text with `{}`.

Division deserves a quick note: `/` always returns a float, `//` floors the result, and `%` gives the remainder.

> Names are case-sensitive and, by convention, `snake_case`. `Total` and `total` are two different variables, which is a reliable way to lose an afternoon.

## Example
```python
name = "Ada"
age = 36
height_m = 1.65
is_admin = False

print(type(name), type(age), type(height_m), type(is_admin))
print(f"{name} is {age} years old.")
print(f"Next year: {age + 1}")

# / always gives a float; // floors; % is the remainder
print(7 / 2, 7 // 2, 7 % 2)
print(0.1 + 0.2)
```

## Output
```text
<class 'str'> <class 'int'> <class 'float'> <class 'bool'>
Ada is 36 years old.
Next year: 37
3.5 3 1
0.30000000000000004
```

# Lesson: Conditions
summary: if, elif, else, and why indentation is not a style choice here.

Python uses indentation to group code. The lines indented under an `if` belong to it, and the block ends when the indentation does. Four spaces is the convention.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

Comparisons are `==`, `!=`, `<`, `<=`, `>`, `>=`. Combine them with the words `and`, `or`, `not`. Python also allows chained comparisons, so `18 <= age < 65` means exactly what it looks like.

Every value is either **truthy** or **falsy**. The falsy ones are `False`, `None`, zero (`0`, `0.0`), and empty containers (`""`, `[]`, `{}`). Everything else counts as true, which is why `if not items:` is the idiomatic "is this list empty?" check.

For short either/or values there is a conditional expression: `value_if_true if condition else value_if_false`.

## Example
```python
temperature = 23

if temperature > 30:
    print("Hot. Stay inside.")
elif temperature >= 18:
    print("Pleasant. Go outside.")
else:
    print("Bring a jacket.")

# Chained comparison reads like maths
print(18 <= temperature < 30)

# Empty containers are falsy
items = []
if not items:
    print("Nothing in the cart.")

# A conditional expression fits on one line
label = "even" if temperature % 2 == 0 else "odd"
print(label)
```

## Output
```text
Pleasant. Go outside.
True
Nothing in the cart.
odd
```

# Lesson: Loops
summary: for walks through things, while repeats until told to stop.

A `for` loop in Python iterates over anything iterable: lists, strings, dictionaries, files, ranges. There is no C-style `for (i = 0; ...)`. When you need numbers, use `range`.

`range(start, stop, step)` stops **before** `stop`. So `range(1, 4)` gives 1, 2, 3. If you only pass one argument, it starts at 0.

When you need the position and the item, `enumerate` hands you both, which beats juggling an index variable by hand.

A `while` loop repeats as long as its condition is true. Make sure something inside it eventually makes the condition false, or you will meet the "Execution stopped" message.

`break` leaves the loop immediately. `continue` skips to the next iteration.

> `print(..., end=" ")` replaces the usual newline with a space, handy for printing on one line.

## Example
```python
for i in range(1, 4):
    print("Round", i)

fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(index, fruit)

countdown = 3
while countdown > 0:
    print(countdown)
    countdown -= 1
print("Liftoff")

for n in range(10):
    if n % 2 == 0:
        continue      # skip even numbers
    if n > 7:
        break         # stop entirely
    print(n, end=" ")
print()
```

## Output
```text
Round 1
Round 2
Round 3
0 apple
1 banana
2 cherry
3
2
1
Liftoff
1 3 5 7 
```

# Lesson: Functions
summary: def, return, default arguments, and returning more than one thing.

Define a function with `def`, give it parameters, and hand a value back with `return`. A function without a `return` still returns something: `None`.

Parameters can have **default values**, and callers can pass arguments **by name**, which makes calls self-documenting:

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

To return several values, return them separated by commas. Python packs them into a tuple, and the caller can unpack them straight into variables.

> Printing and returning are different things. `print` shows a value to a human; `return` gives it back to the code that called you. Mixing them up is the most common beginner bug in this lesson.

## Example
```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Grace"))
print(greet("Linus", greeting="Hej"))

def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([4, 9, 1, 7])
print(low, high)

def shout(text):
    print(text.upper())   # prints, but returns nothing

result = shout("no return here")
print(result)
```

## Output
```text
Hello, Grace!
Hej, Linus!
1 9
NO RETURN HERE
None
```

# Lesson: Lists & Dictionaries
summary: The two containers that do most of the heavy lifting.

A **list** is an ordered, changeable sequence. Indexing starts at 0, and negative indexes count from the end, so `items[-1]` is the last item. Slicing with `items[start:stop]` returns a new list, and `stop` is excluded, just like `range`.

A **list comprehension** builds a list from a loop in one readable line:

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

A **dictionary** maps keys to values. Look things up with `d[key]`, which raises `KeyError` if the key is missing, or with `d.get(key, default)`, which does not. Since Python 3.7, dictionaries remember insertion order.

Loop over a dictionary's pairs with `.items()`.

## Example
```python
scores = [88, 92, 75]
scores.append(100)
print(scores)
print(scores[0], scores[-1])
print(scores[1:3])
print(len(scores))

squares = [n * n for n in range(5)]
print(squares)

ages = {"Ada": 36, "Alan": 41}
ages["Grace"] = 85
print(ages["Alan"])
print(ages.get("Linus", "unknown"))

for name, age in ages.items():
    print(f"{name}: {age}")
```

## Output
```text
[88, 92, 75, 100]
88 100
[92, 75]
4
[0, 1, 4, 9, 16]
41
unknown
Ada: 36
Alan: 41
Grace: 85
```

# Lesson: Classes
summary: Bundling data and the functions that work on it.

A **class** is a blueprint; an **object** is a thing built from it. `__init__` runs when you create an object and sets up its attributes. Every method receives the object itself as its first parameter, which is called `self` by convention.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Methods with double underscores on both sides are hooks Python calls for you. `__str__` decides what `print(obj)` shows, so you see something useful instead of `<__main__.Point object at 0x...>`.

When a method gets input it cannot work with, raise an exception. Callers can then handle it with `try` / `except`.

## Example
```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        return self.balance

    def __str__(self):
        return f"{self.owner}: ${self.balance}"

account = BankAccount("Ada")
account.deposit(50)
account.deposit(25)
print(account)

try:
    account.deposit(-10)
except ValueError as err:
    print("Refused:", err)
```

## Output
```text
Ada: $75
Refused: Deposit must be positive
```

# Quiz

## Q: What does this print?
```python
x = [1, 2, 3]
y = x
y.append(4)
print(x)
```
- [ ] `[1, 2, 3]`
- [x] `[1, 2, 3, 4]`
- [ ] `[4]`
- [ ] An error
explain: `y = x` does not copy the list; it gives the same list a second name. Changing it through `y` changes what `x` sees too. Use `y = x.copy()` (or `list(x)`) when you want an independent copy.
verify: yes

## Q: What does this print?
```python
print(10 / 5)
```
- [ ] `2`
- [x] `2.0`
- [ ] `2.00`
- [ ] `'2'`
explain: In Python 3, `/` is true division and always returns a float, even when the result is a whole number. Use `//` if you want `2`.
verify: yes

## Q: Which line correctly checks whether the string `name` is empty?
- [ ] `if name == None:`
- [x] `if not name:`
- [ ] `if name.empty():`
- [ ] `if len(name) = 0:`
explain: An empty string is falsy, so `not name` is `True` exactly when it is empty. `== None` misses `""` (and `is None` is the proper way to test for `None` anyway). Strings have no `.empty()` method, and `=` is assignment, which is a syntax error inside `if`.

## Q: What does this print?
```python
for i in range(2, 10, 3):
    print(i, end=" ")
```
- [x] `2 5 8`
- [ ] `2 5 8 11`
- [ ] `3 6 9`
- [ ] `2 4 6 8`
explain: `range(2, 10, 3)` starts at 2 and adds 3 each step while staying below 10: 2, 5, 8. The stop value is never included, and 11 is past it anyway.
verify: yes

## Q: Spot the bug. What does this print?
```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))
print(add_item("b"))
```
- [ ] `['a']\n['b']`
- [x] `['a']\n['a', 'b']`
- [ ] `['a']\n['b', 'a']`
- [ ] `TypeError`
explain: Default values are evaluated once, when the function is defined, so every call shares the same list. The fix is `items=None` and then `if items is None: items = []` inside the function.
verify: yes

## Q: What does this print?
```python
print("3" * 3)
```
- [ ] `9`
- [x] `333`
- [ ] `TypeError`
- [ ] `3 3 3`
explain: Multiplying a string by an integer repeats it. Python does not silently convert `"3"` to a number; you would need `int("3") * 3` to get 9.
verify: yes

## Q: What does this print?
```python
settings = {"theme": "dark"}
print(settings.get("font"))
```
- [x] `None`
- [ ] `KeyError: 'font'`
- [ ] `""`
- [ ] `0`
explain: `.get()` returns `None` when the key is missing (or the default you pass as a second argument). `settings["font"]` is the version that raises `KeyError`.
verify: yes

# Challenge: Fix the off-by-one
kind: Fix

`total_to(n)` should return the sum of every whole number from 1 to `n`, inclusive. So `total_to(5)` is 1 + 2 + 3 + 4 + 5 = 15. It is close, but not right. Fix it.

## Starter
```python
def total_to(n):
    total = 0
    for i in range(n):
        total += i
    return total

# Tests: these lines print the results to check
print(total_to(5))
print(total_to(1))
print(total_to(100))
```

## Solution
```python
def total_to(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total

# Tests: these lines print the results to check
print(total_to(5))
print(total_to(1))
print(total_to(100))
```

## Expected
```text
15
1
5050
```

## Hints
- Print the values of `i` inside the loop. Which numbers does `range(n)` actually produce?
- `range(n)` goes from 0 to `n - 1`. You want 1 to `n`.
- `range(1, n + 1)` does it. (So does `sum(range(1, n + 1))`, if you like one-liners.)

# Challenge: Count the vowels
kind: Complete

Finish `count_vowels(text)` so it returns how many vowels (a, e, i, o, u) appear in `text`. Uppercase vowels count too.

## Starter
```python
def count_vowels(text):
    # Your code here
    pass

print(count_vowels("Codle"))
print(count_vowels("RHYTHM"))
print(count_vowels("Programming Is Fun"))
```

## Solution
```python
def count_vowels(text):
    count = 0
    for ch in text.lower():
        if ch in "aeiou":
            count += 1
    return count

print(count_vowels("Codle"))
print(count_vowels("RHYTHM"))
print(count_vowels("Programming Is Fun"))
```

## Expected
```text
2
0
5
```

## Hints
- Lowercase the text first with `text.lower()` so you only need to check one case.
- `ch in "aeiou"` is `True` when `ch` is a vowel.
- A compact version: `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: Words to lengths
kind: Transform

Make `word_lengths(sentence)` return a dictionary that maps each word to its length. Words are separated by spaces.

## Starter
```python
def word_lengths(sentence):
    # Return something like {"the": 3, "quick": 5}
    ...

print(word_lengths("the quick brown fox"))
print(word_lengths(""))
```

## Solution
```python
def word_lengths(sentence):
    return {word: len(word) for word in sentence.split()}

print(word_lengths("the quick brown fox"))
print(word_lengths(""))
```

## Expected
```text
{'the': 3, 'quick': 5, 'brown': 5, 'fox': 3}
{}
```

## Hints
- `sentence.split()` splits on whitespace and returns a list of words. For an empty string it returns `[]`.
- Build an empty dict, loop over the words, and set `result[word] = len(word)`.
- A dictionary comprehension does it in one line: `{word: len(word) for word in ...}`.

# Challenge: Remove duplicates, keep order
kind: Fix

`unique(items)` should return a new list without duplicates, keeping each item where it **first** appeared. The current version removes duplicates but scrambles the order.

## Starter
```python
def unique(items):
    return list(set(items))

print(unique([3, 1, 3, 2, 1]))
print(unique(["b", "a", "b"]))
```

## Solution
```python
def unique(items):
    seen = set()
    result = []
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

print(unique([3, 1, 3, 2, 1]))
print(unique(["b", "a", "b"]))
```

## Expected
```text
[3, 1, 2]
['b', 'a']
```

## Hints
- Sets are unordered, so converting to a set throws away the original order.
- Walk through `items` in order and keep a set of things you have already seen.
- Only append an item when it is not in `seen` yet. (`list(dict.fromkeys(items))` is a neat shortcut, because dict keys keep insertion order.)

# Playground
```python
# Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).

def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])

words = "the quick brown fox jumps over the lazy dog".split()
longest = max(words, key=len)
print(f"Longest word: {longest} ({len(longest)} letters)")
```
