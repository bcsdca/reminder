/**
 * The event handler triggered when opening the spreadsheet.
 * @param {Event} e The onOpen event.
 * @see https://developers.google.com/apps-script/guides/triggers#onopene
 */
function onOpen(e) {
  // Add a custom menu to the spreadsheet.
  SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
      .createMenu('Cantonese Worship Reminder')
      .addItem('Scheduling Email Reminder day...', 'emailReminderSidebar')
      .addItem('Scheduling Text Reminder day...', 'textReminderSidebar')
      .addItem('Starting A/V Schedule Change Monitoring(Will Send Email Alert)!!!', 'addScheduleChangeTrigger')
      .addItem('Stopping A/V Schedule Change Monitoring(Will NOT Send Email Alert)!!!', 'removeScheduleChangeTrigger')
      .addToUi();
}

function emailReminderSidebar() {
 var widget = HtmlService.createHtmlOutputFromFile("selDay_email.html");
 widget.setTitle("Cantonese Worship Email Reminder Day");
 SpreadsheetApp.getUi().showSidebar(widget);
}

function textReminderSidebar() {
 var widget = HtmlService.createHtmlOutputFromFile("selDay_text.html");
 widget.setTitle("Cantonese Worship Text Reminder Day");
 SpreadsheetApp.getUi().showSidebar(widget);
}

function closeSidebar() {
    var html = HtmlService.createHtmlOutput("<script>google.script.host.close();</script>");
    SpreadsheetApp.getUi().showSidebar(html);
}
 
