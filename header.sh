

curl --silent --header "Accept-Encoding: $1" -I $2 | grep "Content-Encoding:"
