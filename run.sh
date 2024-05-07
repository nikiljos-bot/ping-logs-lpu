date=$1

./filter-break.sh "data/google-${date}.txt"
./filter-break.sh "data/ums-${date}.txt"
./autocommit.sh "data/ums-${date}.txt" "data/umsf-${date}.txt"