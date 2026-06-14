import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { ArrowRight, Trophy, Zap, Clock, Ticket, Users } from "lucide-react";
import { REWARD_BG_COLORS } from "@/lib/reward-images";
import { RewardIcon } from "@/components/reward-icon";

const REWARD_TIERS = [
  { name: "Nitro Basic Yearly", invitesRequired: 2, emoji: "🔵" },
  { name: "Nitro Boost Yearly", invitesRequired: 4, emoji: "🔵" },
  { name: "Mcfa Permanent", invitesRequired: 2, emoji: "🟫" },
  { name: "Minecraft Redeem Code", invitesRequired: 4, emoji: "🟫" },
  { name: "Roblox 50$ Giftcard", invitesRequired: 2, emoji: "🟡" },
  { name: "Roblox 100$ Giftcard", invitesRequired: 4, emoji: "🟡" },
  { name: "10k Yt Subscribers", invitesRequired: 2, emoji: "🔴" },
  { name: "30k Yt Subscribers", invitesRequired: 4, emoji: "🔴" },
];

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            <Clock className="mr-2 h-4 w-4" />
            LIMITED TIME EVENT until May 28, 2026
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
            Claim Your <span className="text-primary drop-shadow-[0_0_15px_rgba(88,101,242,0.5)]">Exclusive</span> Rewards
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Welcome to the elite tier of Discord rewards. Invite your friends, earn invites, and unlock premium gaming subscriptions and gift cards.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/claim" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow-[0_0_20px_-5px_rgba(88,101,242,0.6)] hover:bg-primary/90 h-12 px-8 py-2">
              Redeem Code <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/rewards" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-white/10 bg-transparent hover:bg-white/5 h-12 px-8 py-2">
              View All Rewards
            </Link>
          </div>
        </div>

        {/* Quick Claim */}
        <div className="mt-24 max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Claim</h2>
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => { e.preventDefault(); const code = (e.target as any).elements.code.value; if (code) window.location.href = `/claim?code=${code}`; }}>
              <input 
                name="code"
                placeholder="Enter Reward Code" 
                className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
                data-testid="input-quick-claim"
                required
              />
              <button 
                type="submit"
                data-testid="button-quick-redeem"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow-[0_0_15px_-3px_rgba(88,101,242,0.5)] hover:bg-primary/90 h-12 px-8 py-2 shrink-0"
              >
                Redeem
              </button>
            </form>
          </div>
        </div>

        {/* Reward Tiers with Images */}
        <div className="mt-32 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Reward Tiers</h2>
          <p className="text-muted-foreground mb-12">Invite more to unlock bigger rewards</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REWARD_TIERS.map((reward) => (
              <div
                key={reward.name}
                data-testid={`tier-${reward.name.replace(/\s+/g, "-").toLowerCase()}`}
                className={`relative rounded-xl border border-white/10 bg-gradient-to-br ${REWARD_BG_COLORS[reward.name] ?? "from-primary/10 to-primary/5"} p-5 text-left overflow-hidden group hover:border-white/20 hover:scale-[1.02] transition-all`}
              >
                <div className="absolute inset-0 bg-black/25 backdrop-blur-sm rounded-xl" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-12 w-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RewardIcon name={reward.name} size={26} />
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/15 text-xs font-semibold text-white">
                      <Users className="w-3 h-3" />
                      {reward.invitesRequired}
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-tight">{reward.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{reward.invitesRequired} invites needed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Claim */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold text-center mb-12">How to Claim</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative p-6 rounded-2xl border border-white/5 bg-card/50 backdrop-blur hover:bg-card transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Invite Friends</h3>
              <p className="text-muted-foreground">Use your Discord invite link and get people to join. Type <code className="bg-white/5 px-1 rounded text-primary">-i</code> in Discord to check your invite count.</p>
            </div>
            <div className="relative p-6 rounded-2xl border border-white/5 bg-card/50 backdrop-blur hover:bg-card transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Pick a Reward</h3>
              <p className="text-muted-foreground">Once you hit the required invites, the bot will show eligible rewards. Pick one and then do <code className="bg-white/5 px-1 rounded text-primary">-rmi</code>.</p>
            </div>
            <div className="relative p-6 rounded-2xl border border-white/5 bg-card/50 backdrop-blur hover:bg-card transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Get Your Code</h3>
              <p className="text-muted-foreground">Staff verifies and DMs you the code. Redeem it right here on this website using the code you receive.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
