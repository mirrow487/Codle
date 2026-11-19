# Lesson: Variables & Types
summary: Primitives, String, var, final, and how + behaves with text.

Java is statically typed: you declare what each variable holds, and the compiler holds you to it.

The **primitive** types store plain values: `int`, `long`, `double`, `boolean`, `char`, and a few smaller ones. `String` (capital S) is a class, not a primitive, but it is used so often that Java gives it literal syntax: `"like this"`.

Since Java 10, `var` infers a local variable's type from its value: `var city = "London";` is a `String`. `final` makes a variable unchangeable after its first assignment, and constants are conventionally written in `UPPER_SNAKE_CASE`.

`int / int` is integer division, so `7 / 2` is `3`.

The `+` operator works left to right, and once it meets a `String`, everything after becomes concatenation. So `"1" + 2 + 3` is `"123"`, while `1 + 2 + "3"` is `"33"`.

> Every Java program needs a class with a `public static void main(String[] args)` method. That boilerplate is the price of admission; after a week you stop seeing it.

## Example
```java
public class Main {
    public static void main(String[] args) {
        String name = "Ada";
        int age = 36;
        double height = 1.65;
        boolean isAdmin = false;
        var city = "London";  // inferred as String (Java 10+)
        final int MAX_USERS = 100;

        System.out.println(name + " is " + age + " years old.");
        System.out.println(height);
        System.out.println(isAdmin);
        System.out.println(city.length());
        System.out.println(MAX_USERS - age);

        System.out.println(7 / 2);
        System.out.println(7 / 2.0);
        System.out.println("1" + 2 + 3);
        System.out.println(1 + 2 + "3");
    }
}
```

## Output
```text
Ada is 36 years old.
1.65
false
6
64
3
3.5
123
33
```

# Lesson: Conditions
summary: if/else, switch expressions, and the == versus equals() trap.

`if`, `else if`, and `else` take a `boolean` condition in parentheses. Java will not treat numbers as true or false.

Since Java 14, **switch expressions** use arrows, need no `break`, and produce a value:

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

The classic `switch` statement with `case X:` and `break` still exists and you will see it in older code.

Now the important one. For objects, including `String`, `==` asks "are these the **same object**?", not "do they hold the same text?". Use `.equals()` to compare contents. Two strings can look identical and still fail `==`.

## Example
```java
public class Main {
    public static void main(String[] args) {
        int temperature = 23;

        if (temperature > 30) {
            System.out.println("Hot. Stay inside.");
        } else if (temperature >= 18) {
            System.out.println("Pleasant. Go outside.");
        } else {
            System.out.println("Bring a jacket.");
        }

        String day = "Sat";
        String kind = switch (day) {
            case "Sat", "Sun" -> "Weekend";
            default -> "Weekday";
        };
        System.out.println(kind);

        String a = "hello";
        String b = new String("hello");
        System.out.println(a == b);
        System.out.println(a.equals(b));

        String label = temperature % 2 == 0 ? "even" : "odd";
        System.out.println(label);
    }
}
```

## Output
```text
Pleasant. Go outside.
Weekend
false
true
odd
```

# Lesson: Loops
summary: for, the enhanced for, while, and do-while.

The classic `for` loop has an initialiser, a condition, and an update. The **enhanced for** loop (often called for-each) walks through every element of an array or collection:

```java
for (String fruit : fruits) { ... }
```

`while` checks its condition before each pass; `do ... while` checks after, so the body runs at least once.

`break` exits the loop and `continue` skips to the next pass. For nested loops, Java lets you label the outer loop and write `break outer;`.

