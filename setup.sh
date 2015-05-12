# How do we only run this if the javascriptcom database doesn't exist?

if psql javascriptcom -c '\q' 2>&1
then
  # The database exists
  echo "javascriptcom database already loaded"
else
  createdb javascriptcom
  psql javascriptcom < db/schema.sql
fi

# download bower assets

echo "installing bower assets"
bower install
