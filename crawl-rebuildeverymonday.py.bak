import os

def create_dir_listing(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
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
            index_file.write(f'<h1>Directory Listing de {os.path.basename(dirpath)}</h1>\n')
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
                if filename != 'crawlindex.html':  # Skip the index.html file itself
                    index_file.write(f'<li><a href="{filename}">{filename}</a></li>\n')

            index_file.write('</ul>\n')
            index_file.write('</body>\n')
            index_file.write('</html>\n')

if __name__ == "__main__":
    root_directory = os.getcwd()  # Use the current working directory as the root directory
    create_dir_listing(root_directory)
    print("Directory listing created successfully.")
