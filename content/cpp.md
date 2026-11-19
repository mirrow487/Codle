# Lesson: Variables & Types
summary: Fundamental types, std::string, auto, and how bools print.

C++ is statically typed and compiled to machine code. Every variable has a type decided at compile time, and many mistakes are caught before the program runs.

The fundamental types: `int` (whole numbers), `double` (decimals), `char` (a single character, in single quotes), and `bool`. Text lives in `std::string`, from the `<string>` header.

`auto` asks the compiler to deduce the type from the initial value. `auto x = 9.5;` makes `x` a `double`.

Output goes through `std::cout` and the `<<` operator. `"\n"` ends a line.

Two things that catch newcomers:

- `int / int` is **integer division**: `7 / 2` is `3`. Make one side a `double` for `3.5`.
- `bool` values print as `1` and `0` unless you send `std::boolalpha` to the stream first.

> A local variable that you declare without a value holds whatever happened to be in that memory. Reading it is undefined behaviour. Always initialise: `int count = 0;`, not `int count;`.

## Example
```cpp
#include <iostream>
#include <string>

int main() {
    std::string name = "Ada";
    int age = 36;
    double height = 1.65;
    bool isAdmin = false;
    auto score = 9.5;  // deduced as double

    std::cout << name << " is " << age << " years old.\n";
    std::cout << height << " " << score << "\n";
    std::cout << isAdmin << "\n";
    std::cout << std::boolalpha << isAdmin << "\n";
    std::cout << 7 / 2 << " " << 7 / 2.0 << " " << 7 % 2 << "\n";
}
```

## Output
```text
Ada is 36 years old.
1.65 9.5
0
false
3 3.5 1
```

# Lesson: Conditions
summary: if/else, switch on integers and chars, and the ternary operator.

`if`, `else if`, and `else` work as you would expect. Comparisons are `==`, `!=`, `<`, `<=`, `>`, `>=`, combined with `&&` (and), `||` (or), and `!` (not).

A classic C++ trap: `if (x = 5)` compiles. It **assigns** 5 to `x` and then tests the result, which is always true. Compilers warn about it, so read your warnings.

`switch` works on integers, characters, and enums, but **not** on `std::string`. Each case runs on into the next one unless you `break`, which is occasionally useful and frequently a bug.

```cpp
switch (grade) {
    case 'A':
        std::cout << "Excellent\n";
        break;
    case 'B':
    case 'C':                   // both 'B' and 'C' land here
        std::cout << "Good\n";
        break;
    default:
        std::cout << "Keep going\n";
}
```

The ternary `condition ? a : b` picks one of two values.

## Example
```cpp
#include <iostream>
#include <string>

int main() {
    int temperature = 23;

    if (temperature > 30) {
        std::cout << "Hot. Stay inside.\n";
    } else if (temperature >= 18) {
        std::cout << "Pleasant. Go outside.\n";
    } else {
        std::cout << "Bring a jacket.\n";
    }

    char grade = 'B';
    switch (grade) {
        case 'A':
            std::cout << "Excellent\n";
            break;
        case 'B':
        case 'C':
            std::cout << "Good\n";
            break;
        default:
            std::cout << "Keep going\n";
    }

    std::string label = (temperature % 2 == 0) ? "even" : "odd";
    std::cout << label << "\n";
}
```

## Output
```text
Pleasant. Go outside.
Good
odd
```

# Lesson: Loops
summary: for, range-based for, while, and do-while.

The classic `for` loop has an initialiser, a condition, and an increment. `++i` and `i++` behave the same in a loop header.

The **range-based for** loop visits each element of a container. Write `const auto&` to look at each element without copying it, or `auto&` when you want to modify the elements in place.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` checks before each pass; `do ... while` checks after, so it runs at least once.

## Example
```cpp
#include <iostream>
#include <string>
#include <vector>