## Example
```java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            System.out.println("Round " + i);
        }

        String[] fruits = {"apple", "banana", "cherry"};
        for (String fruit : fruits) {
            System.out.println(fruit.toUpperCase());
        }

        int n = 1;
        while (n < 100) {
            n *= 3;
        }
        System.out.println(n);

        int tries = 0;
        do {
            tries++;
        } while (tries < 3);
        System.out.println("Tries: " + tries);
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
summary: Static methods, overloading, and what "pass by value" really means.

Methods declare a return type (or `void`), a name, and typed parameters. Methods called straight from `main` are `static`.

Java has no default parameter values. The idiomatic substitute is **overloading**: several methods with the same name and different parameter lists, where the shorter one calls the longer one.

Java is always **pass by value**. For primitives, the method gets a copy, so changing it has no effect outside. For objects, the value being copied is the **reference**, so the method can modify the object the caller passed in, but cannot make the caller's variable point at a different object.

## Example
```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static String greet(String name) {
        return greet(name, "Hello");
    }

    static String greet(String name, String greeting) {
        return greeting + ", " + name + "!";
    }

    static int square(int x) { return x * x; }
    static double square(double x) { return x * x; }

    static void tryToChange(int x) { x = 99; }
    static void addItem(List<String> list) { list.add("new"); }

    public static void main(String[] args) {
        System.out.println(greet("Grace"));
        System.out.println(greet("Linus", "Hej"));
        System.out.println(square(9));
        System.out.println(square(1.5));

        int n = 5;
        tryToChange(n);
        System.out.println(n);

        List<String> items = new ArrayList<>();
        addItem(items);
        System.out.println(items);
    }
}
```

## Output
```text
Hello, Grace!
Hej, Linus!
81
2.25
5
[new]
```

# Lesson: Collections & Streams
summary: ArrayList, Map implementations, and processing data with streams.

`ArrayList<T>` is the go-to resizable list. Collections hold objects, so for numbers you write the wrapper type: `List<Integer>`, not `List<int>`. Java converts between `int` and `Integer` automatically (autoboxing).

A `Map<K, V>` stores key/value pairs. Pick the implementation for the ordering you need:

- `HashMap`: fastest, iteration order unspecified
- `LinkedHashMap`: remembers insertion order
- `TreeMap`: keeps keys sorted

`get` returns `null` for a missing key; `getOrDefault(key, fallback)` is usually nicer.

**Streams** let you describe a pipeline: `filter` keeps matching items, `map` transforms them, and a terminal operation like `sum()` or `collect(...)` produces the result.

## Example
```java
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Integer> scores = new ArrayList<>(List.of(88, 92, 75));
        scores.add(100);
        System.out.println(scores);
        System.out.println(scores.get(0) + " " + scores.size());

        Map<String, Integer> ages = new TreeMap<>();
        ages.put("Grace", 85);
        ages.put("Ada", 36);
        ages.put("Alan", 41);
        System.out.println(ages);
        System.out.println(ages.get("Alan"));
        System.out.println(ages.getOrDefault("Linus", -1));

        int total = scores.stream().mapToInt(Integer::intValue).sum();
        System.out.println(total);

        List<Integer> high = scores.stream()
                .filter(s -> s >= 90)
                .collect(Collectors.toList());
        System.out.println(high);
    }
}
```

## Output
```text
[88, 92, 75, 100]
88 4
{Ada=36, Alan=41, Grace=85}
41
-1
355
[92, 100]
```

# Lesson: Classes
summary: Fields, constructors, encapsulation, toString, and exceptions.

A class declares **fields** (data) and **methods** (behaviour). Make fields `private` and expose what callers need through methods. That is encapsulation, and it means you can change the inside later without breaking everyone who uses the class.

The **constructor** has the class name and no return type. `this.owner = owner;` distinguishes the field from the parameter with the same name.

Overriding `toString()` controls what `System.out.println(obj)` shows. Without it you get something like `BankAccount@1b6d3586`.

Invalid input is reported by **throwing** an exception such as `IllegalArgumentException`, which callers can handle with `try` / `catch`.

> When you run a single Java file directly, the first class in the file must be the one with `main`, which is why `Main` comes first below.

## Example
```java
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount("Ada");
        account.deposit(50);
        account.deposit(25);
        System.out.println(account);

        try {
            account.deposit(-10);
        } catch (IllegalArgumentException e) {
            System.out.println("Refused: " + e.getMessage());
        }
    }
}

class BankAccount {
    private final String owner;
    private int balance;

    BankAccount(String owner) {
        this.owner = owner;
    }

    void deposit(int amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        balance += amount;
    }

    int getBalance() {
        return balance;
    }

