tagline: Typé statiquement, bien rangé, et pilier des applications .NET comme des jeux Unity.
runtime: C# · compilé sur un compilateur .NET/Mono distant

# Lesson: Variables et types
summary: Types statiques, var, et pourquoi 7 / 2 vaut 3.

C# est **typé statiquement** : chaque variable a un type fixé à la compilation, et le compilateur refuse de mettre une chaîne là où un `int` est attendu. Cela élimine toute une catégorie de bugs avant même que votre programme ne s'exécute.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

Les types que vous utiliserez au quotidien : `int` (nombres entiers), `double` (décimaux), `decimal` (décimaux exacts, le bon choix pour l'argent), `bool`, `char` (un caractère, entre apostrophes) et `string` (du texte, entre guillemets).

`var` laisse le compilateur déduire le type à partir de la valeur. C'est toujours du typage statique : `var city = "London";` fait de `city` un `string` pour toujours.

Quand les deux côtés de `/` sont des entiers, C# effectue une **division entière** et jette le reste. Rendez l'un des côtés `double` pour obtenir un résultat décimal.

Les chaînes préfixées par `$` sont **interpolées** : `{expression}` y est remplacé par sa valeur.

> Chaque programme C# ici vit dans une classe dotée d'une méthode `static void Main()`. C'est là que l'exécution commence.

# Lesson: Conditions et switch
summary: if/else, instructions switch et opérateur ternaire.

`if`, `else if` et `else` prennent une condition entre parenthèses. La condition doit être un vrai `bool` ; C# ne traitera pas `0` ou `null` comme faux à votre place, ce qui vous épargne une erreur classique du C.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

Une instruction `switch` compare une valeur à plusieurs cas. Chaque section de cas doit se terminer par `break` (ou `return`), et vous pouvez empiler les étiquettes pour partager un même corps :

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

Le C# moderne (version 9 et suivantes) a aussi des **expressions switch** compactes, qui produisent une valeur :

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

Pour les choix simples entre deux options, le ternaire `condition ? a : b` tient sur une ligne.

# Lesson: Boucles
summary: for, foreach, while et do-while.

La boucle `for` réunit un départ, une condition et une mise à jour sur une ligne. `foreach` parcourt chaque élément d'un tableau ou d'une collection ; c'est elle qu'il faut choisir quand vous n'avez pas besoin de l'indice.

`while` vérifie sa condition avant chaque tour. `do ... while` la vérifie après, donc son corps s'exécute toujours au moins une fois.

`break` quitte la boucle ; `continue` passe à l'itération suivante.

> Vous ne pouvez pas ajouter ou retirer des éléments d'une `List` pendant qu'un `foreach` la parcourt. C# lève une `InvalidOperationException` plutôt que de vous laisser vous embrouiller.

# Lesson: Méthodes
summary: Types de retour, paramètres optionnels, surcharge et paramètres out.

Une méthode déclare son type de retour avant son nom, ou `void` si elle ne renvoie rien. Les méthodes appelées directement depuis `Main` sont marquées `static`, car il n'y a pas d'objet sur lequel les appeler.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

Pour les méthodes d'une ligne, il existe un **corps d'expression** : `static int Square(int x) => x * x;`

Les paramètres peuvent être **optionnels** si vous leur donnez une valeur par défaut. Vous pouvez aussi **surcharger** une méthode : écrire plusieurs versions portant le même nom mais avec des types de paramètres différents, et le compilateur choisit la bonne à chaque appel.

Un paramètre `out` permet à une méthode de renvoyer une valeur supplémentaire. Les méthodes `TryParse` du framework utilisent ce modèle : elles renvoient `true` ou `false` selon la réussite et placent la valeur analysée dans la variable `out`.

# Lesson: Collections et LINQ
summary: List<T>, Dictionary<K, V> et l'interrogation des données avec LINQ.

Les tableaux ont une taille fixe. Une `List<T>` grandit au fur et à mesure des ajouts, `T` étant le type des éléments qu'elle contient. `Count` indique combien d'éléments elle a.

Un `Dictionary<TKey, TValue>` associe des clés à des valeurs. Lire une clé absente avec `dict[key]` lève `KeyNotFoundException` ; utilisez donc `TryGetValue` quand la clé peut manquer.

**LINQ** (via `using System.Linq;`) ajoute des méthodes de requête à toutes les collections : `Where` filtre, `Select` transforme, et `Sum`, `Max`, `Count` et compagnie résument.

> `Console.WriteLine(myList)` affiche le nom du type de la liste plutôt que son contenu, ce qui est exact et parfaitement inutile. Utilisez `string.Join(", ", myList)` pour voir le contenu.

# Lesson: Classes
summary: Propriétés, constructeurs, méthodes et exceptions.

Une **classe** regroupe des données et un comportement. Les données sont généralement exposées par des **propriétés**, qui ressemblent à des champs vues de l'extérieur mais peuvent contrôler l'accès :

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

Le **constructeur** porte le nom de la classe et n'a pas de type de retour. Il s'exécute quand vous écrivez `new BankAccount("Ada")`.

Redéfinir `ToString()` contrôle l'apparence d'un objet quand il est affiché ou inséré dans une chaîne interpolée.

Quand une méthode reçoit une entrée qu'elle ne peut pas accepter, elle **lève** une exception. L'appelant peut l'intercepter avec `try` / `catch`.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Les deux opérandes sont des `int`, donc C# effectue une division entière et jette le reste (il tronque vers zéro). Écrivez `7 / 2.0` ou convertissez un côté en `double` pour obtenir `3.5`.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `bool.ToString()` renvoie `"True"` ou `"False"`, avec une majuscule. Les mots-clés C# sont en minuscules, pas le texte affiché. Cela surprend tout le monde exactement une fois.

## Q: Quelle ligne crée une liste de chaînes vide et extensible ?
- =
- =
- =
- =
explain: `List<T>` est générique : il faut indiquer ce qu'elle contient, et son constructeur s'appelle avec `()`. Une `List<string>` n'est pas un `string[]`, et `new List<string>[]` essaierait de créer un tableau de listes sans taille.

## Q: Qu'affiche ce code ?
- =
- =
- Une erreur de compilation
- Une exception
explain: Pour les chaînes, C# surcharge `==` afin de comparer les caractères, pas les références. Deux chaînes de même contenu sont égales, quelle que soit la façon dont elles ont été construites. (Java fait autrement, ce qui piège ceux qui passent de l'un à l'autre.)

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: C# évalue les opérandes strictement de gauche à droite. `x++` donne 5 puis met `x` à 6. `++x` met `x` à 7 et donne 7. Donc `y` vaut 5 + 7 = 12. Légal, bien défini, et pourtant à ne pas écrire dans du vrai code.

## Q: Que se passe-t-il à l'exécution ?
- Il affiche `0`
- Il n'affiche rien
- Il lève une `IndexOutOfRangeException`
- Il ne compile pas
explain: Un tableau de 3 éléments a les indices 0, 1 et 2. C# vérifie les bornes des tableaux à l'exécution, donc lire l'indice 3 lève une exception. Le compilateur ne le détecte pas, car l'indice pourrait venir de n'importe où.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `4.0` est un `double`, donc l'`int` 10 est promu et la division se fait en virgule flottante.

# Challenge: Corrigez la moyenne

`Average` devrait renvoyer la moyenne exacte des nombres, mais elle perd sans cesse la partie décimale. Corrigez-la.

## Hints
- La méthode renvoie un `double` ; alors pourquoi la réponse est-elle entière ? Regardez les types dans la division.
- `int / int` est une division entière. Le résultat est tronqué avant d'être converti en `double`.
- Convertissez avant de diviser : `(double)sum / numbers.Length`.

# Challenge: Comptez les mots

Implémentez `CountWords` pour qu'elle renvoie le nombre de mots de `text`. Les mots sont séparés par un ou plusieurs espaces, et les espaces en début ou en fin ne doivent pas compter comme des mots.

## Hints
- `text.Split(' ')` découpe sur les espaces, mais les espaces répétés laissent des chaînes vides dans le résultat.
- `StringSplitOptions.RemoveEmptyEntries` supprime ces chaînes vides.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` est toute la réponse.

# Challenge: FizzBuzz, comme il faut

Faites en sorte que `FizzBuzz(n)` renvoie `"Fizz"` pour les multiples de 3, `"Buzz"` pour les multiples de 5, `"FizzBuzz"` pour les multiples des deux, et le nombre lui-même sinon.

## Hints
- `n % 3 == 0` est vrai quand `n` est un multiple de 3.
- L'ordre compte : testez d'abord « multiple des deux », sinon 15 renverra `"Fizz"` et s'arrêtera là.
- Un multiple de 3 et de 5 à la fois est un multiple de 15.

# Challenge: Terminez Rectangle

Complétez les propriétés `Area` et `IsSquare` de `Rectangle`.

## Hints
- `=>` sur une propriété définit une propriété calculée en lecture seule. Ce qui se trouve à droite est recalculé à chaque lecture.
- Dans la classe, vous pouvez utiliser `Width` et `Height` directement.
- `Area => Width * Height;` et `IsSquare => Width == Height;`
