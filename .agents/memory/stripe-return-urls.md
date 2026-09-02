---
name: Stripe return URLs
description: Stripe Checkout rejects callback URLs containing raw non-ASCII characters.
---

## Rule
Percent-encode non-ASCII characters in Stripe Checkout success and cancel URLs before sending them to the API.

**Why:** Stripe validates the callback URL as a URL and rejects raw Unicode characters such as accented letters.

**How to apply:** Keep URL syntax and Checkout placeholders intact, but encode Unicode path, query, or fragment content (for example, an accented anchor) before passing the URL to Stripe.