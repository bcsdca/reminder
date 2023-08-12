function sendText() {
  var EmailTo = "8587167471@tmomail.net";
  var subject = "Whatever";
  var body = "Text1";

  MailApp.sendEmail(EmailTo, subject, body);
  var form = FormApp.getActiveForm();
  var formResponses = form.getResponses();
  Logger.log("response is: " + formResponses);
}
