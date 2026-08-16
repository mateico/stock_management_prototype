/**
 * Google Apps Script bound to the stock spreadsheet.
 *
 * Setup:
 *  1. Extensions > Apps Script, paste this file in.
 *  2. Project Settings > Script Properties, add WEBHOOK_SECRET with the same
 *     value as the SHEETS_WEBHOOK_SECRET worker secret.
 *  3. Triggers > Add Trigger > notifyApp / From spreadsheet / On change.
 *     Use "On change" rather than "On edit" so it also fires for row
 *     inserts/deletes, not just cell edits.
 */

var WORKER_URL =
  "https://stock-management-prototype.mateo-rial.workers.dev/api/sheets-webhook";

function notifyApp() {
  var secret =
    PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");

  if (!secret) {
    throw new Error("WEBHOOK_SECRET script property is not set");
  }

  Logger.log("Calling: " + WORKER_URL);

  var response = UrlFetchApp.fetch(WORKER_URL, {
    method: "post",
    headers: { "x-webhook-secret": secret },
    muteHttpExceptions: true,
  });

  var status = response.getResponseCode();
  Logger.log("Status: " + status + " body: " + response.getContentText());

  // A 200 on the bare origin is the HTML homepage, not the webhook — fail loudly
  // rather than silently "succeeding" like the previous version did.
  if (status !== 200) {
    throw new Error("Webhook failed: " + status + " " + response.getContentText());
  }
}
