import { appendToSheet, googleSheetsConfig } from '../config/googleSheets.js';
import { GoogleSheetsConfig, CarBuyoutForm, CarImportForm } from '../types/index.js';

export class GoogleSheetsService {
  static async submitCarBuyout(data: CarBuyoutForm): Promise<void> {
    const values = [
      [
        new Date().toISOString(),
        data.brand,
        data.model,
        data.year.toString(),
        data.desiredPrice.toString(),
        `'${data.phone}` // Добавляем одинарную кавычку в начало номера телефона для избежания ошибок форматирования в Google Sheets
      ]
    ];

    await appendToSheet(googleSheetsConfig.sheetNameBuyout, values);
  }

  static async submitCarImport(data: CarImportForm): Promise<void> {
    const values = [
      [
        new Date().toISOString(),
        data.carType,
        data.budget.toString(),
        data.deliveryCity,
        data.name,
        `'${data.phone}` // Добавляем одинарную кавычку в начало номера телефона для избежания ошибок форматирования в Google Sheets
      ]
    ];

    await appendToSheet(googleSheetsConfig.sheetNameKorea, values);
  }
} 
