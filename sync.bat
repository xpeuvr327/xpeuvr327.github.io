git add .
echo 'Message du commit:'
read commitMessage
git commit -m "$commitMessage"
echo 'Nom de la branche (main):'
read branch
git push origin $branch
read