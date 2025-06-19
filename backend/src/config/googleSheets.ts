import { google } from 'googleapis';
import dotenv from 'dotenv';
import { GoogleSheetsConfig } from '../types/index';

dotenv.config();

const config: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
  sheetNameBuyout: process.env.GOOGLE_SHEETS_SHEET_NAME_BUYOUT || 'Выкуп',
  sheetNameKorea: process.env.GOOGLE_SHEETS_SHEET_NAME_KOREA || 'Корея'
};

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

export const sheets = google.sheets({ version: 'v4', auth });

export const appendToSheet = async (
  sheetName: string,
  values: any[][]
): Promise<void> => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values
      }
    });
    console.log(`✅ Data appended to sheet: ${sheetName}`);
  } catch (error) {
    console.error(`❌ Error appending to sheet ${sheetName}:`, error);
    throw error;
  }
};

export { config as googleSheetsConfig }; 