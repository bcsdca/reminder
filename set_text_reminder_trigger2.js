function set_text_reminder_trigger2() {
  
  ScriptApp.newTrigger('run_text_reminder').timeBased().everyWeeks(1).onWeekDay(ScriptApp.WeekDay.SATURDAY).atHour(9).create();
  Logger.log("Start trigger run_text_reminder !!! ");
  
}