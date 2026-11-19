# Lesson: Variables & Types
summary: Static types, var, and why 7 / 2 is 3.

C# is **statically typed**: every variable has a type fixed at compile time, and the compiler refuses to put a string where an `int` belongs. That catches a whole category of bugs before your program ever runs.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

The types you will use daily: `int` (whole numbers), `double` (decimals), `decimal` (exact decimals, the right choice for money), `bool`, `char` (one character, in single quotes), and `string` (text, in double quotes).

`var` lets the compiler infer the type from the value. It is still static typing: `var city = "London";` makes `city` a `string` forever.

When both sides of `/` are integers, C# does **integer division** and drops the remainder. Make either side a `double` to get a fractional result.

Strings prefixed with `$` are **interpolated**: `{expression}` inside them is replaced with its value.

> Every C# program here lives inside a class with a `static void Main()` method. That is where execution starts.

## Example
```csharp
using System;

class Program
{
    static void Main()
    {
        string name = "Ada";
        int age = 36;
        double height = 1.65;
        bool isAdmin = false;
        var city = "London"; // inferred as string at compile time

        Console.WriteLine($"{name} is {age} years old.");
        Console.WriteLine(height);
        Console.WriteLine(isAdmin);
        Console.WriteLine(city.GetType());

        Console.WriteLine(7 / 2);
        Console.WriteLine(7 / 2.0);
        Console.WriteLine(7 % 2);
    }
}
```

## Output
```text
Ada is 36 years old.
1.65
False
System.String
3
3.5
1
```

# Lesson: Conditions & switch
summary: if/else, switch statements, and the ternary operator.

`if`, `else if`, and `else` take a condition in parentheses. The condition must be a real `bool`; C# will not treat `0` or `null` as false for you, which saves you from a classic C mistake.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

A `switch` statement compares one value against several cases. Every case section must end with `break` (or `return`), and you can stack labels to share one body:

```csharp
switch (day)
{
    case "Sat":
    case "Sun":
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Weekday");
        break;
}
```

Modern C# (version 9 and later) also has compact **switch expressions**, which produce a value:

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

For simple two-way choices, the ternary `condition ? a : b` keeps it on one line.

## Example
```csharp
using System;

class Program
{
    static void Main()
    {
        int temperature = 23;

        if (temperature > 30)
            Console.WriteLine("Hot. Stay inside.");
        else if (temperature >= 18)
            Console.WriteLine("Pleasant. Go outside.");
        else
            Console.WriteLine("Bring a jacket.");

        string day = "Sat";
        switch (day)
        {
            case "Sat":
            case "Sun":
                Console.WriteLine("Weekend");
                break;
            default:
                Console.WriteLine("Weekday");
                break;
        }

        string label = temperature % 2 == 0 ? "even" : "odd";
        Console.WriteLine(label);
    }
}
```

## Output
```text
Pleasant. Go outside.
Weekend
odd
```

# Lesson: Loops
summary: for, foreach, while, and do-while.

The `for` loop packs a start, a condition, and an update into one line. `foreach` walks through every item of an array or collection, and it is the one to reach for when you do not need the index.

`while` checks its condition before each pass. `do ... while` checks after, so its body always runs at least once.

`break` exits the loop; `continue` jumps to the next iteration.

> You cannot add or remove items from a `List` while a `foreach` is walking through it. C# throws an `InvalidOperationException` rather than letting you get into a muddle.

## Example
```csharp
using System;

class Program
{
    static void Main()
    {
        for (int i = 1; i <= 3; i++)
        {
            Console.WriteLine("Round " + i);
        }

        string[] fruits = { "apple", "banana", "cherry" };
        foreach (string fruit in fruits)
        {
            Console.WriteLine(fruit.ToUpper());
        }

        int n = 1;
        while (n < 100)
        {
            n *= 3;
        }
        Console.WriteLine(n);

        int tries = 0;
        do
        {
            tries++;
        } while (tries < 3);
        Console.WriteLine("Tries: " + tries);
    }
}
```

## Output
```text
Round 1
Round 2
Round 3
APPLE
BANANA
CHERRY
243
Tries: 3
```

# Lesson: Methods
summary: Return types, optional parameters, overloading, and out parameters.