int main() {
    for (int i = 1; i <= 3; ++i) {
        std::cout << "Round " << i << "\n";
    }

    std::vector<std::string> fruits = {"apple", "banana", "cherry"};
    for (const auto& fruit : fruits) {
        std::cout << fruit << " has " << fruit.size() << " letters\n";
    }

    int n = 1;
    while (n < 100) {
        n *= 3;
    }
    std::cout << n << "\n";

    int tries = 0;
    do {
        ++tries;
    } while (tries < 3);
    std::cout << "Tries: " << tries << "\n";
}
```

## Output
```text
Round 1
Round 2
Round 3
apple has 5 letters
banana has 6 letters
cherry has 6 letters
243
Tries: 3
```

# Lesson: Functions & References
summary: Pass by value, pass by reference, const references, and overloading.

By default, C++ passes arguments **by value**: the function gets its own copy, and changes to it stay inside the function.

Add `&` to the parameter type to pass **by reference**. The function then works on the caller's actual variable.

For large objects you only want to read, use a **const reference**, `const std::string& name`. It avoids the copy and promises not to modify the argument. This is the standard way to accept strings and containers.

Default arguments go at the end of the parameter list, and **overloading** lets several functions share a name as long as their parameter types differ.

## Example
```cpp
#include <iostream>
#include <string>

void addOneByValue(int x) { x += 1; }
void addOneByRef(int& x) { x += 1; }

std::string greet(const std::string& name, const std::string& greeting = "Hello") {
    return greeting + ", " + name + "!";
}

int square(int x) { return x * x; }
double square(double x) { return x * x; }

int main() {
    int a = 10;
    addOneByValue(a);
    std::cout << a << "\n";
    addOneByRef(a);
    std::cout << a << "\n";

    std::cout << greet("Grace") << "\n";
    std::cout << greet("Linus", "Hej") << "\n";
    std::cout << square(9) << " " << square(1.5) << "\n";
}
```

## Output
```text
10
11
Hello, Grace!
Hej, Linus!
81 2.25
```

# Lesson: Vectors & Maps
summary: std::vector for sequences, std::map for sorted key/value pairs.

`std::vector<T>` is the default container: a resizable array. `push_back` appends, `size()` counts, and `front()` / `back()` read the ends.

`v[i]` does no bounds checking; reading past the end is undefined behaviour. `v.at(i)` checks and throws `std::out_of_range` instead.

`std::map<K, V>` stores key/value pairs **sorted by key**. Since C++17 you can unpack each pair in a loop with structured bindings: `for (const auto& [key, value] : m)`.

> `m["missing"]` does not fail. It **inserts** the key with a default value (0 for an `int`). Use `m.count(key)` or `m.find(key)` when you only want to check.

## Example
```cpp
#include <iostream>
#include <map>
#include <string>
#include <vector>

int main() {
    std::vector<int> scores = {88, 92, 75};
    scores.push_back(100);
    std::cout << scores.size() << "\n";
    std::cout << scores.front() << " " << scores.back() << "\n";

    int total = 0;
    for (int s : scores) total += s;
    std::cout << total << "\n";

    std::map<std::string, int> ages = {{"Grace", 85}, {"Ada", 36}};
    ages["Alan"] = 41;
    for (const auto& [name, age] : ages) {
        std::cout << name << ": " << age << "\n";
    }
    std::cout << ages.count("Linus") << "\n";
}
```

## Output
```text
4
88 100
355
Ada: 36
Alan: 41
Grace: 85
0
```

# Lesson: Classes
summary: Private data, constructors with initializer lists, and const member functions.

A `class` bundles data with the functions that operate on it. Members are **private** by default, so outside code cannot touch them directly; the `public:` section is the interface. (`struct` is identical except that members default to public.)

The **constructor** initialises the object. Its **member initializer list**, after the colon, sets members directly rather than assigning them afterwards:

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

A member function marked `const` promises not to modify the object, and it is the only kind you can call on a `const` object. Mark getters `const` by habit.

The trailing underscore on member names is a common convention, not a rule. It just makes members easy to spot.

## Example
```cpp
#include <iostream>
#include <string>

class BankAccount {
public:
    BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}

    bool deposit(int amount) {
        if (amount <= 0) return false;
        balance_ += amount;
        return true;
    }

    int balance() const { return balance_; }
    const std::string& owner() const { return owner_; }

private:
    std::string owner_;
    int balance_;
};