    @Override
    public String toString() {
        return owner + ": $" + balance;
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
```java
System.out.println(7 / 2);
```
- [x] `3`
- [ ] `3.5`
- [ ] `4`
- [ ] `3.0`
explain: Two `int` operands mean integer division; the fractional part is discarded. `7 / 2.0` gives `3.5`.
verify: yes

## Q: What does this print?
```java
String a = "hi";
String b = new String("hi");
System.out.println(a == b);
```
- [ ] `true`
- [x] `false`
- [ ] A compile error
- [ ] `hi`
explain: `new String(...)` always creates a new object, and `==` compares object identity. The texts match, but they are different objects. Use `a.equals(b)` to compare contents.
verify: yes

## Q: What does this print?
```java
System.out.println("1" + 2 + 3);
```
- [ ] `6`
- [x] `123`
- [ ] `15`
- [ ] A compile error
explain: `+` is evaluated left to right. `"1" + 2` is the string `"12"`, and `"12" + 3` is `"123"`. Write `"1" + (2 + 3)` if you want `"15"`.
verify: yes

## Q: Which line declares a resizable list of whole numbers?
- [x] `List<Integer> nums = new ArrayList<>();`
- [ ] `List<int> nums = new ArrayList<>();`
- [ ] `ArrayList nums<Integer> = new ArrayList();`
- [ ] `int[] nums = new ArrayList<>();`
explain: Generics only accept object types, so you use the wrapper `Integer` instead of the primitive `int`. The third option puts the type argument in the wrong place, and an `ArrayList` is not an array.

## Q: What does this print?
```java
int[] arr = {1, 2, 3};
System.out.println(arr.length);
```
- [x] `3`
- [ ] `2`
- [ ] A compile error: it should be `arr.length()`
- [ ] A compile error: it should be `arr.size()`
explain: Arrays have a `length` **field**. Strings have a `length()` **method**, and collections have `size()`. Yes, all three. Yes, people mix them up for years.
verify: yes

## Q: What does this print?
```java
char c = 'A';
System.out.println(c + 1);
```
- [ ] `B`
- [x] `66`
- [ ] `A1`
- [ ] A compile error
explain: Arithmetic on a `char` promotes it to `int`, and `'A'` is 65. To get `'B'`, cast back: `(char) (c + 1)`.
verify: yes

## Q: What does this print with default JVM settings?
```java
Integer a = 127, b = 127;
Integer c = 128, d = 128;
System.out.println(a == b);
System.out.println(c == d);
```
- [ ] `true\ntrue`
- [x] `true\nfalse`
- [ ] `false\nfalse`
- [ ] `false\ntrue`
explain: Autoboxing reuses cached `Integer` objects for values from -128 to 127, so `a` and `b` are the same object. 128 is outside the cache, so `c` and `d` are different objects. The lesson is the same as with strings: compare wrapper objects with `.equals()`.
verify: yes

# Challenge: Who is the admin?
kind: Fix

`isAdmin` should return `true` whenever the role is the text `"admin"`. It works in one test and fails in another. Fix it.

## Starter
```java
public class Main {
    static boolean isAdmin(String role) {
        return role == "admin";
    }

    public static void main(String[] args) {
        System.out.println(isAdmin("admin"));
        System.out.println(isAdmin(new String("admin")));
        System.out.println(isAdmin("guest"));
    }
}
```

## Solution
```java
public class Main {
    static boolean isAdmin(String role) {
        return "admin".equals(role);
    }

    public static void main(String[] args) {
        System.out.println(isAdmin("admin"));
        System.out.println(isAdmin(new String("admin")));
        System.out.println(isAdmin("guest"));
    }
}
```

## Expected
```text
true
true
false
```

## Hints
- The first test passes only because identical string literals share one object.
- `==` compares object identity. You want to compare the characters.
- Use `.equals()`. Writing `"admin".equals(role)` also avoids a `NullPointerException` if `role` is ever `null`.

# Challenge: Sum the digits
kind: Complete

Implement `sumDigits(n)` so it returns the sum of the decimal digits of a non-negative integer. For example, `sumDigits(123)` is 1 + 2 + 3 = 6.

## Starter
```java
public class Main {
    static int sumDigits(int n) {
        // Your code here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(sumDigits(123));
        System.out.println(sumDigits(9));
        System.out.println(sumDigits(4005));
        System.out.println(sumDigits(0));
    }
}
```

## Solution
```java
public class Main {
    static int sumDigits(int n) {
        int sum = 0;
        while (n > 0) {
            sum += n % 10;
            n /= 10;
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(sumDigits(123));
        System.out.println(sumDigits(9));
        System.out.println(sumDigits(4005));
        System.out.println(sumDigits(0));
    }
}
```

## Expected
```text
6
9
9
0
```

## Hints
- `n % 10` gives the last digit of `n`.
- `n / 10` (integer division) removes the last digit.
- Repeat both steps in a `while (n > 0)` loop, adding each last digit to a running total.

# Challenge: Initials
kind: Transform

Write `initials(fullName)`, which turns a name into upper-case initials followed by dots. Names may have any number of words, separated by spaces.

## Starter
```java
public class Main {
    static String initials(String fullName) {
        // Your code here
        return fullName;
    }

    public static void main(String[] args) {
        System.out.println(initials("Ada Lovelace"));
        System.out.println(initials("grace brewster hopper"));
        System.out.println(initials("Linus"));
    }
}
```

## Solution
```java
public class Main {
    static String initials(String fullName) {
        StringBuilder sb = new StringBuilder();
        for (String part : fullName.trim().split("\\s+")) {
            sb.append(Character.toUpperCase(part.charAt(0))).append('.');
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(initials("Ada Lovelace"));
        System.out.println(initials("grace brewster hopper"));
        System.out.println(initials("Linus"));
    }
}
```

## Expected
```text
A.L.
G.B.H.
L.
```

## Hints
- `fullName.split(" ")` gives you an array of words. (`"\\s+"` copes with repeated spaces too.)
- `word.charAt(0)` is the first letter, and `Character.toUpperCase` capitalises it.
- Collect the pieces in a `StringBuilder`, appending a letter and then a `'.'` for each word.

# Challenge: Fix the thermometer
kind: Fix

`Temperature.toFahrenheit()` converts Celsius to Fahrenheit with F = C × 9 / 5 + 32. Body temperature, 37 °C, should be 98.6 °F, but the class says 98.0. Fix the calculation.

## Starter
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(new Temperature(37).toFahrenheit());
        System.out.println(new Temperature(100).toFahrenheit());
        System.out.println(new Temperature(-40).toFahrenheit());
    }
}

