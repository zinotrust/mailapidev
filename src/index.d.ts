// src/index.d.ts

// --- Error Class ---
/**
 * Custom error class for API responses.
 * Contains a 'code' from the MailApi.dev error response.
 */
export class MailApiError extends Error {
  code: string;
  constructor(message: string, code: string);
}

// --- Payload Interfaces (What the user sends) ---

export interface SendEmailPayload {
  /** The "From" email address. E.g., "Your App <hello@mailapi.dev>" */
  from: string;
  /** The recipient's email address. */
  to: string;
  /** The subject of the email. */
  subject: string;
  /** The HTML or text content of the email. Required if 'template_id' is not used. */
  message?: string;
  /** The ID of a pre-built template. Required if 'message' is not used. */
  template_id?: string;
  /** A key-value object of data to merge into your template. */
  template_data?: Record<string, any>;
  /** A "Reply-To" email address. */
  reply_to?: string;
  /** Set to true to allow sending to known disposable email addresses. Defaults to false. */
  allow_disposable_email?: boolean;
  /** Set to true to verify the email before sending. Does not save to contacts. */
  verify?: boolean;
  /** Set to true to verify the email and save it to your contact list if valid. */
  verify_and_save?: boolean;
}

export interface VerifyEmailPayload {
  /** The email address you want to verify. */
  email: string;
}

export interface UpdateContactPayload {
  /** The email address of the contact you want to update. */
  email: string;
  /** An object containing the contact's plan details. */
  plan?: {
    id?: string;
    name?: string;
    amount?: number;
    interval?: 'month' | 'year' | 'one_time' | 'free';
  };
  /** The contact's subscription status. */
  subscriptionStatus?: 'trialing' | 'active' | 'past_due' | 'canceled' | 'churned' | 'free';
  /** An ISO 8601 string or Date object. Setting this also increments 'sessionCount'. */
  lastSeenAt?: string | Date;
  /** An array of strings. This will overwrite all existing tags. */
  tags?: string[];
  /** A key-value object of custom data. This will overwrite all existing custom fields. */
  customFields?: Record<string, any>;
  /** An ISO 8601 string or Date object for when a trial started. */
  trialStartedAt?: string | Date;
  /** An ISO 8601 string or Date object for when a trial ended. */
  trialEndedAt?: string | Date;
  /** An ISO 8601 string or Date object for when the contact converted to paid. */
  convertedAt?: string | Date;
  /** An ISO 8601 string or Date object for when the contact churned. */
  churnedAt?: string | Date;
  /** A string explaining why the contact churned. */
  churnReason?: string;
}

// --- Success Response Interfaces (What the API returns) ---

export interface SendEmailSuccessResponse {
  success: true;
  messageId: string;
  message: string;
  creditsRemaining: number;
  emailVerified: boolean;
  emailSaved: boolean;
  templateUsed: string | null;
}

export interface VerifyEmailValidators {
  is_deliverable: boolean;
  is_valid_syntax: boolean;
  is_typo_free: boolean;
  has_mx_records: boolean;
  passed_disposable_check: boolean;
  passed_role_check: boolean;
  passed_catch_all_check: boolean;
  is_free_email: boolean;
}

export interface VerifyEmailSuccessResponse {
  email: string;
  valid: boolean;
  message: string;
  validators: VerifyEmailValidators;
  creditsRemaining: number;
}

export interface ContactData {
  _id: string;
  projectId: string;
  email: string;
  plan: {
    id?: string;
    name: string;
    amount: number;
    interval: string;
  };
  subscriptionStatus: string;
  lastSeenAt?: string;
  sessionCount: number;
  tags: string[];
  customFields: Record<string, any>;
  trialStartedAt?: string;
  trialEndedAt?: string;
  convertedAt?: string;
  churnedAt?: string;
  churnReason?: string;
  automationMetadata: {
    lastAutomationSent?: string;
    unsubscribedFromAutomations: boolean;
    unsubscribedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateContactSuccessResponse {
  success: true;
  message: string;
  action: 'updated' | 'created'; // Your controller only shows 'updated'
  data: ContactData;
}

// --- API Wrapper Type ---

/**
 * The standard response shape from the MailApiDev SDK.
 * Contains either 'data' on success or 'error' on failure.
 */
export type MailApiResponse<T> = Promise<{
  data: T | null;
  error: MailApiError | null;
}>;

// --- Main SDK Class Definitions ---

export class Emails {
  /**
   * Send a transactional email.
   * @param {SendEmailPayload} payload - Email send payload.
   */
  send(payload: SendEmailPayload): MailApiResponse<SendEmailSuccessResponse>;
  
  /**
   * Verify an email address.
   * @param {VerifyEmailPayload} payload - Email verify payload.
   */
  verify(payload: VerifyEmailPayload): MailApiResponse<VerifyEmailSuccessResponse>;

  /**
   * Update an existing contact's properties.
   * @param {UpdateContactPayload} payload - Contact update payload.
   */
  update(payload: UpdateContactPayload): MailApiResponse<UpdateContactSuccessResponse>;
}

export class MailApiDev {
  /**
   * Initialize the MailApiDev client.
   * @param {string} apiKey - Your MailAPI key from your project dashboard.
   */
  constructor(apiKey: string);
  
  /**
   * Access email sending, verification, and contact update methods.
   */
  emails: Emails;
}