A method declares its return type before its name, or `void` if it returns nothing. Methods called directly from `Main` are marked `static`, because there is no object to call them on.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

For one-line methods there is an **expression body**: `static int Square(int x) => x * x;`

Parameters can be **optional** by giving them a default value. You can also **overload** a method: write several versions with the same name but different parameter types, and the compiler picks the right one for each call.

An `out` parameter lets a method hand back an extra value. The framework's `TryParse` methods use this pattern: they return `true` or `false` for success and put the parsed value in the `out` variable.

## Example
```csharp
using System;

class Program
{
    static string Greet(string name, string greeting = "Hello")
    {
        return $"{greeting}, {name}!";
    }

    static int Square(int x) => x * x;
    static double Square(double x) => x * x;

    static bool TryParseAge(string text, out int age)
    {
        return int.TryParse(text, out age) && age >= 0;
    }

    static void Main()
    {
        Console.WriteLine(Greet("Grace"));
        Console.WriteLine(Greet("Linus", "Hej"));
        Console.WriteLine(Square(9));
        Console.WriteLine(Square(1.5));

        if (TryParseAge("42", out int parsed))
        {
            Console.WriteLine("Parsed " + parsed);
        }
        Console.WriteLine(TryParseAge("forty-two", out _));
    }
}
```

## Output
```text
Hello, Grace!
Hej, Linus!
81
2.25
Parsed 42
False
```

# Lesson: Collections & LINQ
summary: List<T>, Dictionary<K, V>, and querying data with LINQ.

Arrays have a fixed size. A `List<T>` grows as you add to it, where `T` is the type of item it holds. `Count` tells you how many items it has.

A `Dictionary<TKey, TValue>` maps keys to values. Reading a missing key with `dict[key]` throws `KeyNotFoundException`, so use `TryGetValue` when the key might not be there.

**LINQ** (from `using System.Linq;`) adds query methods to every collection: `Where` filters, `Select` transforms, and `Sum`, `Max`, `Count`, and friends summarise.

> `Console.WriteLine(myList)` prints `System.Collections.Generic.List`1[System.Int32]`, which is accurate and completely unhelpful. Use `string.Join(", ", myList)` to see the contents.

## Example
```csharp
using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        var scores = new List<int> { 88, 92, 75 };
        scores.Add(100);
        Console.WriteLine(scores.Count);
        Console.WriteLine(string.Join(", ", scores));

        var ages = new Dictionary<string, int>
        {
            ["Ada"] = 36,
            ["Alan"] = 41
        };
        ages["Grace"] = 85;
        Console.WriteLine(ages["Alan"]);

        if (!ages.TryGetValue("Linus", out int linusAge))
        {
            Console.WriteLine("No age for Linus");
        }

        var doubledHighs = scores.Where(s => s >= 90).Select(s => s * 2);
        Console.WriteLine(string.Join(", ", doubledHighs));
        Console.WriteLine(scores.Sum());
    }
}
```

## Output
```text
4
88, 92, 75, 100
41
No age for Linus
184, 200
355
```

# Lesson: Classes
summary: Properties, constructors, methods, and exceptions.

A **class** groups data and behaviour. Data is usually exposed through **properties**, which look like fields from the outside but can control access:

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

The **constructor** has the same name as the class and no return type. It runs when you write `new BankAccount("Ada")`.

Overriding `ToString()` controls how an object looks when it is printed or put in an interpolated string.

When a method receives input it cannot accept, it **throws** an exception. The caller can catch it with `try` / `catch`.

## Example
```csharp
using System;

class BankAccount
{
    public string Owner { get; }
    public decimal Balance { get; private set; }

    public BankAccount(string owner)
    {
        Owner = owner;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentException("Deposit must be positive");
        Balance += amount;
    }

    public override string ToString() => $"{Owner}: ${Balance}";
}

