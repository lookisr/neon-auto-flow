import { Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheetsService';
import { CarBuyoutForm, CarImportForm } from '../types/index.js';

export class FormController {
  static async submitCarBuyout(req: Request, res: Response): Promise<void> {
    try {
      const formData: CarBuyoutForm = req.body;
      
      try {
        await GoogleSheetsService.submitCarBuyout(formData);
      } catch (googleSheetsError) {
        console.log('Google Sheets error, saving to console:', formData);
        // Fallback: save to console if Google Sheets fails
      }
      
      res.status(200).json({
        success: true,
        message: 'Car buyout form submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting car buyout form:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit car buyout form'
      });
    }
  }

  static async submitCarImport(req: Request, res: Response): Promise<void> {
    try {
      const formData: CarImportForm = req.body;
      
      try {
        await GoogleSheetsService.submitCarImport(formData);
      } catch (googleSheetsError) {
        console.log('Google Sheets error, saving to console:', formData);
        // Fallback: save to console if Google Sheets fails
      }
      
      res.status(200).json({
        success: true,
        message: 'Car import form submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting car import form:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit car import form'
      });
    }
  }
} 