export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface TranscriptionResult {
  text: string;
  fileName: string;
  timestamp: Date;
}

export interface FileValidationError {
  valid: boolean;
  message?: string;
}