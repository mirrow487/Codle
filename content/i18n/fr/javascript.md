tagline: Le langage du Web. Excentrique par endroits, extrêmement capable partout.
runtime: JavaScript · s'exécute dans votre navigateur, sortie console au format Node.js

# Lesson: Variables et types
summary: let, const et les sept types primitifs que vous rencontrerez vraiment.

Déclarez les variables avec `const` quand la liaison ne sera pas réaffectée, et avec `let` quand elle le sera. Préférez `const` d'abord : il dit au lecteur « ce nom pointe toujours vers la même chose ». Vous verrez aussi `var` dans du code ancien. Ses règles de portée sont plus lâches, et le code moderne l'évite.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

Les types du quotidien sont `string`, `number` (un seul type pour les entiers et les décimaux), `boolean`, `undefined` (déclaré mais jamais affecté), `null` (vide volontairement), plus `bigint` et `symbol` pour les cas particuliers. Tout le reste, tableaux et fonctions compris, est un objet.

Les **littéraux de gabarit** (template literals) utilisent des accents graves et permettent d'insérer des expressions avec `${...}`.

> `typeof null` vaut `"object"`. C'est un bug de 1995 qu'on ne pourra jamais corriger sans casser le Web. Testez null avec `value === null`.

# Lesson: Conditions et égalité
summary: if/else, pourquoi === est celui qu'il vous faut et ce qui compte comme « faux ».

`if`, `else if` et `else` fonctionnent comme prévu, avec la condition entre parenthèses et le corps entre accolades.

JavaScript a deux opérateurs d'égalité. `===` (strict) compare la valeur **et** le type. `==` (souple) convertit d'abord les types, selon des règles que personne n'apprend volontairement. Utilisez `===` et `!==` sauf raison précise.

Les valeurs **fausses** (falsy) sont `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` et `NaN`. Tout le reste est vrai, y compris `"0"`, `[]` et `{}`.

Deux opérateurs de valeur par défaut qui se ressemblent sans être identiques :

- `a || b` renvoie `b` si `a` est **n'importe quelle** valeur fausse
- `a ?? b` renvoie `b` seulement si `a` vaut `null` ou `undefined`

Donc si `0` est une valeur légitime, c'est `??` qui ne la jettera pas.

# Lesson: Boucles
summary: Le for classique, for...of pour les valeurs et les méthodes de tableau qui bouclent pour vous.

La boucle `for` classique a trois parties : un point de départ, une condition vérifiée avant chaque tour et une mise à jour exécutée après chaque tour.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

Quand vous voulez simplement chaque valeur d'un tableau (ou d'une chaîne, d'une Map, d'un Set), `for...of` est plus propre. Il existe aussi `for...in`, qui parcourt les **clés** d'un objet ; évitez-le pour les tableaux, car il vous donne les indices sous forme de chaînes.

Les tableaux ont aussi `forEach`, qui appelle une fonction pour chaque élément et passe l'indice en second argument.

`while` se répète tant que sa condition est vraie. `break` sort d'une boucle plus tôt ; `continue` passe à l'itération suivante.

# Lesson: Fonctions
summary: Déclarations, fonctions fléchées, paramètres par défaut et fermetures.

Il y a deux façons courantes d'écrire une fonction :

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

Une fonction fléchée réduite à une seule expression la renvoie automatiquement. Ajoutez des accolades et il vous faut de nouveau un `return` explicite. L'oublier est une source classique de `undefined` mystérieux.

Les paramètres peuvent avoir des **valeurs par défaut** : `function greet(name, greeting = "Hello")`.

Les fonctions se souviennent des variables qui étaient visibles là où elles ont été créées. C'est une **fermeture** (closure), et c'est ainsi qu'on obtient un état privé sans classe : le compteur ci-dessous garde `count` en vie entre les appels, mais rien d'extérieur ne peut y toucher.

Une fonction sans `return` renvoie `undefined`.

# Lesson: Tableaux et objets
summary: Listes ordonnées, sacs clé/valeur, déstructuration et opérateur de décomposition.

Un **tableau** est une liste ordonnée, indexée à partir de 0. `push` ajoute à la fin, `length` donne le nombre d'éléments et `at(-1)` lit depuis la fin.

Un **objet** associe des clés de type chaîne à des valeurs. On lit avec la notation pointée (`user.name`) ou avec des crochets (`user["name"]`), indispensables quand la clé est dans une variable.

La **déstructuration** extrait des valeurs dans des variables d'un seul coup, et la syntaxe de **décomposition** `...` copie des propriétés dans un nouvel objet ou des éléments dans un nouveau tableau.

> `const` vous empêche de réaffecter la variable, pas de modifier l'objet vers lequel elle pointe. `const scores = []; scores.push(1);` est parfaitement valide.

