import { Layout } from "@/components/layout";
import { useListRewards } from "@/lib/mock-api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { REWARD_BG_COLORS } from "@/lib/reward-images";
import { RewardIcon } from "@/components/reward-icon";

export default function Rewards() {
  const { data: rewards, isLoading } = useListRewards();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Rewards Catalog</h1>
          <p className="text-muted-foreground text-lg">
            Invite friends to unlock exclusive rewards — from Discord Nitro to Minecraft, Roblox, and YouTube growth.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-48 rounded-xl bg-card border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards?.map((reward) => (
              <div
                key={reward.id}
                data-testid={`card-reward-${reward.id}`}
                className={`relative rounded-xl border border-white/10 bg-gradient-to-br ${REWARD_BG_COLORS[reward.name] ?? "from-primary/10 to-primary/5"} p-6 hover:border-white/20 transition-all group hover:scale-[1.02] hover:shadow-xl cursor-default overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-14 w-14 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <RewardIcon name={reward.name} size={34} />
                    </div>
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/40 text-white border border-white/15">
                      <Users className="w-3 h-3 mr-1" />
                      {reward.invitesRequired} Invites
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-white/90">{reward.name}</h3>
                  <p className="text-sm text-white/60">
                    {reward.description || `Earn ${reward.invitesRequired} invites to claim this reward.`}
                  </p>
                </div>
              </div>
            ))}
            
            {rewards?.length === 0 && (
              <div className="col-span-full text-center py-24 text-muted-foreground">
                <p>No rewards available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
