// Irrigation Line Shock SOP — checklist logger
//
// SETUP (one time):
// 1. Open the Google Sheet you want this log to live in — a new blank sheet,
//    or your existing NLT Live Bulk Inventory workbook both work fine. This
//    script creates its own "Irrigation Line Shock Log" tab and never reads
//    or writes any other tab.
// 2. Extensions > Apps Script.
// 3. Delete anything in Code.gs and paste this whole file in.
// 4. Deploy > New deployment > select type "Web app".
//      - Execute as: Me
//      - Who has access: Anyone with the link
// 5. Click Deploy, authorize it, and copy the Web app URL it gives you
//      (ends in /exec).
// 6. Paste that URL into the "Apps Script URL" field on the
//      IrrigationLineShockSOP.html page (in the Checklist section).
//      Send the URL back so it can be hardcoded into the page instead,
//      so nobody has to paste it in by hand.
//
// Each click of "Save to Sheet" on the page appends ONE row with whatever
// is checked at that moment — click it when the checklist is complete, or
// again later if you want to log an updated snapshot.

var SHEET_NAME = 'Irrigation Line Shock Log';

var COLUMNS = [
  'Timestamp', 'Room', 'Date', 'By',
  'Harvest: tables cleared', 'Harvest: pots removed', 'PPE on',
  'Task 1: GreenClean dosed (8:00 AM)', 'Task 1: held 3 hrs (to 11:00 AM)',
  'Task 2: flushed (11:00 AM)',
  'Task 3: SaniDate dosed (11:20 AM)', 'Task 3: held overnight',
  'Day 2: flushed (8:00 AM)', 'Day 2: drippers checked'
];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var items = data.items || {};
  var sheet = getOrCreateSheet_();

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

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
