import { db, formsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const CONTACT_FORM_NAME = "Contact Form";

export async function seedContactForm() {
  try {
    const existing = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.name, CONTACT_FORM_NAME))
      .limit(1);

    if (existing.length > 0) return;

    await db.insert(formsTable).values({
      name: CONTACT_FORM_NAME,
      description: "Contact form for eaucnordic.com",
      fields: [
        { id: "name",    type: "text",     label: "Navn",   order: 0, width: "half", required: true,  placeholder: "Dit fulde navn" },
        { id: "email",   type: "email",    label: "E-mail", order: 1, width: "half", required: true,  placeholder: "din@email.dk" },
        { id: "subject", type: "text",     label: "Emne",   order: 2, width: "full", required: false, placeholder: "Hvad drejer din henvendelse sig om?" },
        { id: "message", type: "textarea", label: "Besked", order: 3, width: "full", required: true,  placeholder: "Skriv din besked her..." },
      ],
      submitButtonLabel: "Send besked",
      successMessage: "Дякуємо за повідомлення! Ми відповімо вам якнайшвидше.",
    });

    logger.info("Seeded Contact Form");
  } catch (err) {
    logger.error({ err }, "Failed to seed contact form");
  }
}
