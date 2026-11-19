tagline: HTML dit ce que sont les choses. CSS dit à quoi elles ressemblent. Ensemble, ils forment toutes les pages web que vous avez jamais vues.
runtime: HTML et CSS · aperçu en direct dans un cadre isolé

# Lesson: Structure d'un document
summary: Le squelette commun à toutes les pages web, et le rôle de chaque os.

HTML décrit **ce que sont les choses** : ceci est un titre, ceci est un paragraphe, ceci est une liste. Le navigateur choisit une apparence par défaut, puis CSS la modifie.

Le contenu se place dans des **éléments**, écrits avec une balise ouvrante, le contenu et une balise fermante : `<p>Hello</p>`. Certains éléments, comme `<img>` et `<meta>`, sont **vides** (void) et n'ont pas de balise fermante.

Toutes les pages ont la même structure :

- `<!DOCTYPE html>` indique au navigateur d'utiliser le mode standard moderne
- `<html lang="en">` englobe tout et déclare la langue (les lecteurs d'écran s'en servent)
- `<head>` contient les informations **sur** la page : titre, jeu de caractères, styles
- `<body>` contient ce que les gens voient réellement

Les titres vont de `<h1>` (le plus important) à `<h6>`. Utilisez-les pour la structure, pas pour la taille ; la taille se règle avec CSS.

> Modifiez le texte de l'aperçu ci-dessous, puis cliquez sur Exécuter. Rien de ce que vous tapez ici ne peut casser quoi que ce soit, alors soyez aussi téméraire que vous voulez.

# Lesson: Texte, liens et listes
summary: Des balises de texte porteuses de sens, les attributs et les deux types de listes.

Choisissez les balises pour leur sens. `<strong>` marque l'importance et `<em>` marque l'insistance. Les deux ont un style par défaut (gras, italique), mais c'est le sens que lisent les technologies d'assistance.

Les éléments peuvent porter des **attributs** dans la balise ouvrante, écrits `name="value"`. Un lien est un élément `<a>` dont l'attribut `href` indique où il mène :

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Les images ont besoin d'un `src` et d'un texte `alt` qui décrit l'image pour les personnes qui ne peuvent pas la voir.

Les listes existent en deux variantes : `<ul>` pour les listes non ordonnées (à puces) et `<ol>` pour les listes ordonnées (numérotées). Dans les deux cas, chaque élément est un `<li>`.

> Les liens de cet aperçu sont désactivés pour que vous ne quittiez pas la page par accident. La console vous dit où ils vous auraient menés.

# Lesson: Sélecteurs CSS et cascade
summary: Comment CSS choisit les éléments, et comment il tranche les désaccords entre règles.

Une règle CSS se compose d'un **sélecteur** et de **déclarations** :

```css
p {
  color: #333;
  line-height: 1.6;
}
```

Les sélecteurs que vous utiliserez le plus :

- `p` sélectionne chaque élément `<p>`
- `.note` sélectionne les éléments qui ont `class="note"` (un élément peut avoir plusieurs classes)
- `#intro` sélectionne l'unique élément qui a `id="intro"`
- `nav a` sélectionne les éléments `<a>` situés n'importe où dans un `<nav>`
- `ul > li` sélectionne les éléments `<li>` qui sont enfants directs d'un `<ul>`

Quand deux règles sont en désaccord, c'est la **spécificité** qui décide : un id l'emporte sur une classe, et une classe l'emporte sur un sélecteur d'élément. Ce n'est qu'à spécificité égale que la règle placée plus loin gagne. C'est la « cascade » de Cascading Style Sheets.

# Lesson: Le modèle de boîte
summary: Contenu, marge intérieure, bordure, marge extérieure, et le réglage qui rend les tailles raisonnables.

Chaque élément est une boîte rectangulaire composée de quatre couches, de l'intérieur vers l'extérieur :

- **content** (contenu) : le texte ou l'image lui-même
- **padding** (marge intérieure) : l'espace à l'intérieur de la bordure, qui prend la couleur de fond
- **border** (bordure) : le trait autour de la marge intérieure
- **margin** (marge extérieure) : l'espace transparent à l'extérieur, qui écarte les autres boîtes

