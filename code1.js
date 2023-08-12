function q4AutoReminder() {
  // get the spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // set the first sheet as active
  SpreadsheetApp.setActiveSheet(spreadsheet.getSheets()[0]);
  // fetch this sheet
  var sheet = spreadsheet.getActiveSheet();
   
  // figure out what the last row is
  var lastRow = sheet.getLastRow();
 
  // the rows are indexed starting at 1, and the first row
  // is the headers, so start with row 2
  var startRow = 4;  // should verify which row starts to hold valid data
 
  // grab column 1 (the 'date' column) 
  var range = sheet.getRange(startRow, 1, lastRow-startRow+1, 1);
  var numRows = range.getNumRows();
  var date_values = range.getValues();
   
  // grab email address columns (columns 3 ~ 19)
  range = sheet.getRange(startRow, 3, lastRow-startRow+1, 17);
  var email_values = range.getValues();
  
  // grab contact name columns (columns 2 ~ 18)
  range = sheet.getRange(startRow, 2, lastRow-startRow+1, 17);
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
      msg=msg+"Dear Brothers and Sisters,\n\nThis is a friendly reminder that you will be serving in\nthe Cantonese Worship Service for this coming Sunday.\n\nPlease note that MC will lead all the people who\nserve in the Fellowship Hall for prayer at 10:20 AM\nto prepare our hearts to serve.\n\nWorship Chairman - "+duty_contacts[i][0]+"\nSong Leader - "+duty_contacts[i][2]+"\nPianist - "+duty_contacts[i][4]+"\nOn-Stage Translator - "+duty_contacts[i][6]+"\nPowerPoint Preparer - "+duty_contacts[i][8]+"\nZoom Camera - "+duty_contacts[i][10]+"\nSound Control - "+duty_contacts[i][12]+"\nPowerPoint Control - "+duty_contacts[i][14]+"\nZoom Admin - "+duty_contacts[i][16]+"\n\nWorship Chairman:\n    Please Reply All to this email with the\n    invocation passage as soon as it is selected.\n\n\nLook forward to serving together for our Lord!\n\n-CEC Cantonese Worship Ministry\n";
      emailAdd=emailAdd+email_values[i][0].toString()+","+email_values[i][2].toString()+","+email_values[i][4].toString()+","+email_values[i][6].toString()+","+email_values[i][8].toString()+","+email_values[i][10].toString()+","+email_values[i][12].toString()+","+email_values[i][14].toString()+","+email_values[i][16].toString()+",andylucychu@gmail.com,ka.guen.kong@gmail.com,shui.bill.chu@gmail.com";
      warning_count++;
    }
  }
   
  if(warning_count) {
    MailApp.sendEmail(emailAdd, "Cantonese Sunday Service Reminder", msg);
  }
   
};