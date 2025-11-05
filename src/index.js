// src/index.js
import { BaseClient } from './BaseClient.js';
import { Emails } from './emails.js';

/**
 * MailApiDev SDK
 * @param {string} apiKey - Your MailAPI key.
 */
export class MailApiDev {
  constructor(apiKey) {
    const client = new BaseClient(apiKey);
    this.emails = new Emails(client);
    // this.contacts = new Contacts(client); // <-- DELETE THIS LINE
  }
}