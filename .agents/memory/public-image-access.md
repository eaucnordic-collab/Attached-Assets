---
name: Public image access
description: Access rule for editorial images stored in private App Storage
---

Public editorial images can be uploaded into private App Storage, but their serving route must allow anonymous reads only when the image is referenced by published content. Do not open the entire upload directory or require admin authentication for images already displayed publicly.

**Why:** A broad admin-only restriction on object reads broke published news cover images for logged-out visitors, even though the article metadata itself was public. Cached images on some devices made this appear device-specific.

**How to apply:** When adding public content with uploaded media, include its published references in the read-access rule. Preserve authentication for uploads and for media that is unreferenced or belongs only to drafts.