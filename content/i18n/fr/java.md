tagline: Verbeux à dessein, portable par conception, et toujours au cœur d'une part remarquable des backends du monde.
runtime: Java 21 · compilé sur un JDK distant

# Lesson: Variables et types
summary: Types primitifs, String, var, final, et le comportement de + avec du texte.

Java est typé statiquement : vous déclarez ce que contient chaque variable, et le compilateur vous y tient.

Les types **primitifs** stockent des valeurs simples : `int`, `long`, `double`, `boolean`, `char` et quelques plus petits. `String` (avec un S majuscule) est une classe, pas un primitif, mais on l'utilise tellement que Java lui offre une syntaxe littérale : `"like this"`.

Depuis Java 10, `var` déduit le type d'une variable locale à partir de sa valeur : `var city = "London";` est un `String`. `final` rend une variable non modifiable après sa première affectation, et les constantes s'écrivent par convention en `UPPER_SNAKE_CASE`.

`int / int` est une division entière, donc `7 / 2` vaut `3`.

L'opérateur `+` travaille de gauche à droite, et dès qu'il rencontre un `String`, tout ce qui suit devient de la concaténation. C'est pourquoi `"1" + 2 + 3` vaut `"123"`, tandis que `1 + 2 + "3"` vaut `"33"`.

> Tout programme Java a besoin d'une classe avec une méthode `public static void main(String[] args)`. Ce code répétitif est le prix d'entrée ; au bout d'une semaine, vous ne le voyez plus.

# Lesson: Conditions
summary: if/else, expressions switch et le piège de == face à equals().

`if`, `else if` et `else` prennent une condition `boolean` entre parenthèses. Java ne traite pas les nombres comme vrais ou faux.

Depuis Java 14, les **expressions switch** utilisent des flèches, n'ont pas besoin de `break` et produisent une valeur :

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

L'instruction `switch` classique avec `case X:` et `break` existe toujours, et vous la verrez dans du code ancien.

Maintenant, l'essentiel. Pour les objets, `String` compris, `==` demande « est-ce **le même objet** ? », pas « contiennent-ils le même texte ? ». Utilisez `.equals()` pour comparer les contenus. Deux chaînes peuvent sembler identiques et échouer quand même au test `==`.

# Lesson: Boucles
summary: for, le for amélioré, while et do-while.

La boucle `for` classique a un initialiseur, une condition et une mise à jour. La **boucle for améliorée** (souvent appelée for-each) parcourt chaque élément d'un tableau ou d'une collection :

```java
for (String fruit : fruits) { ... }
```

`while` vérifie sa condition avant chaque tour ; `do ... while` la vérifie après, donc le corps s'exécute au moins une fois.

`break` quitte la boucle et `continue` passe au tour suivant. Pour les boucles imbriquées, Java vous permet d'étiqueter la boucle extérieure et d'écrire `break outer;`.

# Lesson: Méthodes
summary: Méthodes statiques, surcharge, et ce que « passage par valeur » veut vraiment dire.

Les méthodes déclarent un type de retour (ou `void`), un nom et des paramètres typés. Les méthodes appelées directement depuis `main` sont `static`.

Java n'a pas de valeurs par défaut pour les paramètres. Le substitut idiomatique est la **surcharge** : plusieurs méthodes de même nom avec des listes de paramètres différentes, la plus courte appelant la plus longue.

Java **passe toujours par valeur**. Pour les primitifs, la méthode reçoit une copie, et la modifier n'a aucun effet à l'extérieur. Pour les objets, la valeur copiée est la **référence** : la méthode peut donc modifier l'objet passé par l'appelant, mais pas faire pointer la variable de l'appelant vers un autre objet.

# Lesson: Collections et streams
summary: ArrayList, implémentations de Map et traitement des données avec les streams.

`ArrayList<T>` est la liste redimensionnable de référence. Les collections contiennent des objets, donc pour les nombres vous écrivez le type enveloppe : `List<Integer>`, pas `List<int>`. Java convertit automatiquement entre `int` et `Integer` (autoboxing).

Une `Map<K, V>` stocke des paires clé/valeur. Choisissez l'implémentation selon l'ordre dont vous avez besoin :

- `HashMap` : la plus rapide, ordre de parcours non spécifié
- `LinkedHashMap` : conserve l'ordre d'insertion
- `TreeMap` : garde les clés triées

`get` renvoie `null` pour une clé absente ; `getOrDefault(key, fallback)` est souvent plus agréable.

Les **streams** vous permettent de décrire une chaîne de traitement : `filter` garde les éléments qui correspondent, `map` les transforme, et une opération terminale comme `sum()` ou `collect(...)` produit le résultat.

# Lesson: Classes
summary: Champs, constructeurs, encapsulation, toString et exceptions.

Une classe déclare des **champs** (données) et des **méthodes** (comportement). Rendez les champs `private` et exposez par des méthodes ce dont les appelants ont besoin. C'est l'encapsulation, et cela signifie que vous pourrez changer l'intérieur plus tard sans casser le code de ceux qui utilisent la classe.

