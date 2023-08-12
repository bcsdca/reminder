function string_testing() {
  var string1 = "Tuesday"
  var string2 = "TUesday"

  if (string1 == string2) {
    Logger.log(string1 + " is the same as " + string2 )
  }
  else if (string1 != string2) {
    Logger.log(string1 + " is NOT the same as " + string2 )
  }
}
