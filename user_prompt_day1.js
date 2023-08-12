function user_prompt_day1(type) {
  var type_of_reminder = type;
  if ((type_of_reminder != "email") && (type_of_reminder != "text")) {
    Logger.log("Only \"email\" or \"text\" reminder is suported");
  }
  else {
    find_day = 0;
    while (find_day == 0) {
      var ui = SpreadsheetApp.getUi();
      if (type_of_reminder == "email") {
        var response = ui.prompt('Setting up the email reminder day', 'Which day of the week you want to send out email reminder? (monday Thru saturday), Case Insensitive, the time is always fix between 11am and 12pm', ui.ButtonSet.OK_CANCEL);
      }
      else if (type_of_reminder == "text") {
        var response = ui.prompt('Setting up the text reminder day', 'Which day of the week you want to send out text reminder? (monday Thru saturday), Case Insensitive, the time is always fix between 8am and 9am', ui.ButtonSet.OK_CANCEL);
      }

      // Process the user's response.

      if (response.getSelectedButton() == ui.Button.OK) {
        if ((response.getResponseText().toString().toUpperCase() != "MONDAY") && (response.getResponseText().toString().toUpperCase() != "TUESDAY") &&
          (response.getResponseText().toString().toUpperCase() != "WEDNESDAY") && (response.getResponseText().toString().toUpperCase() != "THURSDAY") &&
          (response.getResponseText().toString().toUpperCase() != "FRIDAY") && (response.getResponseText().toString().toUpperCase() != "SATURDAY")) {
          if (type_of_reminder == "email") {
            Logger.log("Please select any one day(monday Thru saturday) as the email reminder day, but you have selected " + response.getResponseText() + " !!!");
          }
          else if (type_of_reminder == "text") {
            Logger.log("Please select any one day(monday Thru saturday) as the text reminder day, but you have selected " + response.getResponseText() + " !!!");
          }
          SpreadsheetApp.getUi().alert("Please select any one day like, monday,tuesday,wednesday,thursday,friday,saturday (Case Insensitive), but you have selected " + response.getResponseText() + " !!! ");
          break;
        }
        else {
          if (type_of_reminder == "email") {
            SpreadsheetApp.getUi().alert("You have selected " + response.getResponseText() + " for the new email reminder day !!!" );
            Logger.log("The email reminder day is " + response.getResponseText());
            set_email_reminder_trigger1(response.getResponseText().toString().toUpperCase());
          }
          else if (type_of_reminder == "text") {
            SpreadsheetApp.getUi().alert("You have selected " + response.getResponseText() + " for the new text reminder day !!!" );
            Logger.log("The text reminder day is " + response.getResponseText());
            set_text_reminder_trigger1(response.getResponseText().toString().toUpperCase());
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

