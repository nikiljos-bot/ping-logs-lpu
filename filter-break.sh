filename=$1

if [[ $filename == data/* ]]; then
    # Remove "data/" from the beginning of the variable
    filename="${filename#data/}"
fi

grep -v 'ttl=' "./data/${filename}" > "./data/breaks/${filename}"