# Lesson: Méthodes de tableau
summary: map, filter, reduce, find et le piège de sort().

Ces méthodes prennent une fonction et font la boucle pour vous. Elles se lisent comme une description de ce que vous voulez, plutôt que de la façon d'y arriver.

- `map(fn)` renvoie un nouveau tableau où `fn` a été appliquée à chaque élément
- `filter(fn)` garde les éléments pour lesquels `fn` renvoie une valeur vraie
- `reduce(fn, start)` réduit le tableau à une seule valeur
- `find(fn)` renvoie le premier élément qui correspond, ou `undefined`

Aucune ne modifie le tableau d'origine. `sort` est différente : elle trie **sur place** et, par défaut, compare les éléments comme des chaînes. C'est ainsi que `[10, 9, 1]` devient `[1, 10, 9]`. Passez un comparateur pour trier correctement des nombres.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Quand l'un des côtés de `+` est une chaîne, JavaScript convertit l'autre côté en chaîne et concatène. Les autres opérateurs arithmétiques convertissent en nombres, donc `"5" - 3` vaut `2`.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Les objets et les tableaux sont comparés par référence, pas par contenu. Ce sont deux tableaux distincts qui contiennent les mêmes valeurs. Pour comparer les contenus, parcourez-les ou comparez la sortie de `JSON.stringify` pour des données simples.

## Q: `nums` est une `const`. Que se passe-t-il ici ?
- =
- =
- =
- =
explain: `const` empêche de réaffecter le nom `nums`. Il ne gèle pas le tableau, donc `push` fonctionne. La ligne qui lèverait une erreur serait `nums = []`.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `var` a une portée de fonction, donc les trois callbacks partagent un seul `i`. Quand les minuteurs se déclenchent, la boucle est finie et `i` vaut 3. Remplacez `var` par `let` et chaque tour aura son propre `i`, ce qui affichera 0, 1, 2.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: NaN (« Not a Number », pas un nombre) est une valeur spéciale du type number, produite par des choses comme `0 / 0` ou `Number("abc")`. Testez-la avec `Number.isNaN(value)`, car `NaN === NaN` vaut `false`.

## Q: Laquelle renvoie le double de son argument ?
- =
- =
- =
- =
explain: Une fonction fléchée à corps d'expression renvoie cette expression. Avec des accolades, le corps devient un bloc et exige un `return` explicite, donc la deuxième option renvoie `undefined`. Les deux dernières sont des erreurs de syntaxe.

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: `0.1 * 3` vaut `0.30000000000000004` en virgule flottante binaire. Comparez les flottants avec une tolérance : `Math.abs(a - b) < Number.EPSILON`.

# Challenge: Une somme sans NaN

`sumArray(arr)` devrait additionner tous les nombres d'un tableau. Pour l'instant, elle renvoie `NaN` à chaque fois. Trouvez pourquoi et corrigez-la.

## Hints
- Que vaut `arr[arr.length]` ? Essayez de l'afficher.
- Lire au-delà de la fin d'un tableau donne `undefined`, et `number + undefined` vaut `NaN`.
- La boucle devrait s'arrêter à `i < arr.length`. (Ou passez-vous complètement de l'indice : `arr.reduce((sum, n) => sum + n, 0)`.)

# Challenge: Une majuscule à chaque mot

Écrivez `capitalizeWords(str)` pour qu'elle mette en majuscule la première lettre de chaque mot séparé par des espaces, sans toucher au reste du mot.

## Hints
- `str.split(" ")` vous donne un tableau de mots, et `.join(" ")` les recolle.
- Pour un seul mot : `word.charAt(0).toUpperCase()` plus `word.slice(1)`.
- Assemblez le tout avec `map` entre le split et le join.

# Challenge: Comptez les mots

`countWords(words)` reçoit un tableau de chaînes. Renvoyez un objet qui associe chaque mot au nombre de fois où il apparaît.

## Hints
- Commencez avec un objet vide, `{}`, et parcourez les mots.
- La première fois que vous voyez un mot, `counts[word]` vaut `undefined`. `counts[word] ?? 0` le transforme en 0.
- Avec `reduce` : `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: Le await manquant

`delay(ms, value)` renvoie une Promise résolue avec `value` au bout de `ms` millisecondes. `main` devrait afficher `first and second`, mais affiche quelque chose de bien moins utile. Corrigez `main`.

## Hints
- `delay(...)` renvoie immédiatement une Promise. Une Promise transformée en chaîne donne `[object Promise]`.
- Dans une fonction `async`, `await` attend qu'une Promise se termine et vous donne sa valeur.
- `const a = await delay(50, "first");` fonctionne. `await Promise.all([...])` lance les deux délais en même temps, ce qui est plus rapide.
