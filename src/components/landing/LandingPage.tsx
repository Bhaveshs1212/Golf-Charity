"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import StatChip from "@/components/ui/StatChip";

const fadeSlide = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const heroStats = [
  { label: "Active Members", value: "2,418" },
  { label: "Monthly Pool", value: "$38,120" },
  { label: "Charities", value: "24" },
];

const howItWorks = [
  {
    title: "Subscribe & Choose",
    body: "Pick monthly or yearly access and select a charity to support.",
  },
  {
    title: "Log 5 Rolling Scores",
    body: "Enter scores 1–45 after each round. New score bumps the oldest.",
  },
  {
    title: "Monthly Draw",
    body: "Five numbers are drawn. Match tiers decide prize splits.",
  },
];

const prizeTiers = [
  { tier: "Jackpot", match: "5 matches", split: "40% pool" },
  { tier: "Tier 2", match: "4 matches", split: "35% pool" },
  { tier: "Tier 3", match: "3 matches", split: "25% pool" },
];

const charities = [
  "Coastal Water Relief",
  "Youth Sports Fund",
  "Green City Trees",
  "STEM Futures",
  "Community Wellness",
  "Food Rescue Network",
];

const pricing = [
  {
    title: "Monthly",
    price: "$9.99",
    detail: "Cancel anytime",
  },
  {
    title: "Yearly",
    price: "$99.99",
    detail: "2 months free",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen app-bg">
      <motion.main
        className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16"
        variants={fadeSlide}
        initial="hidden"
        animate="show"
      >
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <motion.h1
              className="text-[48px] font-extrabold tracking-tight text-text-primary lg:text-[64px]"
              variants={fadeSlide}
            >
              A charity-first subscription built for golfers who want impact.
            </motion.h1>
            <motion.p
              className="text-lg text-text-secondary"
              variants={fadeSlide}
            >
              Join monthly or yearly, log your last five scores, and compete in
              a monthly draw. Part of every fee goes directly to the charity you
              choose.
            </motion.p>
            <motion.div className="flex flex-wrap gap-4" variants={fadeSlide}>
              <Link className="btn btn-primary" href="/signup">
                Start membership
              </Link>
              <Link className="btn btn-secondary" href="/login">
                Sign in
              </Link>
              <a className="btn btn-secondary" href="#prize-tiers">
                See prize tiers
              </a>
            </motion.div>
            <motion.div
              className="grid gap-4 sm:grid-cols-3"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {heroStats.map((stat) => (
                <motion.div key={stat.label} variants={fadeSlide}>
                  <StatChip label={stat.label} value={stat.value} />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <Card className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-text-muted">
                Charity Split
              </p>
              <p className="text-4xl font-bold text-primary">10%</p>
              <p className="text-sm text-text-secondary">
                Default donation rate per subscription, adjustable by members.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-surface-2/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  Next Draw
                </p>
                <p className="text-2xl font-semibold">April 30, 8:00 PM</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[12, 19, 28, 33, 44].map((value) => (
                  <div
                    key={value}
                    className="flex h-12 items-center justify-center rounded-full border border-border/60 bg-surface-3/70 text-sm font-semibold"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <Section
          title="How it works"
          subtitle="Subscription gates the experience. Scores remain rolling at five entries. Every month ends with a published draw."
        >
          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {howItWorks.map((step) => (
              <motion.div key={step.title} variants={fadeSlide}>
                <Card className="h-full p-6">
                  <h3 className="text-[22px] font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm text-text-secondary">{step.body}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        <Section
          id="prize-tiers"
          title="Prize tiers"
          subtitle="Prize pool is split across tiers at publish time. No jackpot winners roll over into the next month."
        >
          <div className="grid gap-4 md:grid-cols-3">
            {prizeTiers.map((tier) => (
              <Card key={tier.tier} className="p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-text-muted">
                  {tier.tier}
                </p>
                <p className="mt-3 text-2xl font-semibold text-primary">
                  {tier.match}
                </p>
                <p className="mt-2 text-sm text-text-secondary">{tier.split}</p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Charities"
          subtitle="Members choose where a portion of their subscription is directed."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity) => (
              <Card key={charity} className="p-4">
                <p className="text-base font-medium text-text-primary">
                  {charity}
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  Verified partner
                </p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          title="Pricing"
          subtitle="All plans include score tracking, draw access, and charity giving."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {pricing.map((plan) => (
              <Card key={plan.title} className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[22px] font-semibold">{plan.title}</h3>
                  <span className="text-sm text-text-muted">{plan.detail}</span>
                </div>
                <p className="mt-4 text-4xl font-bold text-primary">
                  {plan.price}
                </p>
                <Link className="btn btn-primary mt-6 w-full" href="/signup">
                  Choose {plan.title}
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      </motion.main>
    </div>
  );
}