class Program
{
    static void Main()
    {
        var account = new BankAccount("Ada");
        account.Deposit(50);
        account.Deposit(25);
        Console.WriteLine(account);

        try
        {
            account.Deposit(-10);
        }
        catch (ArgumentException ex)
        {
            Console.WriteLine("Refused: " + ex.Message);
        }
    }
}
```

## Output
```text
Ada: $75
Refused: Deposit must be positive
```

# Quiz

## Q: What does this print?
```csharp
Console.WriteLine(7 / 2);
```
- [x] `3`
- [ ] `3.5`
- [ ] `4`
- [ ] `3.0`
explain: Both operands are `int`, so C# performs integer division and discards the remainder (it truncates toward zero). Write `7 / 2.0` or cast one side to `double` to get `3.5`.
verify: yes

## Q: What does this print?
```csharp
bool ready = true;
Console.WriteLine(ready);
```
- [ ] `true`
- [x] `True`
- [ ] `1`
- [ ] `TRUE`
explain: `bool.ToString()` returns `"True"` or `"False"`, capitalised. The C# keywords are lowercase, the printed text is not. It surprises everyone exactly once.
verify: yes

## Q: Which line creates an empty, growable list of strings?
- [x] `var names = new List<string>();`
- [ ] `List names = new List();`
- [ ] `string[] names = new List<string>();`
- [ ] `var names = new List<string>[];`
explain: `List<T>` is generic, so you must say what it holds, and you call its constructor with `()`. A `List<string>` is not a `string[]`, and `new List<string>[]` would try to create an array of lists without a size.

## Q: What does this print?
```csharp
string a = "hi";
string b = "h" + "i".ToLower();
Console.WriteLine(a == b);
```
- [x] `True`
- [ ] `False`
- [ ] A compile error
- [ ] An exception
explain: For strings, C# overloads `==` to compare the characters, not the references. Two strings with the same content are equal, however they were built. (Java does this differently, which trips people moving between them.)
verify: yes

## Q: What does this print?
```csharp
int x = 5;
int y = x++ + ++x;
Console.WriteLine(y);
```
- [ ] `10`
- [ ] `11`
- [x] `12`
- [ ] `13`
explain: C# evaluates operands strictly left to right. `x++` yields 5 and then sets `x` to 6. `++x` sets `x` to 7 and yields 7. So `y` is 5 + 7 = 12. Legal, well-defined, and still not something to write in real code.
verify: yes

## Q: What happens when this runs?
```csharp
int[] slots = new int[3];
Console.WriteLine(slots[3]);
```
- [ ] It prints `0`
- [ ] It prints nothing
- [x] It throws `IndexOutOfRangeException`
- [ ] It does not compile
explain: A 3-element array has indexes 0, 1, and 2. C# checks array bounds at run time, so reading index 3 throws. The compiler does not catch it because the index could come from anywhere.

## Q: What does this print?
```csharp
Console.WriteLine(10 / 4.0);
```
- [ ] `2`
- [x] `2.5`
- [ ] `2.50`
- [ ] `3`
explain: `4.0` is a `double`, so the `int` 10 is promoted and the division is done in floating point.
verify: yes

# Challenge: Fix the average
kind: Fix

`Average` should return the exact mean of the numbers, but it keeps losing the decimal part. Fix it.

## Starter
```csharp
using System;

class Program
{
    static double Average(int[] numbers)
    {
        int sum = 0;
        foreach (int n in numbers)
        {
            sum += n;
        }
        return sum / numbers.Length;
    }

    static void Main()
    {
        Console.WriteLine(Average(new[] { 1, 2 }));
        Console.WriteLine(Average(new[] { 3, 4, 5, 6 }));
        Console.WriteLine(Average(new[] { 10 }));
    }
}
```

## Solution
```csharp
using System;

class Program
{
    static double Average(int[] numbers)
    {
        int sum = 0;
        foreach (int n in numbers)
        {
            sum += n;
        }
        return (double)sum / numbers.Length;
    }

    static void Main()
    {
        Console.WriteLine(Average(new[] { 1, 2 }));
        Console.WriteLine(Average(new[] { 3, 4, 5, 6 }));
        Console.WriteLine(Average(new[] { 10 }));
    }
}
```

## Expected
```text
1.5
4.5
10
```

## Hints
- The method returns a `double`, so why is the answer whole? Look at the types in the division.
- `int / int` is integer division. The result is truncated before it is converted to `double`.
- Cast before dividing: `(double)sum / numbers.Length`.

# Challenge: Count the words
kind: Complete

Implement `CountWords` so it returns the number of words in `text`. Words are separated by one or more spaces, and leading or trailing spaces should not count as words.

## Starter
```csharp
using System;

