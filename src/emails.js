// src/emails.js
export class Emails {
  constructor(client) {
    this.client = client;
  }

  /**
   * Send a transactional email.
   * @param {object} payload - Email send payload.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async send(payload) {
    return this.client.request('POST', '/email', payload);
  }

  /**
   * Verify an email address.
   * @param {object} payload - Email verify payload.
   * @param {string} payload.email - The email to verify.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async verify(payload) {
    return this.client.request('GET', '/verify', payload);
  }

  /**
   * Update an existing contact's properties.
   * @param {object} payload - Contact update payload.
   * @param {string} payload.email - The email of the contact to update.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async update(payload) {
    // This is the method moved from contacts.js
    return this.client.request('POST', '/email/update', payload);
  }
}