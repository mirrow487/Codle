tagline: Lisible, livré avec tout le nécessaire et présent partout, de la data science au script qui renomme vos photos de vacances.
runtime: Python 3.12 · Pyodide, s'exécute dans votre navigateur

# Lesson: Variables et types
summary: Des noms, des valeurs et la poignée de types que vous utiliserez tous les jours.

En Python, une variable est un nom qui pointe vers une valeur. Pas de `let`, pas de `var`, pas de déclaration de type. Vous affectez, et le nom existe.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

Python déduit le type à partir de la valeur. Ceux que vous croiserez sans arrêt :

- `int` pour les nombres entiers, aussi grands que la mémoire le permet
- `float` pour les nombres décimaux, avec les bizarreries habituelles de la virgule flottante
- `str` pour le texte, entre guillemets simples ou doubles
- `bool` pour `True` et `False` (avec une majuscule)
- `None` pour « rien, volontairement »

`type()` vous dit ce que vous avez entre les mains. Une **f-string** (une chaîne précédée d'un `f`) permet d'insérer n'importe quelle expression dans le texte avec `{}`.

Un mot rapide sur la division : `/` renvoie toujours un float, `//` arrondit le résultat vers le bas et `%` donne le reste.

> Les noms sont sensibles à la casse et s'écrivent par convention en `snake_case`. `Total` et `total` sont deux variables différentes, ce qui est un moyen fiable de perdre un après-midi.

# Lesson: Conditions
summary: if, elif, else, et pourquoi l'indentation n'est pas ici une question de style.

Python utilise l'indentation pour regrouper le code. Les lignes indentées sous un `if` lui appartiennent, et le bloc se termine quand l'indentation s'arrête. La convention est de quatre espaces.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

Les comparaisons sont `==`, `!=`, `<`, `<=`, `>`, `>=`. On les combine avec les mots `and`, `or`, `not`. Python accepte aussi les comparaisons enchaînées : `18 <= age < 65` signifie exactement ce qu'il semble dire.

Toute valeur est soit **vraie** (truthy), soit **fausse** (falsy). Les valeurs fausses sont `False`, `None`, zéro (`0`, `0.0`) et les conteneurs vides (`""`, `[]`, `{}`). Tout le reste compte comme vrai, c'est pourquoi `if not items:` est la façon idiomatique de demander « cette liste est-elle vide ? ».

Pour les valeurs courtes de type « l'un ou l'autre », il existe une expression conditionnelle : `value_if_true if condition else value_if_false`.

# Lesson: Boucles
summary: for parcourt les choses, while répète jusqu'à ce qu'on l'arrête.

En Python, une boucle `for` parcourt tout ce qui est itérable : listes, chaînes, dictionnaires, fichiers, intervalles. Il n'y a pas de `for (i = 0; ...)` à la mode C. Quand vous avez besoin de nombres, utilisez `range`.

`range(start, stop, step)` s'arrête **avant** `stop`. Ainsi `range(1, 4)` donne 1, 2, 3. Avec un seul argument, il commence à 0.

Quand vous avez besoin de la position et de l'élément, `enumerate` vous donne les deux, ce qui vaut bien mieux que de gérer un compteur à la main.

Une boucle `while` se répète tant que sa condition est vraie. Assurez-vous que quelque chose à l'intérieur finit par la rendre fausse, sinon vous ferez connaissance avec le message « Exécution arrêtée ».

`break` quitte la boucle immédiatement. `continue` passe à l'itération suivante.

> `print(..., end=" ")` remplace le retour à la ligne habituel par un espace, pratique pour afficher sur une seule ligne.

# Lesson: Fonctions
summary: def, return, arguments par défaut et renvoyer plus d'une chose.

On définit une fonction avec `def`, on lui donne des paramètres et on renvoie une valeur avec `return`. Une fonction sans `return` renvoie quand même quelque chose : `None`.

Les paramètres peuvent avoir des **valeurs par défaut**, et l'appelant peut passer les arguments **par nom**, ce qui rend les appels explicites :

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

Pour renvoyer plusieurs valeurs, renvoyez-les séparées par des virgules. Python les regroupe dans un tuple, et l'appelant peut les décomposer directement dans des variables.

> Afficher et renvoyer sont deux choses différentes. `print` montre une valeur à un humain ; `return` la rend au code qui vous a appelé. Les confondre est l'erreur de débutant la plus courante de cette leçon.

# Lesson: Listes et dictionnaires
summary: Les deux conteneurs qui font l'essentiel du travail.

Une **liste** est une séquence ordonnée et modifiable. Les indices commencent à 0, et les indices négatifs comptent depuis la fin : `items[-1]` est donc le dernier élément. Le découpage avec `items[start:stop]` renvoie une nouvelle liste, et `stop` est exclu, exactement comme avec `range`.

Une **compréhension de liste** construit une liste à partir d'une boucle, en une seule ligne lisible :

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

Un **dictionnaire** associe des clés à des valeurs. On lit avec `d[key]`, qui lève `KeyError` si la clé manque, ou avec `d.get(key, default)`, qui ne le fait pas. Depuis Python 3.7, les dictionnaires conservent l'ordre d'insertion.

Parcourez les paires d'un dictionnaire avec `.items()`.

# Lesson: Classes
summary: Regrouper des données et les fonctions qui les manipulent.

Une **classe** est un plan ; un **objet** est une chose construite à partir de ce plan. `__init__` s'exécute quand vous créez un objet et prépare ses attributs. Chaque méthode reçoit l'objet lui-même comme premier paramètre, nommé `self` par convention.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Les méthodes entourées de doubles tirets bas sont des points d'accroche que Python appelle pour vous. `__str__` décide de ce qu'affiche `print(obj)`, pour que vous voyiez quelque chose d'utile au lieu de `<__main__.Point object at 0x...>`.

Quand une méthode reçoit une entrée qu'elle ne peut pas traiter, elle lève une exception. L'appelant peut la gérer avec `try` / `except`.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur
explain: `y = x` ne copie pas la liste ; cela donne un second nom à la même liste. La modifier via `y` change aussi ce que voit `x`. Utilisez `y = x.copy()` (ou `list(x)`) quand vous voulez une copie indépendante.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: En Python 3, `/` est une vraie division et renvoie toujours un float, même quand le résultat est entier. Utilisez `//` si vous voulez `2`.

## Q: Quelle ligne vérifie correctement si la chaîne `name` est vide ?
- =
- =
- =
- =
explain: Une chaîne vide est fausse, donc `not name` vaut `True` exactement quand elle est vide. `== None` rate `""` (et de toute façon, on teste `None` correctement avec `is None`). Les chaînes n'ont pas de méthode `.empty()`, et `=` est une affectation, ce qui donne une erreur de syntaxe dans un `if`.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `range(2, 10, 3)` commence à 2 et ajoute 3 à chaque pas tant qu'il reste sous 10 : 2, 5, 8. La valeur d'arrêt n'est jamais incluse, et 11 la dépasse de toute façon.

## Q: Trouvez le bug. Qu'affiche ce code ?
- =
- =
- =
- =
explain: Les valeurs par défaut sont évaluées une seule fois, à la définition de la fonction, donc tous les appels partagent la même liste. La correction consiste à écrire `items=None`, puis `if items is None: items = []` dans la fonction.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Multiplier une chaîne par un entier la répète. Python ne convertit pas `"3"` en nombre en douce ; il faudrait `int("3") * 3` pour obtenir 9.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `.get()` renvoie `None` quand la clé manque (ou la valeur par défaut passée en second argument). La version qui lève `KeyError` est `settings["font"]`.

# Challenge: Corrigez le décalage d'un

`total_to(n)` devrait renvoyer la somme de tous les entiers de 1 à `n` inclus. Ainsi `total_to(5)` vaut 1 + 2 + 3 + 4 + 5 = 15. C'est presque ça, mais pas tout à fait. Corrigez-le.

## Hints
- Affichez les valeurs de `i` dans la boucle. Quels nombres `range(n)` produit-il réellement ?
- `range(n)` va de 0 à `n - 1`. Vous voulez de 1 à `n`.
- `range(1, n + 1)` fait l'affaire. (Tout comme `sum(range(1, n + 1))`, si vous aimez les solutions en une ligne.)

# Challenge: Comptez les voyelles

Complétez `count_vowels(text)` pour qu'elle renvoie le nombre de voyelles (a, e, i, o, u) présentes dans `text`. Les voyelles majuscules comptent aussi.

## Hints
- Passez d'abord le texte en minuscules avec `text.lower()`, pour n'avoir qu'une casse à vérifier.
- `ch in "aeiou"` vaut `True` quand `ch` est une voyelle.
- Une version compacte : `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: Des mots aux longueurs

Faites en sorte que `word_lengths(sentence)` renvoie un dictionnaire qui associe chaque mot à sa longueur. Les mots sont séparés par des espaces.

## Hints
- `sentence.split()` découpe sur les espaces et renvoie une liste de mots. Pour une chaîne vide, il renvoie `[]`.
- Créez un dictionnaire vide, parcourez les mots et faites `result[word] = len(word)`.
- Une compréhension de dictionnaire le fait en une ligne : `{word: len(word) for word in ...}`.

# Challenge: Supprimez les doublons, gardez l'ordre

`unique(items)` devrait renvoyer une nouvelle liste sans doublons, en laissant chaque élément là où il est apparu **en premier**. La version actuelle supprime les doublons mais mélange l'ordre.

## Hints
- Les ensembles (set) ne sont pas ordonnés : convertir en ensemble jette l'ordre d'origine.
- Parcourez `items` dans l'ordre et gardez dans un ensemble ce que vous avez déjà vu.
- N'ajoutez un élément que s'il n'est pas encore dans `seen`. (`list(dict.fromkeys(items))` est un raccourci élégant, car les clés d'un dictionnaire conservent l'ordre d'insertion.)
