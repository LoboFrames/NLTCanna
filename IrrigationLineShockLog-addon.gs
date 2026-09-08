/*******************************************************************
 * IRRIGATION LINE SHOCK LOG — ADD-ON, not a replacement
 *
 * Paste this block onto the END of your existing NLT grow team script
 * (the one with Grow Tools / RoomEntryUI / Task Log / etc). It doesn't
 * touch or rename anything already in that file — it only adds:
 *   - one new function: doPost(e)
 *   - two small helpers, both prefixed so they can't collide with
 *     anything you already have: logIrrigationLineShock_ and
 *     getOrCreateIrrigationShockSheet_
 *
 * Your script has no doPost right now (the sidebar talks to Apps
 * Script through google.script.run, which doesn't need one). This
 * adds the FIRST one, purely so the Irrigation Line Shock SOP page —
 * a separate HTML file that lives outside this spreadsheet — has a
 * URL it can send its checklist to.
 *
 * IMPORTANT: a project can only have ONE doPost. If you ever wire up
 * a second external page later, don't add a second doPost — add
 * another "else if (data.type === '...')" branch inside this one.
 *
 * SETUP:
 * 1. Extensions > Apps Script (on the NLT grow team sheet).
 * 2. Scroll to the bottom of Code.gs (or wherever) and paste this
 *    whole block in. Save.
 * 3. Deploy > New deployment (or, if this project already has a
 *    deployment for something else, Manage deployments > the pencil
 *    icon > New version instead, so any existing URL doesn't move).
 *      - Select type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone with the link
 * 4. Deploy, authorize it, and copy the URL ending in /exec.
 * 5. Paste that URL into the "Apps Script URL" field on the
 *    Irrigation Line Shock SOP page, or send it back so it can be
 *    hardcoded into the page instead.
 *
 * Each click of "Save to Sheet" on that page appends ONE row to a new
 * "Irrigation Line Shock Log" tab in THIS spreadsheet, created
 * automatically on first use. It does not read or write any of your
 * other tabs (Flower irrigation, Task Log, Current Schedule, etc).
 *******************************************************************/

var IRRIGATION_SHOCK_SHEET = 'Irrigation Line Shock Log';

var IRRIGATION_SHOCK_COLUMNS = [
  'Timestamp', 'Room', 'Date', 'By',
  'Harvest: tables cleared', 'Harvest: pots removed', 'PPE on',
  'Task 1: GreenClean dosed (8:00 AM)', 'Task 1: held 3 hrs (to 11:00 AM)',
  'Task 2: flushed (11:00 AM)',
  'Task 3: SaniDate dosed (11:20 AM)', 'Task 3: held overnight',
  'Day 2: flushed (8:00 AM)', 'Day 2: drippers checked'
];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.type === 'irrigationLineShock') {
    return logIrrigationLineShock_(data);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unknown type: ' + data.type }))
    .setMimeType(ContentService.MimeType.JSON);
}

function logIrrigationLineShock_(data) {
  var items = data.items || {};
  var sheet = getOrCreateIrrigationShockSheet_();

  sheet.appendRow([
    new Date(),
    data.room || '',
    data.date || '',
    data.by || '',
    !!items.c1,  // Harvest: tables cleared
    !!items.c2,  // Harvest: pots removed
    !!items.c3,  // PPE on
    !!items.c4,  // Task 1 dosed
    !!items.c5,  // Task 1 held
    !!items.c6,  // Task 2 flushed
    !!items.c7,  // Task 3 dosed
    !!items.c8,  // Task 3 held
    !!items.c9,  // Day 2 flushed
    !!items.c10  // Day 2 checked
  ]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateIrrigationShockSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(IRRIGATION_SHOCK_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(IRRIGATION_SHOCK_SHEET);
    sheet.appendRow(IRRIGATION_SHOCK_COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
