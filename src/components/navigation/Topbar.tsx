import Link from "next/link";

import { signOutAction } from "@/app/actions/auth-actions";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 bg-surface-1/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="text-sm text-text-muted">Welcome back</p>
        <h1 className="text-[28px] font-semibold">Your impact summary</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link className="btn btn-secondary" href="/draw">
          View draw
        </Link>
        <Link className="btn btn-primary" href="/scores">
          Update scores
        </Link>
        <form action={signOutAction}>
          <button className="btn btn-secondary" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
