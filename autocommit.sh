# remove DUP! entries from ums ping
if [ "$#" -eq 2 ]
then
    grep -v '(DUP!)' $1 > $2
fi
git add data/. inference/.
git -c user.name="nikiljos-bot" -c user.email="josenikhil2020@gmail.com" commit -m "- routine commit"
git push bot main