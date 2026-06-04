import { Router } from "express";
import { Resend } from "resend";
import { prisma } from "../db/prisma";
import { NewsletterSignupSchema } from "../inputs";

const router = Router();

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

router.post("/", async (req, res) => {
  const parsed = NewsletterSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
  }

  const { email, name } = parsed.data;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (existing) {
    return res.json({ success: true, data: { alreadySubscribed: true } });
  }

  await prisma.newsletterSubscriber.create({ data: { email, name: name ?? null } });

  /* fire-and-forget welcome email — don't block response on send failure */
  resend.emails.send({
    from: "WellNest <updates@wellnest.mohit.systems>",
    to: email,
    subject: "You're on the list — welcome to WellNest",
    html: `<p>Hi${name ? ` ${name}` : ""},</p>
<p>Thanks for joining the WellNest community. You'll hear from us when we launch new resources, therapists, and features.</p>
<p>In the meantime, browse our <a href="https://wellnest.mohit.systems/resources">Mental Health Library</a> — it's free, always.</p>
<p>— The WellNest team</p>`,
  }).catch(() => {});

  res.json({ success: true, data: { alreadySubscribed: false } });
});

router.get("/count", async (_req, res) => {
  const count = await prisma.newsletterSubscriber.count();
  res.json({ success: true, data: { count } });
});

export default router;