Par défaut (`box-sizing: content-box`), `width` ne fixe que le contenu. La marge intérieure et la bordure s'ajoutent par-dessus : une boîte en `width: 200px` avec `20px` de marge intérieure et une bordure de `5px` mesure donc en réalité **250px** de large.

Presque toutes les feuilles de style modernes changent cela avec `box-sizing: border-box`, qui fait inclure la marge intérieure et la bordure dans `width`. Alors `200px` veut dire 200px.

# Lesson: Flexbox
summary: Aligner des éléments en ligne ou en colonne sans les vieilles astuces.

Mettez `display: flex` sur un conteneur, et ses enfants directs deviennent des **éléments flex** disposés en ligne.

Les deux propriétés que vous utiliserez sans cesse :

- `justify-content` place les éléments le long de l'axe principal (horizontal pour une ligne) : `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` les place sur l'axe secondaire (vertical pour une ligne) : `stretch` (par défaut), `flex-start`, `center`, `flex-end`

`gap` ajoute de l'espace entre les éléments sans calcul de marges. `flex-direction: column` transforme la ligne en colonne, ce qui échange le sens des deux axes. `flex: 1` sur un élément lui dit de grandir pour occuper l'espace restant.

> Centrer parfaitement une chose dans une autre était autrefois un mème. Aujourd'hui, c'est trois lignes : `display: flex; justify-content: center; align-items: center;`

# Lesson: CSS Grid
summary: Des mises en page en deux dimensions avec des lignes, des colonnes et l'unité fr.

Flexbox gère une direction à la fois. **Grid** gère les lignes et les colonnes ensemble.

`grid-template-columns` définit les colonnes. L'unité `fr` signifie « une fraction de l'espace libre » : `1fr 2fr` découpe donc la largeur en tiers, un pour la première colonne et deux pour la seconde. `repeat(3, 1fr)` est un raccourci pour trois colonnes égales.

Les éléments remplissent les cellules dans l'ordre et passent automatiquement à la ligne suivante. `gap` règle l'espace entre les cellules.

Le modèle ci-dessous vaut la peine d'être retenu. Il crée autant de colonnes qu'il en tient, chacune d'au moins 120px de large, sans media queries :

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Redimensionnez la zone d'aperçu ou changez `120px`, et regardez les colonnes se réorganiser.

# Quiz

## Q: Quel élément est le titre le plus important d'une page ?
- =
- =
- =
- =
explain: Les titres vont de `<h1>` à `<h6>`. `<head>` contient les métadonnées de la page, `<header>` est une section de contenu introductif (qui contient souvent un titre), et `<heading>` n'existe pas.

## Q: De quelle couleur est le texte du paragraphe ?
- Bleu
- Rouge
- Vert
- Noir, parce que les règles entrent en conflit
explain: Un sélecteur d'id est plus spécifique qu'une classe, elle-même plus spécifique qu'un sélecteur d'élément. L'ordre dans le code ne compte qu'à spécificité égale, donc le bleu gagne même s'il vient en premier.

## Q: Avec le `box-sizing` par défaut, quelle largeur cette boîte a-t-elle à l'écran ?
- 200px
- 225px
- 240px
- 250px
explain: En mode `content-box`, `width` ne concerne que le contenu. Ajoutez 20px de marge intérieure de chaque côté (40px) et 5px de bordure de chaque côté (10px) : 200 + 40 + 10 = 250px. Avec `box-sizing: border-box`, ce serait exactement 200px.

## Q: Quel CSS centre un enfant unique horizontalement et verticalement dans son parent ?
- =
- =
- =
- =
explain: Dans une ligne flex, `justify-content` contrôle l'axe horizontal et `align-items` l'axe vertical. `align` n'est pas une propriété CSS, `vertical-align` n'agit que sur le contenu en ligne et les cellules de tableau, et `margin` n'accepte pas `center` (même si `margin: 0 auto` centre un bloc horizontalement).