int main() {
    BankAccount account("Ada");
    account.deposit(50);
    account.deposit(25);
    std::cout << account.owner() << ": $" << account.balance() << "\n";
    std::cout << std::boolalpha << account.deposit(-10) << "\n";
}
```

## Output
```text
Ada: $75
false
```

# Quiz

## Q: What does this print?
```cpp
std::cout << 7 / 2;
```
- [x] `3`
- [ ] `3.5`
- [ ] `4`
- [ ] `3.0`
explain: Both operands are `int`, so this is integer division, which truncates toward zero. `7 / 2.0` would give `3.5`.
verify: yes

## Q: What does this print?
```cpp
bool ok = true;
std::cout << ok;
```
- [x] `1`
- [ ] `true`
- [ ] `True`
- [ ] Nothing
explain: Streams print `bool` as `1` or `0` by default. Insert `std::boolalpha` first (`std::cout << std::boolalpha << ok;`) to get `true`.
verify: yes

## Q: Which signature reads a large vector without copying it and without being able to modify it?
- [x] `void f(const std::vector<int>& v)`
- [ ] `void f(std::vector<int> v)`
- [ ] `void f(std::vector<int>& v)`
- [ ] `void f(std::vector<int>* const v)`
explain: A const reference avoids the copy and forbids modification. Pass-by-value copies the whole vector. A plain reference allows changes. `std::vector<int>* const` is a constant pointer to a non-const vector, so the function could still modify the elements.

## Q: What does this print?
```cpp
std::vector<int> v = {1, 2, 3};
std::cout << v.size() << "\n";
v.push_back(4);
std::cout << v[3] << "\n";
```
- [x] `3\n4`
- [ ] `3\n3`
- [ ] `4\n4`
- [ ] It crashes
explain: The vector starts with three elements, so `size()` is 3. After `push_back(4)` there are four, and index 3 (the fourth element) is 4.
verify: yes

## Q: What is wrong with this code?
```cpp
int* p = new int(5);
p = new int(6);
```
- [ ] Nothing
- [x] The first `int` is leaked: nothing points to it any more, so it can never be deleted
- [ ] It does not compile: `p` already points to something
- [ ] The second `new` overwrites the first value, so `*p` is still 5
explain: Every `new` needs a matching `delete`. Reassigning `p` loses the only pointer to the first allocation, so that memory stays allocated until the program ends. Modern C++ sidesteps this with `std::make_unique` or plain values.

## Q: What does this print?
```cpp
std::string s = "abc";
std::cout << s.length() + s[0];
```
- [ ] `abc3`
- [ ] `3a`
- [x] `100`
- [ ] It does not compile
explain: `s[0]` is the `char` `'a'`, and a `char` is just a small integer: 97 in ASCII. `s.length()` is 3, so the sum is the number 100.
verify: yes

## Q: What does this print? (compiled as C++17)
```cpp
std::map<std::string, int> m;
std::cout << m["x"] << " " << m.size();
```
- [x] `0 1`
- [ ] `0 0`
- [ ] It throws `std::out_of_range`
- [ ] It does not compile
explain: `operator[]` inserts a default value (0) when the key is missing, so the map now has one entry. Since C++17, the operands of `<<` are evaluated left to right, so the insertion happens before `size()` is called.
verify: yes

# Challenge: Make the change stick
kind: Fix

`doubleAll` is supposed to double every number in the vector it receives. The loop looks right, yet the numbers do not change. Fix it.

## Starter
```cpp
#include <iostream>
#include <vector>

void doubleAll(std::vector<int> values) {
    for (int& v : values) {
        v *= 2;
    }
}

int main() {
    std::vector<int> nums = {1, 2, 3};
    doubleAll(nums);
    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";
}
```

## Solution
```cpp
#include <iostream>
#include <vector>

void doubleAll(std::vector<int>& values) {
    for (int& v : values) {
        v *= 2;
    }
}

int main() {
    std::vector<int> nums = {1, 2, 3};
    doubleAll(nums);
    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";
}
```

## Expected
```text
2 4 6
```

## Hints
- The loop does double the values. Which vector is it doubling?
- Without `&` on the parameter, `doubleAll` receives a copy of `nums`.
- Take the vector by reference: `std::vector<int>& values`.

# Challenge: Count a character
kind: Complete

Implement `countChar(s, c)` so it returns how many times the character `c` appears in the string `s`.

## Starter
```cpp
#include <iostream>
#include <string>

