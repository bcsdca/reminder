function user_prompt_day(type) {
  var type_of_reminder = type;
  if ((type_of_reminder != "email") && (type_of_reminder != "text")) {
    Logger.log("Only \"email\" or \"text\" reminder is suported");
  }
  else {
    find_day = 0;
    while (find_day == 0) {
      var ui = SpreadsheetApp.getUi();
      if (type_of_reminder == "email") {
        var response = ui.prompt('Setting up the email reminder day', 'Which day of the week you want to send out email reminder? (MONDAY Thru SATURDAY), all UPPERCASE, the time is always fix between 11am and 12pm', ui.ButtonSet.OK_CANCEL);
      }
      else if (type_of_reminder == "text") {
        var response = ui.prompt('Setting up the text reminder day', 'Which day of the week you want to send out text reminder? (MONDAY Thru SATURDAY), all UPPERCASE, the time is always fix between 8am and 9am', ui.ButtonSet.OK_CANCEL);
      }

      // Process the user's response.

      if (response.getSelectedButton() == ui.Button.OK) {
        if ((response.getResponseText() != "MONDAY") && (response.getResponseText() != "TUESDAY") &&
          (response.getResponseText() != "WEDNESDAY") && (response.getResponseText() != "THURSDAY") &&
          (response.getResponseText() != "FRIDAY") && (response.getResponseText() != "SATURDAY")) {
          if (type_of_reminder == "email") {
            Logger.log("Please select any one day(MONDAY thru SATURDAY) as the email reminder day, but you have selected " + response.getResponseText() + " !!!");
          }
          else if (type_of_reminder == "text") {
            Logger.log("Please select any one day(MONDAY thru SATURDAY) as the text reminder day, and you have just selected " + response.getResponseText() + " !!!");
          }
          SpreadsheetApp.getUi().alert("Please select any one day like, MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY (ALL UPPER CASE), and you have just selected " + response.getResponseText() + " !!!");
          break;
        }
        else {
          if (type_of_reminder == "email") {
            Logger.log("The email reminder day is " + response.getResponseText());
            set_email_reminder_trigger1(response.getResponseText());
          }
          else if (type_of_reminder == "text") {
            Logger.log("The text reminder day is " + response.getResponseText());
            set_text_reminder_trigger1(response.getResponseText());
          }
          find_day = 1
          //return response.getResponseText();
        }
      }
      else if (response.getSelectedButton() == ui.Button.CANCEL) {
        Logger.log('The user canceled the dialog.');
        break;
      }
      else {
        Logger.log('The user clicked the close button in the dialog\'s title bar.');
        break;
      }
    }
  }
}

