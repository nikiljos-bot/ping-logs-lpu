date=$1

# ./filter-break.sh "data/google-${date}.txt"
# ./filter-break.sh "data/ums-${date}.txt"

./dup-filter.sh "data/ums-${date}.txt" "data/umsf-${date}.txt"

node scripts/analyze.js google $date
node scripts/analyze.js umsf $date
node scripts/analyze.js nj $date

./autocommit.sh