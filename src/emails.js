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
   * Verify and add a new contact to your project.
   * @param {object} payload - Contact add payload.
   * @param {string} payload.email - The email of the contact to add.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async add(payload) {
    // Assumes the route is /email/add based on your /email/update
    return this.client.request('POST', '/email/add', payload);
  }

  /**
   * Update an existing contact's properties.
   * @param {object} payload - Contact update payload.
   * @param {string} payload.email - The email of the contact to update.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async update(payload) {
    return this.client.request('POST', '/email/update', payload);
  }

  /**
   * Delete a contact from your project.
   * @param {object} payload - Contact delete payload.
   * @param {string} payload.email - The email of the contact to delete.
   * @returns {Promise<{ data: object, error: MailApiError }>}
   */
  async delete(payload) {
    // Assumes the route is /email/delete
    return this.client.request('POST', '/email/delete', payload);
  }
}