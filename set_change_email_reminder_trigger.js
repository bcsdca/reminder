function set_change_email_reminder_trigger(option) {


  // removing all old change email reminder triggers 1st
  let remove_array = []
  var oldTrigger = ScriptApp.getScriptTriggers()
  //Logger.log(oldTrigger.length);
  Logger.log("The below triggers are the current running triggers !!!");
  for (var i = 0; i < oldTrigger.length; i++) {
    Logger.log(ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_change_email_reminder") {
      remove_array.push(oldTrigger[i]);

    }
  }
  remove_array.forEach(function (row) {
    //Logger.log(row);
    ScriptApp.deleteTrigger(row);
    Logger.log(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': Deleting the old change email reminder trigger ' + row + ' !!!');

  });

  if (option == "enable") {
    ScriptApp.newTrigger("run_change_email_reminder")
      .forSpreadsheet(SpreadsheetApp.getActive())
      .onEdit()
      .create();

    Logger.log("The new a/v schedule change email reminder trigger was just created !!!",);
    SpreadsheetApp.getActive().toast("The new a/v schedule change email reminder trigger was just created 👍 !!!");
  } else {
    Logger.log("The a/v schedule change email reminder trigger was just removed !!!",);
    SpreadsheetApp.getActive().toast("The a/v schedule change email reminder trigger was just removed 👍 !!!");
  }
}
