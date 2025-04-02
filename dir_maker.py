import os
from html import escape

# List of files and directories to exclude
exclusions = [
    '.git',
    '.vscode',
    'node_modules',
    '__pycache__',
    'exclude_this_file.txt',
    '.well-known',
    'ads.txt',
    'crawl-rebuildeverymonday.py',
    'googleb35557c91395b806.html',
    'service-worker.js'
]

def generate_html_listing(directory, parent_dir=None):
    dir_name = os.path.basename(directory)
    html_content = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Liste du répertoire</title>
    </head>
    <body>
        <h1>Liste des fichiers dans {escape(dir_name)}</h1>
        <ul>
    """

    if parent_dir:
        html_content += f'<li><a href="../crawlindex.html">..</a></li>\n'

    # Separate directories and files
    directories = []
    files = []
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if item in exclusions:
            continue
        if os.path.isdir(item_path):
            directories.append(item)
        else:
            files.append(item)

    # Sort directories and files
    directories.sort()
    files.sort()

    # Add directories to the HTML content
    for dir_name in directories:
        dir_path = os.path.join(directory, dir_name)
        html_content += f'<li><a href="{escape(dir_name)}/crawlindex.html">{escape(dir_name)}/</a></li>\n'
        generate_html_listing(dir_path, directory)

    # Add files to the HTML content
    for file_name in files:
        html_content += f'<li><a href="{escape(file_name)}">{escape(file_name)}</a></li>\n'

    html_content += """
        </ul>
    </body>
    </html>
    """

    output_file = os.path.join(directory, 'crawlindex.html')
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(html_content)

if __name__ == "__main__":
    current_directory = os.getcwd()
    generate_html_listing(current_directory)
    print(f"Directory listing written to {current_directory}/crawlindex.html")
