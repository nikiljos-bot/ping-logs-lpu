date=$1

./filter-break.sh "data/google-${date}.txt"
./filter-break.sh "data/ums-${date}.txt"

node scripts/analyze.js google $date
node scripts/analyze.js umsf $date

./autocommit.sh "data/ums-${date}.txt" "data/umsf-${date}.txt"