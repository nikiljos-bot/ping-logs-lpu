ping_url=$1
log_file=$2
info=$3

if [ -z $info ]
then
    info="↓"
fi

echo "\n============================\nPING STARTED ${ping_url}\n${info}\n$(date)\n============================\n" >> $log_file
ping $ping_url  | ts '%Y-%m-%d %H:%M:%S |' | tee -a $log_file
echo "\n============================\nPING STOPPED ${ping_url}\n${info}\n$(date)\n============================\n" >> $log_file


