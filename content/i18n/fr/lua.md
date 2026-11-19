tagline: Minuscule, rapide et intégré dans bien plus de jeux et d'outils qu'on ne l'imagine. Les tableaux commencent à 1 ; faites-vous une raison.
runtime: Lua 5.3 · Fengari, s'exécute dans votre navigateur

# Lesson: Variables et types
summary: local, nil, nombres, chaînes et l'opérateur ..

En Lua, les variables sont **globales par défaut**, ce qui est rarement ce que vous voulez. Mettez `local` devant chaque nouvelle variable, sauf raison contraire. Les locales sont plus rapides et ne peuvent pas fuir dans du code qui ne les attendait pas.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua a un petit ensemble de types : `nil`, `boolean`, `number`, `string`, `table` et `function` (plus `userdata` et `thread`, que vous pouvez ignorer pour l'instant). Une variable jamais affectée vaut simplement `nil`.

Depuis Lua 5.3, les nombres ont deux sous-types : **integer** (entier) et **float** (flottant). `/` produit toujours un float, tandis que `//` est la division arrondie vers le bas.

Les chaînes se concatènent avec `..` (deux points), pas avec `+`, et `#` donne la longueur d'une chaîne. Les nombres sont convertis en texte automatiquement lors de la concaténation.

> `print` avec plusieurs arguments les sépare par des tabulations. Les exemples ici construisent le plus souvent une seule chaîne avec `..` pour garder une sortie propre.

# Lesson: Conditions
summary: if/then/end, ~= et la très courte liste des valeurs fausses.

Les conditions utilisent `if ... then`, un `elseif` facultatif (en un seul mot) et `else`, et se terminent par `end`.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

« Différent de » s'écrit `~=`. Les opérateurs logiques sont les mots `and`, `or` et `not`.

Voici ce qui surprend les gens venus d'autres langages : **seuls `nil` et `false` sont faux**. Zéro est vrai. La chaîne vide est vraie. Une table vide est vraie.

`and` et `or` renvoient l'un de leurs opérandes plutôt qu'un booléen strict, ce qui donne deux idiomes pratiques :

- `x or default` utilise `default` quand `x` vaut `nil` (ou `false`)
- `cond and a or b` fonctionne comme un opérateur ternaire, à condition que `a` ne soit ni `false` ni `nil`

# Lesson: Boucles
summary: for numérique, while, repeat...until et le continue absent.

Le `for` numérique compte d'une valeur de départ à une valeur de fin, et la fin est **incluse**. Un troisième nombre facultatif fixe le pas, qui peut être négatif.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` vérifie avant chaque tour. `repeat ... until cond` vérifie **après** chaque tour, donc son corps s'exécute toujours au moins une fois.

`break` sort d'une boucle. Lua n'a pas de `continue` ; les substituts habituels sont d'envelopper le corps dans un `if`, ou d'utiliser un `goto continue` avec une étiquette `::continue::` à la fin du corps.

Il existe aussi le `for` générique, qui parcourt les tables avec `ipairs` et `pairs`. Vous le verrez dans la leçon sur les tables.

# Lesson: Fonctions
summary: Plusieurs valeurs de retour, arguments variables et fermetures.

Déclarez les fonctions avec `local function name(params) ... end`. Les arguments manquants arrivent sous la forme `nil`, d'où l'écriture standard `param = param or default` pour fournir des valeurs par défaut.

Les fonctions Lua peuvent **renvoyer plusieurs valeurs** à la fois, et l'appelant peut les récupérer dans plusieurs variables :

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` recueille un nombre quelconque d'arguments. Enveloppez-le dans une table, `{...}`, pour les parcourir.

Les fonctions sont des valeurs ordinaires. Vous pouvez les stocker dans des variables, les passer partout et les renvoyer depuis d'autres fonctions. Une fonction interne garde l'accès aux variables locales de la fonction qui l'a créée ; c'est ce qu'on appelle une **fermeture** (closure).

# Lesson: Tables
summary: L'unique structure de données de Lua, utilisée comme tableau, dictionnaire et objet.

Lua a exactement une structure de données, la **table**, et elle fait tout.

Utilisée comme **tableau**, une table est indexée à partir de **1**, pas de 0. `#t` donne la longueur, et `table.insert(t, value)` ajoute à la fin.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

Utilisée comme **dictionnaire**, les clés peuvent être des chaînes (ou presque n'importe quelle valeur). `t.name` est un raccourci pour `t["name"]`. Lire une clé qui n'existe pas donne `nil` plutôt qu'une erreur.

Parcourez les tableaux avec `ipairs` (dans l'ordre, de 1 à n) et les dictionnaires avec `pairs`. L'ordre de `pairs` n'est **pas** garanti ; n'en dépendez jamais.

`table.concat(t, sep)` joint un tableau de chaînes ; c'est le moyen le plus rapide d'en afficher un.

# Lesson: Métatables et objets
summary: Comment une table plus une métatable devient une classe, et ce que signifient les deux-points.

Lua n'a pas de classes, mais il a des **métatables** : une table attachée à une autre table qui modifie son comportement. Le champ le plus utile est `__index`. Quand vous lisez une clé qu'une table n'a pas, Lua la cherche dans `__index`.

Cela suffit pour construire des objets. Mettez les méthodes dans une table, définissez-la comme `__index`, et chaque instance s'y rabat :

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

Le détail clé, ce sont les **deux-points** (colon). `function Dog:speak()` est un raccourci pour `function Dog.speak(self)`, et `rex:speak()` est un raccourci pour `rex.speak(rex)`. Confondre `.` et `:` est le bug Lua le plus courant qui soit.

`error(message)` lève une erreur, et `pcall(f, ...)` appelle une fonction en mode protégé, en renvoyant `false` et le message d'erreur au lieu de planter. Le message est précédé du nom du fichier et du numéro de ligne.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur
explain: Les tableaux Lua commencent à l'indice 1. L'indice 0 ne contient tout simplement rien, et lire une clé absente donne `nil` plutôt qu'une erreur.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur
explain: En Lua, seuls `nil` et `false` sont faux. Zéro et la chaîne vide sont tous deux vrais, contrairement à C, JavaScript ou Python.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur
explain: `/` effectue toujours une division flottante en Lua 5.3 et après, donc le résultat est le float `5.0`. Utilisez `//` pour la division arrondie vers le bas, qui donne ici l'entier `5`.

## Q: Quel opérateur joint deux chaînes ?
- =
- =
- =
- =
explain: Lua utilise `..` pour la concaténation. `+` est strictement arithmétique : `"10" + 1` convertit la chaîne et donne `11`, tandis que `"a" + 1` est une erreur.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Une erreur
explain: L'opérateur de longueur `#` est prioritaire sur `..`, donc ceci vaut `(#"hello") .. "!"`, c'est-à-dire `5 .. "!"`. Le nombre est converti en texte lors de la concaténation.

## Q: Comment écrit-on « différent de » en Lua ?
- =
- =
- =
- =
explain: Lua utilise `~=`. Écrire `!=` est une erreur de syntaxe, et une erreur très fréquente chez ceux qui viennent d'autres langages.

## Q: Qu'affiche ce code ?
- =
- =
- Une erreur
- =
explain: `limit` a été affectée sans `local`, elle est donc devenue une variable globale qui survit à la fonction. C'est exactement pour cela qu'il faut écrire `local` par réflexe.

# Challenge: Additionnez depuis le bon indice

`sum(nums)` devrait additionner les nombres d'une table utilisée comme tableau. Au lieu de cela, elle plante. Corrigez-la.

## Hints
- Lisez le message d'erreur : il dit que quelque chose vaut `nil`. Quel indice vaudrait `nil` ?
- Les tableaux Lua commencent à 1, donc `nums[0]` vaut `nil`.
- Commencez la boucle à 1 : `for i = 1, #nums do`. (Ou utilisez `for _, n in ipairs(nums) do`.)

# Challenge: Vérifiez les palindromes

Complétez `isPalindrome(word)` pour qu'elle renvoie `true` quand le mot se lit de la même façon à l'envers, sans tenir compte de la casse.

## Hints
- Les chaînes ont des méthodes qu'on appelle avec deux-points, comme `word:lower()`.
- Il existe un `string.reverse` intégré, appelable sous la forme `word:reverse()`.
- Passez d'abord en minuscules, puis comparez la chaîne avec son inverse.

# Challenge: Écrivez map

Écrivez `map(t, fn)`, qui renvoie une **nouvelle** table contenant `fn(item)` pour chaque élément du tableau `t`. La table d'origine ne doit pas changer.

## Hints
- Créez une table vide, `local result = {}`, et renvoyez-la à la fin.
- Bouclez avec `for i, v in ipairs(t) do` et stockez `fn(v)` dans `result[i]`.
- Écrire dans `result` plutôt que dans `t` laisse l'original intact.

# Challenge: Point ou deux-points ?

L'objet `Counter` devrait compter jusqu'à 2, mais il plante. Corrigez le bug avec la plus petite modification possible.

## Hints
- L'erreur mentionne `self`. Quelle valeur a `self` dans `increment` ?
- `function Counter:increment()` attend l'objet comme premier argument caché.
- `c:increment()` passe automatiquement `c` comme `self` ; `c.increment()` ne passe rien.
