# remove DUP! entries from ums ping
if [ "$#" -eq 2 ]
then
    grep -v '(DUP!)' $1 > $2
fi