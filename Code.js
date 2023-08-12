function checkReminder() {
  // get the spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // set the first sheet as active
  SpreadsheetApp.setActiveSheet(spreadsheet.getSheets()[1]);
  // fetch this sheet
  var sheet = spreadsheet.getActiveSheet();
   
  // figure out what the last row is
  var lastRow = sheet.getLastRow();
 
  // the rows are indexed starting at 1, and the first row
  // is the headers, so start with row 2
  var startRow = 2;
 
  // grab column 1 (the 'date' column) 
  var range = sheet.getRange(2, 1, lastRow-startRow+1, 1);
  var numRows = range.getNumRows();
  var date_values = range.getValues();
   
  // Now, grab the email address column
  range = sheet.getRange(2, 3, lastRow-startRow+1, 1);
  var email_values = range.getValues();
  
  // grab the two on-duty contacts
  range = sheet.getRange(2, 2, lastRow-startRow+1, 1);
  var duty_contacts = range.getValues();
   
  var warning_count = 0;
  var msg = "";
  var emailAdd = "";
   
  // Loop over the date values
  var toDay = new Date();
  var tYyyy = Utilities.formatDate(new Date(toDay), "GMT-7", "yyyy");
  var tMm = Utilities.formatDate(new Date(toDay), "GMT-7", "MM");
  var tDd = Utilities.formatDate(new Date(toDay), "GMT-7", "dd");
  
  for (var i = 0; i <= numRows - 1; i++) {
    var date = date_values[i][0];
    var cYyyy = Utilities.formatDate(new Date(date), "GMT-7", "yyyy");
    var cMm = Utilities.formatDate(new Date(date), "GMT-7", "MM");
    var cDd = Utilities.formatDate(new Date(date), "GMT-7", "dd");
    
    // for debug only in case email is not sent
    //Logger.log(tYyyy + tMm + tDd + cYyyy + cMm + cDd);
    
    if(cYyyy + cMm + cDd == tYyyy + tMm + tDd) {
      msg = msg + "Dear " + duty_contacts[i][0] + ":\n\nYou are assigned to Welcoming duty in tomorrow's Cantonese Service.\nPlease arrive promptly half hour before start of service.\n\nIf you are unable to make it, please contact Andy Chu immediately.\n\nThank you for your service!\n\n-CEC Cantonese Ministry Team\n";
      emailAdd = emailAdd + email_values[i][0].toString() + ",shui.bill.chu@gmail.com,ka.guen.kong@gmail.com,andylucychu@gmail.com";
      warning_count++;
    }
  }
   
  if(warning_count) {
    MailApp.sendEmail(emailAdd, "Reminder: Welcome Team On Duty TODAY", msg);
  }
   
};