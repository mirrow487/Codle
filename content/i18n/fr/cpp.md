tagline: Proche du matériel et réputé pour sa puissance. Il vous fait entièrement confiance, ce qui est à la fois sa qualité et son avertissement.
runtime: C++17 · compilé sur un GCC distant

# Lesson: Variables et types
summary: Types fondamentaux, std::string, auto et l'affichage des bool.

C++ est typé statiquement et compilé en code machine. Chaque variable a un type décidé à la compilation, et beaucoup d'erreurs sont détectées avant l'exécution du programme.

Les types fondamentaux : `int` (nombres entiers), `double` (décimaux), `char` (un seul caractère, entre apostrophes) et `bool`. Le texte vit dans `std::string`, de l'en-tête `<string>`.

`auto` demande au compilateur de déduire le type à partir de la valeur initiale. `auto x = 9.5;` fait de `x` un `double`.

La sortie passe par `std::cout` et l'opérateur `<<`. `"\n"` termine une ligne.

Deux pièges pour les débutants :

- `int / int` est une **division entière** : `7 / 2` vaut `3`. Rendez l'un des côtés `double` pour obtenir `3.5`.
- Les valeurs `bool` s'affichent sous la forme `1` et `0`, sauf si vous envoyez d'abord `std::boolalpha` au flux.

> Une variable locale déclarée sans valeur contient ce qui traînait à cet endroit de la mémoire. La lire est un comportement indéfini. Initialisez toujours : `int count = 0;`, pas `int count;`.

# Lesson: Conditions
summary: if/else, switch sur des entiers et des caractères, et opérateur ternaire.

`if`, `else if` et `else` fonctionnent comme prévu. Les comparaisons sont `==`, `!=`, `<`, `<=`, `>`, `>=`, combinées avec `&&` (et), `||` (ou) et `!` (non).

Un piège classique du C++ : `if (x = 5)` compile. Il **affecte** 5 à `x`, puis teste le résultat, qui est toujours vrai. Les compilateurs le signalent : lisez vos avertissements.

`switch` fonctionne sur les entiers, les caractères et les enums, mais **pas** sur `std::string`. Chaque cas se poursuit dans le suivant sans `break`, ce qui est parfois utile et souvent un bug.

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

Le ternaire `condition ? a : b` choisit l'une de deux valeurs.

# Lesson: Boucles
summary: for, for sur un intervalle, while et do-while.

La boucle `for` classique a un initialiseur, une condition et un incrément. `++i` et `i++` se comportent de la même façon dans l'en-tête d'une boucle.

La **boucle for sur un intervalle** (range-based for) visite chaque élément d'un conteneur. Écrivez `const auto&` pour regarder chaque élément sans le copier, ou `auto&` quand vous voulez modifier les éléments sur place.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` vérifie avant chaque tour ; `do ... while` vérifie après, donc s'exécute au moins une fois.

# Lesson: Fonctions et références
summary: Passage par valeur, par référence, références const et surcharge.

Par défaut, C++ passe les arguments **par valeur** : la fonction reçoit sa propre copie, et les modifications restent dans la fonction.

Ajoutez `&` au type du paramètre pour passer **par référence**. La fonction travaille alors sur la vraie variable de l'appelant.

Pour les gros objets que vous voulez seulement lire, utilisez une **référence const** : `const std::string& name`. Elle évite la copie et promet de ne pas modifier l'argument. C'est la façon standard de recevoir chaînes et conteneurs.

Les arguments par défaut se placent à la fin de la liste de paramètres, et la **surcharge** permet à plusieurs fonctions de partager un nom tant que leurs types de paramètres diffèrent.

# Lesson: Vecteurs et maps
summary: std::vector pour les séquences, std::map pour les paires clé/valeur triées.

`std::vector<T>` est le conteneur par défaut : un tableau redimensionnable. `push_back` ajoute à la fin, `size()` compte, et `front()` / `back()` lisent les extrémités.

`v[i]` ne vérifie pas les bornes ; lire au-delà de la fin est un comportement indéfini. `v.at(i)` vérifie et lève `std::out_of_range` à la place.

`std::map<K, V>` stocke des paires clé/valeur **triées par clé**. Depuis C++17, vous pouvez décomposer chaque paire dans une boucle avec les liaisons structurées (structured bindings) : `for (const auto& [key, value] : m)`.

> `m["missing"]` n'échoue pas. Il **insère** la clé avec une valeur par défaut (0 pour un `int`). Utilisez `m.count(key)` ou `m.find(key)` quand vous voulez seulement vérifier.

# Lesson: Classes
summary: Données privées, constructeurs à liste d'initialisation et fonctions membres const.

Une `class` regroupe des données avec les fonctions qui les manipulent. Les membres sont **privés** par défaut, donc le code extérieur ne peut pas y toucher directement ; la section `public:` est l'interface. (`struct` est identique, sauf que ses membres sont publics par défaut.)

