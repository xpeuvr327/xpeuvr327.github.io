$commit_message = Read-Host "Enter commit message"

git add .

git commit -m "$commit_message"

git push origin main