Le **constructeur** porte le nom de la classe et n'a pas de type de retour. `this.owner = owner;` distingue le champ du paramètre de même nom.

Redéfinir `toString()` contrôle ce qu'affiche `System.out.println(obj)`. Sans cela, vous obtenez quelque chose comme `BankAccount@1b6d3586`.

Une entrée invalide se signale en **levant** une exception comme `IllegalArgumentException`, que les appelants peuvent gérer avec `try` / `catch`.

> Quand vous exécutez directement un seul fichier Java, la première classe du fichier doit être celle qui a `main` ; c'est pourquoi `Main` vient en premier ci-dessous.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Deux opérandes `int` signifient une division entière ; la partie décimale est jetée. `7 / 2.0` donne `3.5`.

## Q: Qu'affiche ce code ?
- =
- =
- Une erreur de compilation
- =
explain: `new String(...)` crée toujours un nouvel objet, et `==` compare l'identité des objets. Les textes sont identiques, mais ce sont des objets différents. Utilisez `a.equals(b)` pour comparer les contenus.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur de compilation
explain: `+` est évalué de gauche à droite. `"1" + 2` est la chaîne `"12"`, et `"12" + 3` vaut `"123"`. Écrivez `"1" + (2 + 3)` si vous voulez `"15"`.

## Q: Quelle ligne déclare une liste extensible de nombres entiers ?
- =
- =
- =
- =
explain: Les génériques n'acceptent que des types objets, donc on utilise l'enveloppe `Integer` au lieu du primitif `int`. La troisième option place l'argument de type au mauvais endroit, et une `ArrayList` n'est pas un tableau.

## Q: Qu'affiche ce code ?
- =
- =
- Une erreur de compilation : il faudrait `arr.length()`
- Une erreur de compilation : il faudrait `arr.size()`
explain: Les tableaux ont un **champ** `length`. Les chaînes ont une **méthode** `length()`, et les collections ont `size()`. Oui, les trois. Oui, on les confond pendant des années.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur de compilation
explain: Un calcul sur un `char` le promeut en `int`, et `'A'` vaut 65. Pour obtenir `'B'`, reconvertissez : `(char) (c + 1)`.

## Q: Qu'affiche ce code avec les réglages par défaut de la JVM ?
- =
- =
- =
- =
explain: L'autoboxing réutilise des objets `Integer` mis en cache pour les valeurs de -128 à 127, donc `a` et `b` sont le même objet. 128 est hors du cache, donc `c` et `d` sont des objets différents. La leçon est la même qu'avec les chaînes : comparez les objets enveloppes avec `.equals()`.

# Challenge: Qui est admin ?

`isAdmin` devrait renvoyer `true` chaque fois que le rôle est le texte `"admin"`. Cela marche dans un test et échoue dans un autre. Corrigez-la.

## Hints
- Le premier test ne passe que parce que les littéraux de chaîne identiques partagent un même objet.
- `==` compare l'identité des objets. Vous voulez comparer les caractères.
- Utilisez `.equals()`. Écrire `"admin".equals(role)` évite aussi une `NullPointerException` si `role` vaut un jour `null`.

# Challenge: Additionnez les chiffres

Implémentez `sumDigits(n)` pour qu'elle renvoie la somme des chiffres décimaux d'un entier positif ou nul. Par exemple, `sumDigits(123)` vaut 1 + 2 + 3 = 6.

## Hints
- `n % 10` donne le dernier chiffre de `n`.
- `n / 10` (division entière) supprime le dernier chiffre.
- Répétez ces deux étapes dans une boucle `while (n > 0)`, en ajoutant chaque dernier chiffre à un total.

# Challenge: Initiales

Écrivez `initials(fullName)`, qui transforme un nom en initiales majuscules suivies de points. Les noms peuvent comporter un nombre quelconque de mots, séparés par des espaces.

## Hints
- `fullName.split(" ")` vous donne un tableau de mots. (`"\\s+"` gère aussi les espaces répétés.)
- `word.charAt(0)` est la première lettre, et `Character.toUpperCase` la met en majuscule.
- Rassemblez les morceaux dans un `StringBuilder`, en ajoutant une lettre puis un `'.'` pour chaque mot.

# Challenge: Réparez le thermomètre

`Temperature.toFahrenheit()` convertit des Celsius en Fahrenheit avec F = C × 9 / 5 + 32. La température du corps, 37 °C, devrait donner 98.6 °F, mais la classe dit 98.0. Corrigez le calcul.

## Hints
- La méthode renvoie un `double`, et pourtant la réponse a perdu ses décimales. Quand est-ce arrivé ?
- `celsius * 9 / 5` est calculé entièrement avec des `int` : 333 / 5 vaut 66, pas 66.6.
- Faites de l'un des opérandes un `double`, par exemple `9.0`, pour que la division garde la fraction.
