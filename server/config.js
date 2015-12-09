// Set baseURL depending on enviornment
var env = process.env.NODE_ENV;
if (env === 'production') {
  baseURL = "https://www.javascript.com/";
}else if(env === 'staging'){
  baseURL = "";
}else{
  baseURL = "http://localhost:3000/";
}