class Program
{
    static int CountWords(string text)
    {
        // Your code here
        return 0;
    }

    static void Main()
    {
        Console.WriteLine(CountWords("hello world"));
        Console.WriteLine(CountWords("  lots   of   space  "));
        Console.WriteLine(CountWords("one"));
    }
}
```

## Solution
```csharp
using System;

class Program
{
    static int CountWords(string text)
    {
        return text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length;
    }

    static void Main()
    {
        Console.WriteLine(CountWords("hello world"));
        Console.WriteLine(CountWords("  lots   of   space  "));
        Console.WriteLine(CountWords("one"));
    }
}
```

## Expected
```text
2
3
1
```

## Hints
- `text.Split(' ')` splits on spaces, but repeated spaces leave empty strings in the result.
- `StringSplitOptions.RemoveEmptyEntries` drops those empty strings.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` is the whole answer.

# Challenge: FizzBuzz, properly
kind: Transform

Make `FizzBuzz(n)` return `"Fizz"` for multiples of 3, `"Buzz"` for multiples of 5, `"FizzBuzz"` for multiples of both, and the number itself otherwise.

## Starter
```csharp
using System;
using System.Linq;

class Program
{
    static string FizzBuzz(int n)
    {
        // Your code here
        return n.ToString();
    }

    static void Main()
    {
        var results = Enumerable.Range(1, 15).Select(FizzBuzz);
        Console.WriteLine(string.Join(" ", results));
    }
}
```

## Solution
```csharp
using System;
using System.Linq;

class Program
{
    static string FizzBuzz(int n)
    {
        if (n % 15 == 0) return "FizzBuzz";
        if (n % 3 == 0) return "Fizz";
        if (n % 5 == 0) return "Buzz";
        return n.ToString();
    }

    static void Main()
    {
        var results = Enumerable.Range(1, 15).Select(FizzBuzz);
        Console.WriteLine(string.Join(" ", results));
    }
}
```

## Expected
```text
1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz
```

## Hints
- `n % 3 == 0` is true when `n` is a multiple of 3.
- Order matters: check "multiple of both" first, or 15 will return `"Fizz"` and stop there.
- A multiple of both 3 and 5 is a multiple of 15.

# Challenge: Finish the Rectangle
kind: Complete

Complete the `Area` and `IsSquare` properties of `Rectangle`.

## Starter
```csharp
using System;

class Rectangle
{
    public int Width { get; }
    public int Height { get; }

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }

    public int Area => 0;          // fix me
    public bool IsSquare => false; // fix me
}

class Program
{
    static void Main()
    {
        var a = new Rectangle(3, 4);
        var b = new Rectangle(5, 5);
        Console.WriteLine($"{a.Area} {a.IsSquare}");
        Console.WriteLine($"{b.Area} {b.IsSquare}");
    }
}
```

## Solution
```csharp
using System;

class Rectangle
{
    public int Width { get; }
    public int Height { get; }

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }

    public int Area => Width * Height;
    public bool IsSquare => Width == Height;
}

class Program
{
    static void Main()
    {
        var a = new Rectangle(3, 4);
        var b = new Rectangle(5, 5);
        Console.WriteLine($"{a.Area} {a.IsSquare}");
        Console.WriteLine($"{b.Area} {b.IsSquare}");
    }
}
```

## Expected
```text
12 False
25 True
```

## Hints
- `=>` on a property defines a computed, read-only property. Whatever is on the right is recalculated each time it is read.
- Inside the class you can use `Width` and `Height` directly.
- `Area => Width * Height;` and `IsSquare => Width == Height;`

# Playground
```csharp
// Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).
using System;
using System.Linq;

class Program
{
    static void Main()
    {
        string[] words = { "compile", "debug", "ship", "refactor", "test" };

        var byLength = words.OrderBy(w => w.Length).ThenBy(w => w);
        foreach (var w in byLength)
        {
            Console.WriteLine($"{w,-10}{new string('#', w.Length)}");
        }
    }
}
```
