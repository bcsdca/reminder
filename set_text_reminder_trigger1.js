function set_text_reminder_trigger1(d) {

  var text_trigger_day = d;
  // remove all old text reminder triggers
  let remove_array = []
  var oldTrigger = ScriptApp.getScriptTriggers()
  Logger.log("The above triggers are the current running triggers !!!");
  //Logger.log(oldTrigger.length);
  for (var i = 0; i < oldTrigger.length; i++) {
    Logger.log("Current running trigger is " + ScriptApp.getScriptTriggers()[i].getHandlerFunction());
    if (ScriptApp.getScriptTriggers()[i].getHandlerFunction() == "run_text_reminder") {
      remove_array.push(oldTrigger[i]);
    }
  }

  remove_array.forEach(function (row) {
    ScriptApp.deleteTrigger(row);
    Logger.log(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HH:mm:ss') + ': Deleting text reminder trigger ' + row + ' !!!');
  });

  switch (text_trigger_day) {
    case "MONDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
      break;
    case "TUESDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.TUESDAY).atHour(9).create();
      break;
    case "WEDNESDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.WEDNESDAY).atHour(9).create();
      break;
    case "THURSDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.THURSDAY).atHour(9).create();
      break;
    case "FRIDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.FRIDAY).atHour(9).create();
      break;
    case "SATURDAY":
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(9).create();
      break;
    default:
      ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(9).create();
      Logger.log("DEFAULT: Start new trigger run_text_reminder on SATURDAY !!!");
      break;
  }


  Logger.log("Starting new trigger run_text_reminder on " + text_trigger_day + " !!!");

}