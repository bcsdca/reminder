function set_text_reminder_trigger() {
  
  run_text_reminder_found = 0;
  
  var oldTrigger = ScriptApp.getScriptTriggers()
  Logger.log(oldTrigger);
  for (var i = 0; i < oldTrigger.length; i++) {
    Logger.log(ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_text_reminder") {
      Logger.log("Found old trigger run_text_reminder !!! ");
      run_text_reminder_found = 1;
    }
  }
  if (run_text_reminder_found == 0) {
    ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(9).create();
    Logger.log("No old run_text_reminder Found, Start trigger run_text_reminder !!! ");
  }
}