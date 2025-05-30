import requests
from bs4 import BeautifulSoup
import json

def get_verb_conjugations(verb):
    url = f"https://de.pons.com/verbtabellen/deutsch/{verb}"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to retrieve the page for verb: {verb}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract the required conjugations
    conjugations = {
        "deutsch": verb,
        "prs": [],
        "prt": [],
        "prk": "",
        "frtrad": "",
        "features": {
            "auxSein": 0,
            "isIrreg": 0,
            "isReflect": 0,
            "isParticle": 0,
            "isInformal": 0
        }
    }

    # Mapping of data-pons-flection-id to the list index
    prs_mapping = {
        "INDIKATIV_PRAESENS_1S": 0,
        "INDIKATIV_PRAESENS_2S": 1,
        "INDIKATIV_PRAESENS_3S": 2,
        "INDIKATIV_PRAESENS_1P": 3,
        "INDIKATIV_PRAESENS_2P": 4,
        "INDIKATIV_PRAESENS_3P": 5
    }

    prt_mapping = {
        "INDIKATIV_PRAETERITUM_1S": 0,
        "INDIKATIV_PRAETERITUM_2S": 1,
        "INDIKATIV_PRAETERITUM_3S": 2,
        "INDIKATIV_PRAETERITUM_1P": 3,
        "INDIKATIV_PRAETERITUM_2P": 4,
        "INDIKATIV_PRAETERITUM_3P": 5
    }

    # Initialize the lists with None
    conjugations["prs"] = [None] * 6
    conjugations["prt"] = [None] * 6

    # Find all span elements with class 'flected_form'
    spans = soup.find_all('span', class_='flected_form')

    for span in spans:
        flection_id = span.get('data-pons-flection-id')
        text = span.get_text()

        if flection_id in prs_mapping:
            conjugations["prs"][prs_mapping[flection_id]] = text
        elif flection_id in prt_mapping:
            conjugations["prt"][prt_mapping[flection_id]] = text
        elif flection_id == "INDIKATIV_PERFEKT_3S":
            conjugations["prk"] = text

    # Extract text from all elements to check for 'sich'
    all_text = ' '.join([element.get_text() for element in soup.find_all(True)])

    conjugations["frtrad"] = input("Enter french translation: ")

    # Check for auxiliary verb 'sein'
    if "seid" in all_text:
        conjugations["features"]["auxSein"] = 1

    # Check for reflexive verb 'sich'
    if all(x in all_text for x in (['mich', 'dich'])): #uns is always present, sich too
        conjugations["features"]["hasReflect"] = 1

    # is inFormal
    if conjugations["prs"].count(None) == 5 and conjugations["prs"][2] is not None:
        conjugations["features"]["isInformal"] = 1

    return conjugations

def minify_json(json_list):
    minified_list = []
    for item in json_list:
        features = {k: v for k, v in item["features"].items() if v != 0}
        minified_item = {k: v for k, v in item.items() if k != "features"}
        minified_item["features"] = features
        minified_list.append(minified_item)
    return minified_list

def add_particle_to_conjugations(conjugations, particle):
    conjugations["deutsch"] = particle + conjugations["deutsch"]
    conjugations["prs"] = [f"{form} {particle}" for form in conjugations["prs"]]
    conjugations["prt"] = [f"{form} {particle}" for form in conjugations["prt"]]
    conjugations["prk"] = particle + conjugations["prk"]
    conjugations["features"]["hasParticle"] = 1
    return conjugations

def main():
    conjugations_list = []
    last_verb = None
    irregState = 0
    
    while True:
        verb = input("Enter a German verb ('exit', 'compile ', 'particle ', 'comment ', 'irreg'): ")
        if verb.lower() == 'exit':
            break
        elif verb.lower().startswith('compile '):
            filename = verb.lower().split(' ')[1] + ".json"
            print(filename)
            minified_json = minify_json(conjugations_list)
            with open(filename, 'w') as f:
                json.dump(minified_json, f, separators=(',', ':'))
            print("Compiled and saved to ", filename)
            continue
        elif verb.lower().startswith('particle '):
            particle = verb.lower().split(' ')[1]
            if last_verb is None:
                print("No verb to add a particle to. Please enter a verb first.")
                continue
            last_verb = add_particle_to_conjugations(last_verb, particle)
            print(f"Modified conjugations with particle '{particle}':")
            print(',',last_verb)
            continue
        elif verb.lower().startswith('comment '):
            comment = verb.lower().split(' ', 1)[1]
            if last_verb is None:
                print("No verb to add a comment to. Please enter a verb first.")
                continue
            last_verb["comment"] = comment
            print(f"Added comment '{comment}' to the verb:")
            print(last_verb)
            continue
        elif verb == "irreg":
            irregState = 1- irregState
            print("Irreg state is now", irregState)
            continue

        conjugations = get_verb_conjugations(verb)
        if conjugations:
            conjugations["features"]["isIrreg"] = irregState
            conjugations_list.append(conjugations)
            last_verb = conjugations
            print(',', conjugations)

if __name__ == "__main__":
    main()
