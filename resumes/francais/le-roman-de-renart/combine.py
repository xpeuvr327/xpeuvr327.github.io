import os

# Directory containing the HTML files
directory = '.'

# List of HTML files to combine
html_files = [
    "chap-preface.html",
    "chap-intro.html",
    "la-naissance-des-heros.html",
    "lmdg-chantecler.html",
    "lmdg-mesange.html",
    "lmdg-tibert.html",
    "lmdg-tiecelin.html",
    "lmdg-hersent.html",
    "lmdg-andouille.html",
    "lmdg-peche.html",
    "lmdg-puits.html",
    "ljdr-plainte.html",
    "ljdr-arrivee.html",
    "ljdr-ambassades.html",
    "ljdr-cour.html",
    "ljdr-condamnation-et-salut-du-goupil.html",
    "ljdr-defi-final.html",
    "lsdm-presentation-du-chateau.html",
    "lsdm-les-assauts-inutiles.html",
    "lsdm-capture-de-renart.html",
    "lsdm-l-intervention-d-hermeline.html",
    "lcsry-intervention.html",
    "lcsry-combat.html",
    "lcsry-renart-sauve-une-fois-de-plus.html",
    "analyses-anthropomorphismes.html",
    "analyses-comique.html",
    "analyses-exemple-commentaire-compose.html",
    "analyses-l-amour-courtois.html",
    "analyses-la-chevalerie.html",
    "analyses-personnages.html",
    "analyses.html",
]


# Combine the content of all HTML files
combined_content = ''
for file_name in html_files:
    file_path = os.path.join(directory, file_name)
    with open(file_path, 'r', encoding='utf-8') as file:
        combined_content += file.read() + '\n'

# Write the combined content to a new HTML file
output_file_path = os.path.join(directory, 'combined.html')
with open(output_file_path, 'w', encoding='utf-8') as output_file:
    output_file.write(combined_content)

print(f'Combined HTML content saved to {output_file_path}')