int countChar(const std::string& s, char c) {
    // Your code here
    return 0;
}

int main() {
    std::cout << countChar("banana", 'a') << "\n";
    std::cout << countChar("hello", 'l') << "\n";
    std::cout << countChar("hello", 'z') << "\n";
}
```

## Solution
```cpp
#include <iostream>
#include <string>

int countChar(const std::string& s, char c) {
    int count = 0;
    for (char ch : s) {
        if (ch == c) ++count;
    }
    return count;
}

int main() {
    std::cout << countChar("banana", 'a') << "\n";
    std::cout << countChar("hello", 'l') << "\n";
    std::cout << countChar("hello", 'z') << "\n";
}
```

## Expected
```text
3
2
0
```

## Hints
- A range-based for loop works on strings too: `for (char ch : s)`.
- Compare each character with `c` and increase a counter when they match.
- The standard library has a one-liner: `std::count(s.begin(), s.end(), c)` from `<algorithm>`.

# Challenge: Keep only the evens
kind: Transform

Make `evens(values)` return a **new** vector containing only the even numbers, in their original order.

## Starter
```cpp
#include <iostream>
#include <vector>

std::vector<int> evens(const std::vector<int>& values) {
    // Your code here
    return values;
}

void print(const std::vector<int>& v) {
    std::cout << "[";
    for (std::size_t i = 0; i < v.size(); ++i) {
        if (i > 0) std::cout << ", ";
        std::cout << v[i];
    }
    std::cout << "]\n";
}

int main() {
    print(evens({1, 2, 3, 4, 5, 6}));
    print(evens({7, 9}));
    print(evens({-4, 0, 3}));
}
```

## Solution
```cpp
#include <iostream>
#include <vector>

std::vector<int> evens(const std::vector<int>& values) {
    std::vector<int> result;
    for (int v : values) {
        if (v % 2 == 0) result.push_back(v);
    }
    return result;
}

void print(const std::vector<int>& v) {
    std::cout << "[";
    for (std::size_t i = 0; i < v.size(); ++i) {
        if (i > 0) std::cout << ", ";
        std::cout << v[i];
    }
    std::cout << "]\n";
}

int main() {
    print(evens({1, 2, 3, 4, 5, 6}));
    print(evens({7, 9}));
    print(evens({-4, 0, 3}));
}
```

## Expected
```text
[2, 4, 6]
[]
[-4, 0]
```

## Hints
- Start with an empty `std::vector<int> result;` and return it at the end.
- `v % 2 == 0` is true for even numbers, including 0 and negative evens.
- `result.push_back(v)` adds a number to the end.

# Challenge: The largest number
kind: Fix

`largest` should return the biggest number in a non-empty vector. It works for some inputs and quietly fails for others. Fix it.

## Starter
```cpp
#include <iostream>
#include <vector>

int largest(const std::vector<int>& v) {
    int best = 0;
    for (int x : v) {
        if (x > best) best = x;
    }
    return best;
}

int main() {
    std::cout << largest({3, 9, 2}) << "\n";
    std::cout << largest({-5, -2, -8}) << "\n";
    std::cout << largest({7}) << "\n";
}
```

## Solution
```cpp
#include <iostream>
#include <vector>

int largest(const std::vector<int>& v) {
    int best = v[0];
    for (int x : v) {
        if (x > best) best = x;
    }
    return best;
}

int main() {
    std::cout << largest({3, 9, 2}) << "\n";
    std::cout << largest({-5, -2, -8}) << "\n";
    std::cout << largest({7}) << "\n";
}
```

## Expected
```text
9
-2
7
```

## Hints
- Which test fails? What do all its numbers have in common?
- If every number is negative, none of them is bigger than the starting value 0.
- Start from a real element: `int best = v[0];` (the vector is never empty here). `std::max_element` from `<algorithm>` also works.

# Playground
```cpp
// Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).
#include <iostream>
#include <string>
#include <vector>

int main() {
    std::vector<std::string> steps = {"write", "compile", "fix", "compile", "run"};

    for (std::size_t i = 0; i < steps.size(); ++i) {
        std::cout << i + 1 << ". " << steps[i] << "\n";
    }
    std::cout << "Total steps: " << steps.size() << "\n";
}
```