Le **constructeur** initialise l'objet. Sa **liste d'initialisation des membres**, après les deux-points, fixe les membres directement au lieu de les affecter ensuite :

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

Une fonction membre marquée `const` promet de ne pas modifier l'objet, et c'est la seule sorte de fonction qu'on peut appeler sur un objet `const`. Marquez vos accesseurs `const` par réflexe.

Le tiret bas final dans les noms de membres est une convention répandue, pas une règle. Il rend simplement les membres faciles à repérer.

# Quiz

## Q: Qu'affiche ce code ?
- =
- =
- =
- =
explain: Les deux opérandes sont des `int`, donc il s'agit d'une division entière, qui tronque vers zéro. `7 / 2.0` donnerait `3.5`.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Rien
explain: Les flux affichent `bool` sous la forme `1` ou `0` par défaut. Insérez d'abord `std::boolalpha` (`std::cout << std::boolalpha << ok;`) pour obtenir `true`.

## Q: Quelle signature lit un grand vecteur sans le copier et sans pouvoir le modifier ?
- =
- =
- =
- =
explain: Une référence const évite la copie et interdit la modification. Le passage par valeur copie tout le vecteur. Une référence simple autorise les modifications. `std::vector<int>* const` est un pointeur constant vers un vecteur non constant, donc la fonction pourrait encore modifier les éléments.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Il plante
explain: Le vecteur commence avec trois éléments, donc `size()` vaut 3. Après `push_back(4)`, il y en a quatre, et l'indice 3 (le quatrième élément) vaut 4.

## Q: Qu'est-ce qui ne va pas dans ce code ?
- Rien
- Le premier `int` fuit : plus rien ne pointe vers lui, il ne pourra donc jamais être libéré
- Il ne compile pas : `p` pointe déjà vers quelque chose
- Le second `new` écrase la première valeur, donc `*p` vaut toujours 5
explain: Chaque `new` a besoin d'un `delete` correspondant. Réaffecter `p` perd le seul pointeur vers la première allocation, donc cette mémoire reste réservée jusqu'à la fin du programme. Le C++ moderne évite cela avec `std::make_unique` ou de simples valeurs.

## Q: Qu'affiche ce code ?
- =
- =
- =
- Il ne compile pas
explain: `s[0]` est le `char` `'a'`, et un `char` n'est qu'un petit entier : 97 en ASCII. `s.length()` vaut 3, donc la somme est le nombre 100.

## Q: Qu'affiche ce code ? (compilé en C++17)
- =
- =
- =
- Il ne compile pas
explain: `operator[]` insère une valeur par défaut (0) quand la clé manque, donc la map a maintenant une entrée. Depuis C++17, les opérandes de `<<` sont évalués de gauche à droite, donc l'insertion a lieu avant l'appel à `size()`.

# Challenge: Que la modification reste

`doubleAll` devrait doubler chaque nombre du vecteur qu'elle reçoit. La boucle semble correcte, pourtant les nombres ne changent pas. Corrigez-la.

## Hints
- La boucle double bien les valeurs. Mais quel vecteur double-t-elle ?
- Sans `&` sur le paramètre, `doubleAll` reçoit une copie de `nums`.
- Prenez le vecteur par référence : `std::vector<int>& values`.

# Challenge: Comptez un caractère

Implémentez `countChar(s, c)` pour qu'elle renvoie le nombre de fois où le caractère `c` apparaît dans la chaîne `s`.

## Hints
- Une boucle for sur un intervalle fonctionne aussi avec les chaînes : `for (char ch : s)`.
- Comparez chaque caractère à `c` et incrémentez un compteur quand ils correspondent.
- La bibliothèque standard a une solution en une ligne : `std::count(s.begin(), s.end(), c)` de `<algorithm>`.

# Challenge: Ne gardez que les pairs

Faites en sorte que `evens(values)` renvoie un **nouveau** vecteur ne contenant que les nombres pairs, dans leur ordre d'origine.

## Hints
- Commencez avec un `std::vector<int> result;` vide et renvoyez-le à la fin.
- `v % 2 == 0` est vrai pour les nombres pairs, y compris 0 et les pairs négatifs.
- `result.push_back(v)` ajoute un nombre à la fin.

# Challenge: Le plus grand nombre

`largest` devrait renvoyer le plus grand nombre d'un vecteur non vide. Elle fonctionne pour certaines entrées et se trompe en silence pour d'autres. Corrigez-la.

## Hints
- Quel test échoue ? Qu'ont en commun tous ses nombres ?
- Si tous les nombres sont négatifs, aucun n'est plus grand que la valeur de départ 0.
- Partez d'un vrai élément : `int best = v[0];` (le vecteur n'est jamais vide ici). `std::max_element` de `<algorithm>` fonctionne aussi.
