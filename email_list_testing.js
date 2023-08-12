function email_list_testing() {
  //SpreadsheetApp.getActive().getSheetByName('<Your_Sheet_Name>')
  var sheet = SpreadsheetApp.getActive().getSheetByName("email_list")
      //var sheet = SpreadsheetApp.getActiveSheet();
      // Loops through all the rows of data
      const dataRange = sheet.getDataRange();
      const data = dataRange.getDisplayValues();
      // Assumes row 1 contains our column headings
      //const heads = data.shift();
      const email_collection = new Map();
      for (var i = 1, len = data.length; i < len; i++) {
        var name = data[i][0];
        var email_address = data[i][1];
        //console.log("name = " + name + "; email_address = " + email_address);
        email_collection.set(name, email_address);
      //  //console.log(email_collection);
      }
      console.log(email_collection.get("Bill Chu"))
      //console.log(email_collection.values);
      //email_collection.forEach(element => {
      // console.log(element);
      //});
     // email_collection.forEach(function callback(value, key) {
     // console.log(`${key}: ${value}`) } );
      email_collection.forEach((value, key) => {
      console.log(`${key}: ${value}`) } );
      //console.log(`${key}`) } );
}
