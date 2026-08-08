import { google } from "googleapis";
import type { Lote } from "./types";

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
      private_key_id: process.env.GOOGLE_SHEETS_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_SHEETS_CLIENT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function getSheetData(): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "Sheet1!A:D",
  });

  return response.data.values || [];
}

export async function appendLoteToSheet(lote: Omit<Lote, "id">): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[lote.tipoPan, lote.lote, lote.unidades, lote.estado]],
    },
  });
}

export async function updateLoteInSheet(
  rowIndex: number,
  lote: Omit<Lote, "id">,
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Row index + 2 (1 for header, 1 for A1 notation starting at 1)
  const rowNumber = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `Sheet1!A${rowNumber}:D${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[lote.tipoPan, lote.lote, lote.unidades, lote.estado]],
    },
  });
}
