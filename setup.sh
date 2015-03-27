# How do we only run this if the javascriptcom database doesn't exist?

if psql javascriptcom -c '\q' 2>&1
then
  # The database exists
  echo "javascriptcom database already loaded"
else
  createdb javascriptcom
  psql javascriptcom < db/schema.sql
fi

# download bower assets & setup cs_console

if $BOWER
then
  echo "installing bower assets"
  bower install

  echo "compiling cs_console"
  pushd bower_components/cs_console
    bundle
    bundle exec ./bin/cs_console build -t no_cm
  popd
fi