## Q: Que fait `target="_blank"` sur un lien ?
- Ouvre le lien dans le même onglet
- Ouvre le lien dans un nouvel onglet ou une nouvelle fenêtre
- Rend le lien invisible
- Télécharge le fichier lié
explain: `_blank` demande au navigateur un nouveau contexte de navigation, généralement un onglet. Les navigateurs modernes lui appliquent aussi par défaut le comportement de `rel="noopener"`, pour que la nouvelle page ne puisse pas contrôler la vôtre.

## Q: Le conteneur fait 300px de large, sans espacement. Quelle largeur ont les deux colonnes ?
- 150px et 150px
- 100px et 200px
- 1px et 2px
- 300px et 600px
explain: `fr` répartit l'espace libre proportionnellement. Il y a 3 fractions au total, donc chacune vaut 100px : une fraction pour la première colonne, deux pour la seconde.

## Q: Quel sélecteur ne cible que les éléments `<li>` enfants directs de `.menu` ?
- =
- =
- =
- =
explain: `>` est le combinateur d'enfant. Un espace (combinateur de descendant) cible à n'importe quelle profondeur, listes imbriquées comprises. `+` cible le frère suivant, et `.menu.li` cible un élément qui a à la fois les classes `menu` et `li`.

# Challenge: Faites-en un lien

Transformez le mot **MDN** en lien vers `https://developer.mozilla.org` qui s'ouvre dans un nouvel onglet. Laissez le reste de la phrase tel quel.

## Hints
- Un lien est un élément `<a>` qui entoure le texte que vous voulez rendre cliquable.
- La destination va dans l'attribut `href`.
- `target="_blank"` l'ouvre dans un nouvel onglet : `<a href="..." target="_blank">MDN</a>`.

## Tests
- Le paragraphe contient un lien
- Le texte du lien est exactement « MDN »
- Il pointe vers https://developer.mozilla.org
- Il s'ouvre dans un nouvel onglet
- La phrase dit toujours « Read the docs on MDN. »

# Challenge: Centrez la carte

La `.card` est collée dans le coin supérieur gauche de `.stage`. Ajoutez du CSS pour la centrer horizontalement et verticalement. Ne modifiez pas le HTML.

## Hints
- Flexbox sait centrer : commencez par ajouter `display: flex;` à `.stage`.
- `justify-content` gère l'axe horizontal dans une ligne.
- `align-items: center;` gère l'axe vertical. (Pour les fans de Grid, `display: grid; place-items: center;` fonctionne aussi.)

## Tests
- La carte est centrée horizontalement
- La carte est centrée verticalement
- La carte garde sa largeur de 160px
- La scène fait toujours 300px de haut

# Challenge: Stoppez le débordement

Le `.panel` devrait remplir exactement son conteneur de 300px, mais il dépasse du bord droit. Corrigez cela **sans** retirer la marge intérieure ni la bordure.

## Hints
- Quelle est la vraie largeur du panneau ? `width: 100%` fait 300px, puis la marge intérieure et la bordure s'ajoutent.
- 300 + 24 + 24 + 2 + 2 = 352px. Voilà le débordement.
- Une seule propriété change la façon dont `width` est mesurée : `box-sizing: border-box;`.

## Tests
- Le panneau tient dans le conteneur
- Le panneau est aussi large que le conteneur
- La marge intérieure fait toujours 24px
- La bordure fait toujours 2px

# Challenge: Construisez une galerie à trois colonnes

Transformez `.gallery` en grille à **trois colonnes égales** avec un **espacement de 16px**, pour que les six photos forment deux rangées de trois.

## Hints
- Commencez par `display: grid;` sur `.gallery`.
- `grid-template-columns: 1fr 1fr 1fr;` crée trois colonnes égales. `repeat(3, 1fr)` dit la même chose plus brièvement.
- `gap: 16px;` espace à la fois les lignes et les colonnes.

## Tests
- Les photos 1 à 3 partagent la première rangée
- La photo 4 commence une deuxième rangée
- Les colonnes ont la même largeur
- L'espacement horizontal est de 16px
- L'espacement vertical est de 16px
