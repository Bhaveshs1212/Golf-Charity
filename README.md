Golf Charity Subscription Platform

Stack
- Next.js App Router
- Supabase
- Stripe
- Tailwind

Getting Started
- Install: npm install
- Dev server: npm run dev
- Build: npm run build
- Start: npm run start

Environment Variables
Copy .env.example to .env.local and fill in values.

Database
- Run supabase/schema.sql to create tables, RLS, and the rolling score trigger.
- Run supabase/seed.sql to insert charities and promote the admin account.

Stripe Webhooks (Local Dev)
- Stripe webhooks cannot reach localhost without forwarding.
- Use the Stripe CLI: stripe login, then stripe listen --forward-to http://localhost:3000/api/stripe/webhook
- Copy the signing secret into STRIPE_WEBHOOK_SECRET in .env.local

Deployment Notes
- Remove the dev-only subscription gate bypass in src/app/(dashboard)/layout.tsx before production.
- Update Stripe webhook endpoint in the Stripe dashboard to your live domain.

Test Credentials
- user@test.com / Test1234!
- admin@golfcharity.com / Admin1234!
