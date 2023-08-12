/* version 12 (10/7/2022)
   1. This version will be adding 2 columns "place of service" and "service start time" to make the script more automated
   2. especially for join service
   3. we can improve the starting task column, which is currently at 5, for the next version
   4. fixed the google sheet service start time just the service date time + 11/24 hours
   5. Add mandarin a/v helper and ** for prayer start time
   6. email_collection routine was removed from this script and will be based on
      the 2nd sheet(av_contact)
   7. eliminate task name display and msg without anybody assigned to it
   8. associated a name to the MC
   9. sending txt to all on Sat morning
   10. passing in the test argument to do the testing
   11. passing in 2 parameters(email and text), able to test each one individually
   12. taking care of the cryroom translator and cryroom translator setup column
*/

function reminder_v12(email,text) {
  
  //the normal reminder script should be running without any input parameters
  email_test = 1;
  text_test = 1;
  if ( !email ) email_test = 0;
  if ( !text ) text_test = 0;
  console.log("email_test = " + email_test + " text_test = " + text_test);

  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota_before: " + emailQuotaRemaining);
  // get the spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // set the first sheet as active
  SpreadsheetApp.setActiveSheet(spreadsheet.getSheets()[0]);
  // fetch this sheet
  var sheet = spreadsheet.getActiveSheet();
   
  // figure out what the last row is
  var lastRow = sheet.getLastRow();
  //var lastRow = 16; // should verify which row is the last row to hold valid date
  
  // the rows are indexed starting at 1, and the first row
  // starting Task Coumn at 1
  var startRow = 1; 
  var start_TaskColumn = 1; 
  
  // email_reminder_days is the number of days before the worship date(sunday) when the email reminder will get send out
  // 5 days before will be Tuesday
  var email_reminder_days = 5;
  
  // text_reminder_days is the number of days before the worship date(sunday) when the text reminder will get send out
  // 1 days before will be Saturday
  var text_reminder_days = 1;
  
  actual_startRow_found = 0; //actual start row to hold valid data
  actual_lastRow_found = 0; //actual last row to hold valid data
  actual_lastColumn_found = 0; //actual last column to hold valid data
  
  actual_startRow = startRow;
  actual_lastRow = lastRow;
  
  // searching the actual start row and actual last row that hold the valid data
  // this is based on the checking if the column 1 of the current row is "date" or not
  // if it is "date", then the next row is the actual start row that we are looking for
  numRows = lastRow - startRow + 1;
  for (var j = 1; (j <= numRows); j++) {
    //checking only column 1 value of each row
    var temp_range = sheet.getRange(j, 1, 1, 1);
    var temp_c1_value = temp_range.getValues();
    //console.log("temp_c1_value = " + temp_c1_value);
    //console.log("temp_c1_value_lowercase = " + temp_c1_value.toString().toLowerCase());
    //console.log(!isNaN(Date.parse(temp_c1_value)));
    if ((temp_c1_value.toString().toLowerCase() === "date") && (actual_startRow_found == 0)) {
      actual_startRow = j + 1;
      actual_startRow_found = 1;
      //checking how many columns are actually there, starting the 1st column
      for (var k = 1; (k <= 50 && (actual_lastColumn_found == 0)); k++) {
        var temp_range_column = sheet.getRange(j, k, 1, 1);
        var temp_column_value = temp_range_column.getValues();
        //console.log("temp_column_value = " + temp_column_value);
        if (temp_column_value.toString() === "") {
          actual_lastColumn_found = 1;
          last_TaskColumn = k - 1;
          //console.log("last_TaskColumn = " + last_TaskColumn);
          }
      }
    }
    else if ((isNaN(Date.parse(temp_c1_value))) && (actual_lastRow_found == 0) && (actual_startRow_found == 1) ) {
      actual_lastRow = j - 1;
      actual_lastRow_found = 1;
    }
  }

  console.log("actual_startRow = " + actual_startRow);
  console.log("actual_lastRow = " + actual_lastRow);
  
  // grab column 1 (the 'date' column) 
  var range = sheet.getRange(actual_startRow, start_TaskColumn, actual_lastRow - actual_startRow + 1, 1);
  var actual_numRows = range.getNumRows();
  var date_values = range.getValues();
  start_TaskColumn ++;
  console.log("date_values = " + date_values);

  // grab column 2 (the 'Type of Service' column)
  var range = sheet.getRange(actual_startRow, start_TaskColumn, actual_lastRow - actual_startRow + 1, 1);
  var type_of_service = range.getValues();
  start_TaskColumn ++;
  //console.log(type_of_service);

  // grab column 3 (the 'Place of Service' column)
  var range = sheet.getRange(actual_startRow, start_TaskColumn, actual_lastRow - actual_startRow + 1, 1);
  var place_of_service = range.getValues();
  start_TaskColumn ++;
  //console.log(place_of_service);

  // grab column 4 (the 'Service Start Time' column)
  var range = sheet.getRange(actual_startRow, start_TaskColumn, actual_lastRow - actual_startRow + 1, 1);
  var service_start_time = range.getValues();
  start_TaskColumn ++;
  console.log(service_start_time);

  // computing the actual # of TaskColumns
  actual_TaskColumns = last_TaskColumn - start_TaskColumn + 1;
  console.log("start_TaskColumn = " + start_TaskColumn + "; last_TaskColumn = " + last_TaskColumn + "; actual_TaskColumns = " + actual_TaskColumns);

  // grab all the task name on (actual row - 1), column 5(start_TaskColumn), for actual_TaskColumns columns to the right
  // task name has only 1 row of actual_TaskColumn column of data
  var range = sheet.getRange(actual_startRow - 1, start_TaskColumn, 1, actual_TaskColumns);
  var task_name = range.getValues();
  console.log("task_name = " + task_name);

  // grab contact name columns columns 5 (actual_TaskColumn),
  //staring column #5 (actual_TaskColumn) and for actual_TaskColumns columns after
  range = sheet.getRange(actual_startRow, start_TaskColumn, actual_lastRow - actual_startRow + 1, actual_TaskColumns); 
  var duty_contacts = range.getValues();
  //console.log(duty_contacts);
  
  var sheet = SpreadsheetApp.getActive().getSheetByName("av_contact")
  //var sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  // Assumes row 1 contains our column headings
  //const heads = data.shift();
  const email_collection = new Map();
  const phone_collection = new Map();
  // Loops through all the rows of data
    for (var i = 1, len = data.length; i < len; i++) {
      var name = data[i][0];
      var email_address = data[i][1];
      var phone = data[i][2];
      //console.log("name = " + name + "; email_address = " + email_address + "; phone = " + phone);
      email_collection.set(name, email_address);
      phone_collection.set(name, phone);
      }

    //email_collection.forEach((value, key) => {
      //console.log("email_collection hash index= " +`${key}: ${value}`) } );

    //phone_collection.forEach((value, key) => {
      //console.log("phone_collection hash index= " +`${key}: ${value}`) } );
  
  
  var msg = "";
  var msg1 = "";
  var msg2 = "";
  var msg3 = "";
  var emailAdd = "";
  var find_it = 0;

  // Loop over the date values
  var toDay = new Date();
  var tYyyy = Utilities.formatDate(new Date(toDay), "GMT-7", "yyyy");
  var tMm = Utilities.formatDate(new Date(toDay), "GMT-7", "MM");
  var tDd = Utilities.formatDate(new Date(toDay), "GMT-7", "dd");
  
  for (var i = 0; ((i <= actual_numRows - 1) && (find_it == 0)); i++) {
    var date = date_values[i][0];
    Logger.log("Original Worship Date="+date_values[i][0]);
    var wYyyy = Utilities.formatDate(new Date(date), "GMT-7", "yyyy");
    var wMm = Utilities.formatDate(new Date(date), "GMT-7", "MM");
    var wDd = Utilities.formatDate(new Date(date), "GMT-7", "dd");

    // Getting the worship start time, dont know why it is "GMT-8" in order to get to 11:00am
    // service start time is just based on worship date + 11/24 hours in google sheet, so no need for "GMT-8" adjustment
    var w_start_time = service_start_time[i][0];
    //var w_start_hour = w_start_time.getHours();
    //var w_start_min = w_start_time.getMinutes();
    var wHh = Utilities.formatDate(new Date(w_start_time), "GMT-7", "HH");
    var wmm = Utilities.formatDate(new Date(w_start_time), "GMT-7", "mm");
    let w_ampm = wHh >= 12 ? 'PM' : 'AM';

    // Getting the prayer start time, 30 min before worship time and each min is 60000 milli sec
    var p_start_time = new Date(w_start_time - 30 * 60000);
    var pHh = Utilities.formatDate(new Date(p_start_time), "GMT-7", "HH");
    var pmm = Utilities.formatDate(new Date(p_start_time), "GMT-7", "mm");
    let p_ampm = pHh >= 12 ? 'PM' : 'AM';
    
    // email reminder date is 5 days before worship date
    var r_date = new Date(date_values[i][0]);
    r_date.setDate(r_date.getDate() - email_reminder_days );
    var rYyyy = Utilities.formatDate(new Date(r_date), "GMT-7", "yyyy");
    var rMm = Utilities.formatDate(new Date(r_date), "GMT-7", "MM");
    var rDd = Utilities.formatDate(new Date(r_date), "GMT-7", "dd");

    // text reminder date is 1 day before worship date
    var x_date = new Date(date_values[i][0]);
    x_date.setDate(x_date.getDate() - text_reminder_days );
    //Logger.log("r_date=" + r_date + "x_date=" + x_date);
    var xYyyy = Utilities.formatDate(new Date(x_date), "GMT-7", "yyyy");
    var xMm = Utilities.formatDate(new Date(x_date), "GMT-7", "MM");
    var xDd = Utilities.formatDate(new Date(x_date), "GMT-7", "dd");
    
      
    // for debug only in case email/text is not sent
    Logger.log("Today="+tYyyy + tMm + tDd +",Worship date= "+wYyyy +wMm + wDd + ",Worship time= "+wHh + wmm + w_ampm +",Prayer time= "+pHh + pmm + p_ampm +",Email Reminder date=" +rYyyy + rMm + rDd +",Text Reminder date=" +xYyyy + xMm + xDd); 
    
    // sending out email reminder
    if((tYyyy + tMm + tDd == rYyyy + rMm + rDd) || (email_test == 1)){
      // for debug only in case email is not sent
      find_it = 1;
      Logger.log("ENTRY FOUND, Sending out email reminder !!! Today="+tYyyy + tMm + tDd +",Worship date= "+wYyyy +wMm + wDd + ",Worship time= "+wHh + wmm + w_ampm +",Prayer time= "+pHh + pmm + p_ampm +",Email Reminder date=" +rYyyy + rMm + rDd); 

      emailAdd=email_collection.get("Andy Chu") + "," 
               +email_collection.get("Bill Chu") + ","
               +email_collection.get("Sarah Hui") + "," 
               +email_collection.get("Fuk Cheung") + "," ; 

      emailAdd_test = email_collection.get("Bill Chu") + "," ;

      //console.log(duty_contacts[i]);
            
      var msg_on_stage_translator = "";
      var msg_worship_chairperson = "";
      var msg_mandarin_av_helper ="";
      var msg_alert ="";

      // building up the task names and duty_contact names, which is in the middle of the message(msg3)
      //+"\n"+ task_name[0][0] + " - " + duty_contacts[i][0];
      for (var k = 0; (k <= actual_TaskColumns - 1); k++) {
        if (duty_contacts[i][k] == "") {
          continue;
        }
        //else if (task_name[0][k] == "Speaker") {
        //  continue;
        //}
        else if (task_name[0][k] == "Worship Chairperson") { 
          msg_worship_chairperson = "\n\nWorship Chairperson:\n  Dear "+duty_contacts[i][k]+", You are assigned to be the Worship Chairperson\n  for this week, Please Reply All to this email with the\n  invocation passage as soon as it is selected."
          worship_chairperson = duty_contacts[i][k];
        }   
        else if (task_name[0][k] == "On-Stage Translator") { 
          msg_on_stage_translator = "\n\nOn-Stage Translator:\n  Dear "+duty_contacts[i][k]+", You are assigned to be the On-Stage Translator\n  for this week, please bring your own personal 1/8 inch (wired) in-ear \n  headset if you have one, If not, please Reply All to this email thread,\n  and a share one might be available from CEC."
        }
        else if (task_name[0][k] == "Mandarin A/V helper") { 
          msg_mandarin_av_helper = "\n\nMandarin A/V helper:\n  Dear "+duty_contacts[i][k]+", You are assigned to be the Mandarin A/V helper\n  for this week, please arrive at Fellowship Hall by 8:45AM\n"
        }
        
        // building up the sending email list   
        msg3 = msg3 +"\n"+task_name[0][k] + " - " + duty_contacts[i][k];
        console.log(duty_contacts[i][k] 
                    + " of email address " 
                    + email_collection.get(duty_contacts[i][k]) 
                    + " with search status = " 
                    + emailAdd.search(email_collection.get(duty_contacts[i][k])));
        
        //excluded duplicate email entry and undefined entry(need to investigate this list) here
        //search result = -1 ---> new entry ---> only this email entry to be save in emailAdd list
        //search result = 0, xxxx  ---> xxxx is a position pointer to the emailAdd list that has already that email address, 0 is pointing at the beginning of the emailAdd list, if the search status is not 0, dont save
        
        if (task_name[0][k] == "Speaker") {
        console.log("No need to send reminder email to speaker " + duty_contacts[i][k] +" !!!");
        }
        else if (email_collection.get(duty_contacts[i][k]) === undefined) {
          msg_alert = msg_alert + "\nALERT!!! \""+duty_contacts[i][k] +"\" is NOT in the av_contact list, hence NO reminder email/text was send to him/her, Please 1)Check spelling(case sensitive) or 2)Update av_contact list accordingly(av_contact list is on the 2nd sheet of the current Worship Schedule) !!!\n";
          console.log("BAD NEWS!!! Can't find " + duty_contacts[i][k] +" in the av_contact list !!!");
        }
        else if (email_collection.get(duty_contacts[i][k]) == "") {
          msg_alert = msg_alert + "\nALERT!!! No email address was found for \"" + duty_contacts[i][k] +"\" in the av_contact list, hence NO reminder email was send to him/her, Please update av_contact list accordingly(av_contact list is on the 2nd sheet of the current Worship Schedule) !!!\n";
          console.log("BAD NEWS!!! No email address was found for " + duty_contacts[i][k] +" in the av_contact list !!!");
          }
        else if (emailAdd.search(email_collection.get(duty_contacts[i][k])) ==  -1 ) {
          emailAdd= emailAdd + email_collection.get(duty_contacts[i][k])  + ",";
        }
      }

      var join_msg1 = "Dear Brothers and Sisters,\n\nThis is a friendly reminder that you will be serving in\nthe "+type_of_service[i][0] +" Worship Service for this coming Sunday("+wMm+"/"+wDd+"/"+wYyyy+") in the "+place_of_service[i][0] +" with the service start time at "+wHh+":"+wmm+ w_ampm+".\n\nPlease note that MC, who is "+worship_chairperson +" for this week, will lead all the people who serve in the "+place_of_service[i][0] +" for prayer at **"+pHh+":"+pmm+ p_ampm+"**\nto prepare our hearts to serve.\n\n";
      //var join_msg2 = "\n\n\nLook forward to serving together for our Lord!\n\n-CEC Cantonese Worship Ministry\n\n\n";
      var join_msg2 = "\n\nWorship Chairperson:\n    Please Reply All to this email with the\n    invocation passage as soon as it is selected.\n\n\nLook forward to serving together for our Lord!\n\n-CEC Cantonese Worship Ministry\n";
  
      var cant_msg1 = "Dear Brothers and Sisters,\n\nThis is a friendly reminder that you will be serving in\nthe "+type_of_service[i][0] +" Worship Service for this coming Sunday("+wMm+"/"+wDd+"/"+wYyyy+") in the "+place_of_service[i][0] +" with the service start time at "+wHh+":"+wmm+ w_ampm+".\n\nPlease note that MC, who is "+worship_chairperson +" for this week, will lead all the people who serve in the "+place_of_service[i][0] +" for prayer at **"+pHh+":"+pmm+ p_ampm+"**\nto prepare our hearts to serve.\n\n";
      var cant_msg2 = "\n\nLook forward to serving together for our Lord!\n\n-CEC Cantonese Worship Ministry\n";
        
      if(type_of_service[i][0].toString().toLowerCase().match("join") === null) {
        msg1 = cant_msg1;
        msg2 = cant_msg2;
      }
      else {
        msg1 = join_msg1;
        msg2 = join_msg2;  
      }
      
      msg=msg1
          +msg3
          +msg_worship_chairperson
          +msg_on_stage_translator
          +msg_mandarin_av_helper
          +msg2
          +msg_alert+"\n\n";
         
                         
            
      // debug the email list
      //var attach_file = DriveApp.getFilesByName('Cantonese AV Checklist');
      Logger.log("Email List="+emailAdd );
      //MailApp.sendEmail(emailAdd_test, type_of_service[i][0] +" Sunday Service("+wMm+"/"+wDd+"/"+wYyyy+") Reminder!!!", msg, {attachments:      attach_file.next()} );
      
      if (email_test == 1) {
      MailApp.sendEmail(emailAdd_test, type_of_service[i][0] +" Sunday Service("+wMm+"/"+wDd+"/"+wYyyy+") Reminder!!!", msg);
      console.log("Sending only test email to Bill Chu!!!");
      }
      else {
        MailApp.sendEmail(emailAdd, type_of_service[i][0] +" Sunday Service("+wMm+"/"+wDd+"/"+wYyyy+") Reminder!!!", msg)
        console.log("Sending email to everybody!!!");
      }
      //MailApp.sendEmail(emailAdd_test, "Cantonese Sunday Service Reminder!!!", msg, {attachments: attach_file});
    }
    
    // sending out text reminder
    else if ((tYyyy + tMm + tDd == xYyyy + xMm + xDd) || (text_test == 1)) {
      // for debug only in case text is not sent
      find_it = 1;
      Logger.log("ENTRY FOUND, Sending out the text reminder !!! Today="+tYyyy + tMm + tDd +",Worship date= "+wYyyy +wMm + wDd + ",Worship time= "+wHh + wmm + w_ampm +",Prayer time= "+pHh + pmm + p_ampm +",Text Reminder date=" +xYyyy + xMm + xDd); 

      // building up the task names and duty_contact names, which is in the middle of the message(msg3)
      //+"\n"+ task_name[0][0] + " - " + duty_contacts[i][0];
      for (var k = 0; (k <= actual_TaskColumns - 1); k++) {
        if (duty_contacts[i][k] == "") {
          continue;
        }
        else if (task_name[0][k] == "Speaker") {
          console.log("No need to send reminder text to speaker " + duty_contacts[i][k] +" !!!");
          continue;
        }
        //else if (task_name[0][k] == "Power Point Preparation") {
        //  console.log("No text reminder needed for Power Point Preparation task assigned to " + duty_contacts[i][k]);
        //  continue;
        //}
        else if (phone_collection.get(duty_contacts[i][k]) === undefined) {
          console.log("No Name was found for " + duty_contacts[i][k] +" in the av_contact !!!");
          continue;
        }
        else if (phone_collection.get(duty_contacts[i][k]) == "") {
          console.log("No phone number was found for " + duty_contacts[i][k] +" in the av_contact !!!");
          continue;
        }
        
        //console.log(duty_contacts[i][k] 
        //            + "'s phone number is " 
        //            + phone_collection.get(duty_contacts[i][k]));
                    
        var phone_number = phone_collection.get(duty_contacts[i][k]);
        phone_number_no_dash = phone_number.replace(/-/g, "");
        
        // using bill chu's t-mobile account
        var TextTo = phone_number_no_dash +"@tmomail.net";
        var TextTo_test = "8587167471@tmomail.net";
        //var subject = "Cantonese Worship Team Reminder for ("+wMm+"/"+wDd+"/"+wYyyy +")";
        var subject = "Cantonese Worship Team Reminder for this Sunday";
        var body = "Dear "+duty_contacts[i][k] +", This is a friendly text reminder that you will be serving in the Cantonese Worship Service as the ("+ task_name[0][k]+") for this coming Sunday ("+wMm+"/"+wDd+"/"+wYyyy +") at CEC";
        console.log("A reminder text was sent to "+duty_contacts[i][k] +" for " +task_name[0][k] + " at " +phone_number +" !!!");     
        if (text_test == 1) {
          MailApp.sendEmail(TextTo_test, subject, body);
          console.log("Re-directing it to Bill Chu for testing!!!");
        }
        else {
          MailApp.sendEmail(TextTo, subject, body);
          //console.log("Sending text to Everybody!!!");
        }
               
      }
    }

  }

  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota_after: " + emailQuotaRemaining);
      
};