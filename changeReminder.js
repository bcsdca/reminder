//only send email when the toList is not undefined or there is oldValue or inputValue (4/4/2023)
//adding more messages if no email address was found to send adding assignment email (4/5/2023)
//only modification on sheet0 was be monitored..
function changeReminder(e, test) {
  Logger.log(JSON.stringify(e));
  if (e.source.getSheetName() == SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].getName()) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var sheetName = sheet.getName();
    var lastRow = sheet.getLastRow()
    var lastColumn = sheet.getLastColumn();
    console.log("lastRow is %d, lastColumn is %d", lastRow, lastColumn)
    var dataRowStartFound = false;
    for (var i = 1; i <= lastRow; i++) {
      var tmpRange = sheet.getRange(i, 1);
      var tmpColumn1Value = tmpRange.getValue()
      //console.log("tmpColumn1Value is %d", tmpColumn1Value)
      if (tmpColumn1Value == "Date") {
        var headerRow = sheet.getRange(i, 1, 1, lastColumn).getValues();
        console.log(JSON.stringify(headerRow))
      }
      else if ((!dataRowStartFound) && (tmpColumn1Value instanceof Date)) {
        dataRowStart = i;
        dataRowStartFound = true;
        console.log("dataRowStart is %d", dataRowStart)
      }
      else if ((dataRowStartFound) && (!(tmpColumn1Value instanceof Date))) {
        //one row before
        dataRowEnd = i - 1;
        console.log("dataRowEnd is %d", dataRowEnd)
        break;
      }
    }

    var av_sheet = SpreadsheetApp.getActive().getSheetByName("av_contact")

    const dataRange = av_sheet.getDataRange();
    const data = dataRange.getDisplayValues();
    // Assumes row 1 contains our column headings
    //const heads = data.shift();
    const email_collection = new Map();
    // Loops through all the rows of data
    for (var i = 1, len = data.length; i < len; i++) {
      var name = data[i][0];
      var email_address = data[i][1];
      //console.log("name = " + name + "; email_address = " + email_address + "; phone = " + phone);
      email_collection.set(name, email_address);
    }
    var inputValue = e.value;
    var oldValue = e.oldValue;

    var modifyRow = e.range.getRow();
    var modifyDate = sheet.getRange(modifyRow, 1).getDisplayValue();
    var modifyColumn = e.range.getColumn();
    var taskName = headerRow[0][modifyColumn - 1];
    var toDay = new Date();
    console.log("toDay = %s, modifyDate = %s, modifyRow = %d, modifyColumn = %d, oldValue = %s, and newValue = %s", toDay, modifyDate, modifyRow, modifyColumn, oldValue, inputValue)
    if ((oldValue != inputValue) &&
      (modifyRow <= dataRowEnd) &&
      (modifyRow >= dataRowStart) &&
      //starting with the worship chairperson column
      (4 < modifyColumn) &&
      (modifyColumn <= lastColumn) &&
      //eliminate speaker column
      (modifyColumn != 6) &&
      //only for the future worship date beyond today
      new Date(modifyDate) > toDay) {
      //removing assignment
      var tableRemove = "<table border=1 cellpadding=5px >";
      tableRemove = tableRemove + "<tr><td>Action</td><td>" + "Removing Assignment" + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Column</td><td>" + modifyColumn + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Row</td><td>" + modifyRow + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Worship Task Name</td><td>" + taskName + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Worship Team Member Name</td><td>" + oldValue + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Worship Date</td><td>" + modifyDate + "</td></tr>";
      tableRemove = tableRemove + "<tr><td>Today</td><td>" + toDay + "</td></tr>";
      tableRemove = tableRemove + "</table>";

      //default list
      var toList = email_collection.get("Bill Chu") + ",";
      var ccList = email_collection.get("Bill Chu") + ",";

      //Testing mode
      if (test) {
        console.log("Running in Testing Mode, will re-directing all emails to Bill Chu using default list !!! ");
      } else {
        //Normal mode
        console.log("Running in Normal Removing assignment Mode !!! ")
        if (email_collection.get(oldValue) != undefined) {
          toList = email_collection.get(oldValue) + ",";
        } else {
          console.log("No Email address was found for %s, No removing assignment email was send !!!", oldValue);
          SpreadsheetApp.getActive().toast("Sorry, No Removing assignment email was send to the above co-worker, because no email address was found 👎 !!!", oldValue);
        }
        ccList = email_collection.get("Andy Chu") + ","
          + email_collection.get("Bill Chu") + ","
          + email_collection.get("Edmond Chan") + ",";
      }

      if ((oldValue != undefined) && (email_collection.get(oldValue) != "") && (email_collection.get(oldValue) != undefined)) {
        console.log("The old value is %s, and the old value's email address is %s", oldValue, email_collection.get(oldValue));
        MailApp.sendEmail({
          //to: email_collection.get(oldValue),
          to: toList,
          cc: ccList,
          subject: "Assignment Change in \"" + sheetName + "\" for the week of " + modifyDate,
          htmlBody: tableRemove
        });
        console.log("Sending email to %s for removing assignment of %s,for the worship date of %s, with email address %s", oldValue, taskName, modifyDate, email_collection.get(oldValue));
        SpreadsheetApp.getActive().toast("Successful in sending removing assignment email to the above co-worker 👍 !!!", oldValue);
      } else {
        console.log("toList is undefined, No oldValue or No email address was found, so No removing assignment email was send !!! ");
        SpreadsheetApp.getActive().toast("Sorry, No Removing assignment email was send to the above co-worker, because no email address was found 👎 !!!", oldValue);
      }


      //adding assignment
      var tableAdd = "<table border=1 cellpadding=5px >";
      tableAdd = tableAdd + "<tr><td>Action</td><td>" + "Adding Assignment" + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Column</td><td>" + modifyColumn + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Row</td><td>" + modifyRow + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Worship Task Name</td><td>" + taskName + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Worship Team Member Name</td><td>" + inputValue + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Worship Date</td><td>" + modifyDate + "</td></tr>";
      tableAdd = tableAdd + "<tr><td>Today</td><td>" + toDay + "</td></tr>";
      tableAdd = tableAdd + "</table>";

      //testing mode
      if (test) {
        console.log("Running in Testing Mode, will re-directing all emails to Bill Chu !!! ");
      } else {
        console.log("Running in Normal Adding assignment Mode !!! ")
        if ((email_collection.get(inputValue) != "") && (email_collection.get(inputValue) != undefined)) {
          console.log("The input value1 is %s, and the input value1's email address is %s", inputValue, email_collection.get(inputValue));
          toList = email_collection.get(inputValue) + ",";
        } else {
          console.log("No Email address was found for %s, No adding assignment email was send !!!", inputValue);
          SpreadsheetApp.getActive().toast("Sorry, No Adding assignment email was send to the above co-worker, because no email address was found 👎 !!!", inputValue);
          return;
        }
        ccList = email_collection.get("Andy Chu") + ","
          + email_collection.get("Bill Chu") + ","
          + email_collection.get("Edmond Chan") + ",";
      }

      if (inputValue != undefined) {
        console.log("The input value is %s, and the input value's email address is %s", inputValue, email_collection.get(inputValue));
        MailApp.sendEmail({
          //to: email_collection.get(inputValue),
          to: toList,
          cc: ccList,
          subject: "Assignment Change in \"" + sheetName + "\" for the week of " + modifyDate,
          htmlBody: tableAdd
        });
        console.log("Sending email to %s for adding assignment of %s,for the worship date of %s, with email address %s", inputValue, taskName, modifyDate, email_collection.get(inputValue));
        SpreadsheetApp.getActive().toast("Successful in sending Adding assignment email to the above co-worker 👍 !!!", inputValue);
      } else {
        console.log("toList is undefined, NO inputValue, so No adding assignment email was send !!! ");
      }
    } else {
      console.log("Do nothing because of one of the checking conditions not meet !!!");
      SpreadsheetApp.getActive().toast("Do nothing because of one of the checking conditions not meet!! 👎 ", e.source.getSheetName());
      return;
    }
  } else {
    console.log("\"%s\", is not the correct sheet to work on !!!", e.source.getSheetName());
    //SpreadsheetApp.getActive().toast("This is not the correct sheet to work on !!! 👎 ", e.source.getSheetName());
  }

}


