# MailApiDev Node.js SDK

The official Node.js library for the [MailApi.dev](https://mailapi.dev) API.

## Installation

```bash
npm install mailapidev
```

## Usage

First, get your API key from your [MailApi.dev dashboard](https://app.mailapi.dev).

```javascript
import { MailApiDev } from 'mailapidev';

// Initialize the client with your API key
const mailapi = new MailApiDev(process.env.MAILAPI_KEY);

// All methods return a { data, error } object
// On success, `data` will be populated and `error` will be null.
// On failure, `data` will be null and `error` will be a MailApiError object.
```

### 1. Send an Email

Send a transactional email.

```javascript
async function sendEmail() {
  const { data, error } = await mailapi.emails.send({
    from: "Your App <noreply@mail.mailapi.dev>",
    to: "recipient@example.com",
    subject: "Hello World!",
    message: "<p>It works!</p>",
    reply_to: "support@example.com"
  });

  if (error) {
    console.error("Failed to send email:", error.message);
    console.error("Error Code:", error.code);
    return;
  }

  console.log("Email sent successfully:", data.messageId);
  console.log("Credits Remaining:", data.creditsRemaining);
}
```

---

### 2. Send an Email With a Template

To send email using templates, go to your MailApi.dev dashboard, create a template, and get its `template_id` and `template_data` variables.

```javascript
async function sendTemplateEmail() {
  const { data, error } = await mailapi.emails.send({
    from: "Your App <noreply@mail.mailapi.dev>",
    to: "recipient@example.com",
    subject: "Welcome, {{name}}!",
    template_id: "template_welcome_123",
    template_data: {
      "name": "Zino",
      "login_url": "[https://app.mailapi.dev/login](https://app.mailapi.dev/login)"
    }
  });

  if (error) {
    console.error("Failed to send email:", error.message);
    return;
  }

  console.log("Template email sent:", data.messageId);
}
```

---

### 3. Update an email in your project EmailList

Update an existing email in your project. This is perfect for syncing subscription status or user activity.

```javascript
async function updateEmailList() {
  // Use mailapi.emails.update()
  const { data, error } = await mailapi.emails.update({
    email: "user@example.com",
    subscriptionStatus: "active",
    plan: {
      name: "Pro",
      amount: 29.99,
      interval: "month"
    },
    lastSeenAt: new Date().toISOString(),
    tags: ["pro-user", "active-subscriber"],
    customFields: {
      company: "Acme Inc.",
      user_id: "u12345"
    }
  });

  if (error) {
    console.error("Failed to update contact:", error.message);
    return;
  }

  console.log("Contact updated:", data.data);
}
```

---

### 3. Verify an Email

Check if an email address is valid and deliverable.

```javascript
async function verifyEmail() {
  const { data, error } = await mailapi.emails.verify({
    email: "user@example.com"
  });

  if (error) {
    console.error("Failed to verify email:", error.message);
    console.error("Error Code:", error.code);
    return;
  }

  if (data.valid) {
    console.log("Email is valid and deliverable!");
  } else {
    console.log("Email is invalid:", data.message);
  }
  
  console.log("Validators:", data.validators);
}
```

---

## API Reference

### `mailapi.emails.send(payload)`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `from` | string | **Yes** | The "From" email address. E.g., "Your App <hello@mailapi.dev>" |
| `to` | string | **Yes** | The recipient's email address. |
| `subject` | string | **Yes** | The subject of the email. |
| `message` | string | Conditional | The HTML or text content. Required if `template_id` is not used. |
| `template_id` | string | Conditional | The ID of a template. Required if `message` is not used. |
| `template_data`| object | No | A key-value object of data to merge into your template. |
| `reply_to` | string | No | A "Reply-To" email address. |
| `allow_disposable_email` | boolean | No | Set to `true` to allow sending to disposable emails. Defaults to `false`. |
| `verify` | boolean | No | Set to `true` to verify the email before sending. Does not save to contacts. |
| `verify_and_save` | boolean | No | Set to `true` to verify the email and save it to your contact list if valid. |

### `mailapi.emails.update(payload)`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | **Yes** | The email address of the contact you want to update. |
| `plan` | object | No | Object with plan details: `id` (string), `name` (string), `amount` (number), `interval` (string). |
| `subscriptionStatus` | string | No | One of: "trialing", "active", "past_due", "canceled", "churned", "free". |
| `lastSeenAt` | string \| Date | No | ISO 8601 string. Also increments the contact's `sessionCount` by 1. |
| `tags` | string[] | No | An array of strings. This will **overwrite** all existing tags. |
| `customFields` | object | No | A key-value object of custom data. This will **overwrite** all existing custom fields. |
| `trialStartedAt` | string \| Date | No | ISO 8601 string for when a trial started. |
| `trialEndedAt` | string \| Date | No | ISO 8601 string for when a trial ended. |
| `convertedAt` | string \| Date | No | ISO 8601 string for when the contact converted to paid. |
| `churnedAt` | string \| Date | No | ISO 8601 string for when the contact churned. |
| `churnReason` | string | No | A string explaining why the contact churned. |

### `mailapi.emails.verify(payload)`

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | **Yes** | The email address you want to verify. |