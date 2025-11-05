// src/MailApiError.js
export class MailApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'MailApiError';
    this.code = code;
  }
}