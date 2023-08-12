function remove_email_reminder_trigger() {
  let remove_array = []
  var oldTrigger = ScriptApp.getScriptTriggers()
  //Logger.log(oldTrigger.length);
  for (var i = 0; i < oldTrigger.length; i++) {
    Logger.log(ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_email_reminder") {
      remove_array.push(oldTrigger[i]);
      
    }
  }
  remove_array.forEach(function (row) {
    //Logger.log(row);
    ScriptApp.deleteTrigger(row);
    Logger.log(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': Deleting email reminder trigger ' + row + ' !!!');
       
  });

}