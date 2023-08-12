function myFunction(email,text) {
  email_test = 1;
  text_test = 1;
  if ( !email ) email_test = 0;
  if ( !text ) text_test = 0;
  console.log("email_test = " + email_test + " text_test = " + text_test);
  //return test;
}
function main() {
  console.log("running email_test !!!");
  myFunction("email");
  console.log("running text_test !!!");
  myFunction("","text");
  console.log("running both email and text test !!!");
  myFunction("email","text");
  console.log("running normal with no email and no text test !!!");
  myFunction();
}