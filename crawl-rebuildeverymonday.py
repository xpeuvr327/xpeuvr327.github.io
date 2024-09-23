import os

def create_dir_listing(root_dir, ignore_list):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Remove ignored directories from dirnames
        dirnames[:] = [d for d in dirnames if d not in ignore_list]

        # Create the index.html file in the current directory
        index_path = os.path.join(dirpath, 'crawlindex.html')
        with open(index_path, 'w', encoding='utf-8') as index_file:
            index_file.write('<!DOCTYPE html>\n')
            index_file.write('<html lang="fr">\n')
            index_file.write('<head>\n')
            index_file.write('<meta charset="UTF-8">\n')
            index_file.write('<title>Liste du répertoire</title>\n')
            index_file.write('</head>\n')
            index_file.write('<body>\n')
            index_file.write(f'<h1>Liste des fichiers dans {os.path.basename(dirpath)}</h1>\n')
            index_file.write('<ul>\n')

            # Add link to the parent directory
            parent_dir = os.path.dirname(dirpath)
            if parent_dir != dirpath:
                index_file.write(f'<li><a href="../crawlindex.html">..</a></li>\n')

            # Add directories
            for dirname in dirnames:
                dir_link = os.path.join(dirname, 'crawlindex.html')
                index_file.write(f'<li><a href="{dir_link}">{dirname}/</a></li>\n')

            # Add files
            for filename in filenames:
                if filename not in ignore_list and filename != 'crawlindex.html':  # Skip ignored files and index.html
                    index_file.write(f'<li><a href="{filename}">{filename}</a></li>\n')

            index_file.write('</ul>\n')
            index_file.write('</body>\n')
            index_file.write('</html>\n')

if __name__ == "__main__":
    root_directory = os.getcwd()  # Use the current working directory as the root directory
    ignore_files = ['.git', '.DS_Store', '__pycache__']  # Add your ignored files/directories here
    create_dir_listing(root_directory, ignore_files)
    print("Directory listing created successfully.")
