export type UserRole = "user" | "admin";

export type SubscriptionStatus = "active" | "inactive" | "past_due" | "canceled";

export type DrawStatus = "draft" | "published";

export type DrawType = "random" | "algorithmic";

export type WinnerStatus = "pending" | "verified" | "paid";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_plan: "monthly" | "yearly";
  charity_id: string | null;
  donation_percentage: number;
  created_at: string;
}

export interface Score {
  id: string;
  user_id: string;
  value: number;
  created_at: string;
}

export interface Draw {
  id: string;
  month: string;
  numbers: number[];
  status: DrawStatus;
  draw_type: DrawType;
  published_at: string | null;
  rollover_amount: number;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface Winner {
  id: string;
  user_id: string;
  draw_id: string;
  matches: number;
  prize_amount: number;
  status: WinnerStatus;
  proof_url: string | null;
}