class Temperature {
    private final int celsius;

    Temperature(int celsius) {
        this.celsius = celsius;
    }

    double toFahrenheit() {
        return celsius * 9 / 5 + 32;
    }
}
```

## Solution
```java
public class Main {
    public static void main(String[] args) {
        System.out.println(new Temperature(37).toFahrenheit());
        System.out.println(new Temperature(100).toFahrenheit());
        System.out.println(new Temperature(-40).toFahrenheit());
    }
}

class Temperature {
    private final int celsius;

    Temperature(int celsius) {
        this.celsius = celsius;
    }

    double toFahrenheit() {
        return celsius * 9.0 / 5 + 32;
    }
}
```

## Expected
```text
98.6
212.0
-40.0
```

## Hints
- The method returns a `double`, yet the answer has lost its decimals. When did that happen?
- `celsius * 9 / 5` is computed entirely with `int`s: 333 / 5 is 66, not 66.6.
- Make one operand a `double`, for example `9.0`, so the division keeps the fraction.

# Playground
```java
// Your scratchpad. Edit anything, then press Run (or Ctrl/Cmd + Enter).
import java.util.List;

public class Main {
    record Book(String title, int year) {}

    public static void main(String[] args) {
        List<Book> shelf = List.of(
            new Book("Structure and Interpretation of Computer Programs", 1985),
            new Book("The Pragmatic Programmer", 1999),
            new Book("Clean Code", 2008)
        );

        shelf.stream()
            .filter(b -> b.year() < 2000)
            .forEach(b -> System.out.println(b.year() + ": " + b.title()));
    }
}
```
