function get_trigger_name() {
  var oldTrigger = ScriptApp.getScriptTriggers()
  //Logger.log(oldTrigger);
  for (var i = 0; i < oldTrigger.length; i++) {
    Logger.log(ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_reminder_email") {
      Logger.log("Found trigger run_reminder_email !!! ");
    }
    else if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_reminder_text") {
      Logger.log("Found trigger run_reminder_text !!! ");
    }
  }
}
