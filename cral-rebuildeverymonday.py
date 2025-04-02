import os

def filter_dirnames(dirnames, ignore_list):
    return [d for d in dirnames if d not in ignore_list]

def create_index_path(dirpath):
    return os.path.join(dirpath, 'crawlindex.html')

def write_html_header(index_file, dirpath):
    index_file.write('<!DOCTYPE html>\n')
    index_file.write('<html lang="fr">\n')
    index_file.write('<head>\n')
    index_file.write('<meta charset="UTF-8">\n')
    index_file.write('<title>Liste du répertoire</title>\n')
    index_file.write('</head>\n')
    index_file.write('<body>\n')
    index_file.write(f'<h1>Liste des fichiers dans {os.path.basename(dirpath)}</h1>\n')
    index_file.write('<ul>\n')

def write_parent_directory_link(index_file, dirpath):
    parent_dir = os.path.dirname(dirpath)
    if parent_dir != dirpath:
        index_file.write(f'<li><a href="../crawlindex.html">..</a></li>\n')

def write_directories(index_file, dirnames):
    for dirname in dirnames:
        dir_link = os.path.join(dirname, 'crawlindex.html')
        index_file.write(f'<li><a href="{dir_link}">{dirname}/</a></li>\n')

def write_files(index_file, filenames, ignore_list, ignore_extensions):
    for filename in filenames:
        if filename not in ignore_list and filename != 'crawlindex.html':
            file_extension = os.path.splitext(filename)[1]
            if file_extension not in ignore_extensions:
                index_file.write(f'<li><a href="{filename}">{filename}</a></li>\n')

def write_html_footer(index_file):
    index_file.write('</ul>\n')
    index_file.write('</body>\n')
    index_file.write('</html>\n')

def create_dir_listing(root_dir, ignore_list, ignore_extensions):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = filter_dirnames(dirnames, ignore_list)

        print(f"Building index for directory: {dirpath}")

        index_path = create_index_path(dirpath)

        with open(index_path, 'w', encoding='utf-8') as index_file:
            write_html_header(index_file, dirpath)
            write_parent_directory_link(index_file, dirpath)
            write_directories(index_file, dirnames)
            write_files(index_file, filenames, ignore_list, ignore_extensions)
            write_html_footer(index_file)

if __name__ == "__main__":
    root_directory = os.getcwd()
    ignore_list = ['.git', '.DS_Store', '__pycache__', '.gitignore', '404.md', "sftp.json", '.vscode']
    ignore_extensions = ['.log', '.tmp', '.bak', '.bat', '.py', '.ps1', '.png']
    create_dir_listing(root_directory, ignore_list, ignore_extensions)
    print("Directory listing created successfully.")
