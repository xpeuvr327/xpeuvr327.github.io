Roblox RTF Editor v1.1

Ce programme vous permet de créer du texte riche au format HTML en utilisant les fonctionnalités de Roblox, mais plus simple. Vous pouvez saisir du texte dans la boîte d'entrée, choisir des styles (gras, italique, souligné, barré) avec des cases à cocher, changer la famille de police du texte avec un menu déroulant, changer la couleur du texte avec des curseurs RGB ou des boîtes de saisie, et copier le texte transformé dans le presse-papier avec un bouton. Vous pouvez aussi voir la couleur choisie dans un carré de prévisualisation.

Pour utiliser ce programme, vous devez créer un dossier nommé v7, et y placer les fichiers index.html, script.js et readme.txt. Ensuite, vous devez ouvrir le fichier index.html avec votre navigateur web préféré. Vous pouvez alors commencer à créer du texte riche.

Les changements par rapport à la version précédente sont les suivants:

-readonly imput box

----------------------------
pourquoi v7 sur la v8.v9?, car crée sur même base.
problème résolu since v9:
Le problème de la couleur qui ne fonctionne pas vient du fait que la fonction applyStyles() ne prend pas en compte la case color pour changer la couleur du texte. Il faut donc modifier la fonction applyStyles() dans le fichier script.js pour ajouter une condition qui vérifie si la case color est cochée, et appelle la fonction changeRGB() si c’est le cas. Voici le code modifié:
-----------------
issues: input box useless-fixed