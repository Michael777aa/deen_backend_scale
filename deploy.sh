git reset --hard
git checkout master
git pull origin master

npm install
npm run build
npm run start:prod