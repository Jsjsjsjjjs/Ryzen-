// Local mock/dummy implementation replacing the missing "@workspace/api-client-react"
// workspace package. Replace these with real API calls / TanStack Query hooks
// when your backend (Discord bot API) is ready.

import { useQuery, useMutation, type UseMutationResult } from "@tanstack/react-query";

export type Reward = {
  id: number;
  name: string;
  emoji: string;
  description?: string;
  invitesRequired: number;
};

export type Code = {
  id: number;
  code: string;
  categoryId: number;
  categoryName: string;
  claimed: boolean;
  claimedBy?: string | null;
  createdAt: string;
};

export type Admin = {
  id: number;
  discordId: string;
  username?: string;
  addedAt: string;
};

export type Stats = {
  totalCodes: number;
  claimedCodes: number;
  availableCodes: number;
  totalAdmins: number;
};

export type ClaimResult = {
  categoryName: string;
  code: string;
};

// ---- Mock data (replace with real API responses) ----

const MOCK_REWARDS: Reward[] = [
  { id: 1, name: "Nitro Basic Yearly", emoji: "💎", description: "1 year of Discord Nitro Basic.", invitesRequired: 5 },
  { id: 2, name: "Nitro Boost Yearly", emoji: "🚀", description: "1 year of Discord Nitro Boost.", invitesRequired: 15 },
  { id: 3, name: "Minecraft Redeem Code", emoji: "⛏️", description: "Minecraft Java Edition redeem code.", invitesRequired: 25 },
  { id: 4, name: "Roblox 50$ Giftcard", emoji: "🎮", description: "$50 Roblox gift card.", invitesRequired: 40 },
];

const MOCK_CODES: Code[] = [
  { id: 1, code: "NITRO-AAAA-BBBB", categoryId: 1, categoryName: "Nitro Basic Yearly", claimed: false, claimedBy: null, createdAt: new Date().toISOString() },
  { id: 2, code: "BOOST-CCCC-DDDD", categoryId: 2, categoryName: "Nitro Boost Yearly", claimed: true, claimedBy: "someuser", createdAt: new Date().toISOString() },
];

const MOCK_ADMINS: Admin[] = [
  { id: 1, discordId: "123456789012345678", username: "owner", addedAt: new Date().toISOString() },
];

// ---- Query key helpers (kept for parity with the original API) ----

export const getGetStatsQueryKey = () => ["stats"] as const;
export const getListCodesQueryKey = () => ["codes"] as const;
export const getListAdminsQueryKey = () => ["admins"] as const;
export const getListRewardsQueryKey = () => ["rewards"] as const;

// ---- Queries ----

export function useGetStats(_opts?: { query?: { queryKey?: unknown } }) {
  return useQuery({
    queryKey: getGetStatsQueryKey(),
    queryFn: async (): Promise<Stats> => ({
      totalCodes: MOCK_CODES.length,
      claimedCodes: MOCK_CODES.filter((c) => c.claimed).length,
      availableCodes: MOCK_CODES.filter((c) => !c.claimed).length,
      totalAdmins: MOCK_ADMINS.length,
    }),
  });
}

export function useListCodes() {
  return useQuery({
    queryKey: getListCodesQueryKey(),
    queryFn: async (): Promise<Code[]> => MOCK_CODES,
  });
}

export function useListAdmins() {
  return useQuery({
    queryKey: getListAdminsQueryKey(),
    queryFn: async (): Promise<Admin[]> => MOCK_ADMINS,
  });
}

export function useListRewards() {
  return useQuery({
    queryKey: getListRewardsQueryKey(),
    queryFn: async (): Promise<Reward[]> => MOCK_REWARDS,
  });
}

// ---- Mutations ----

export function useCreateCode(): UseMutationResult<Code, Error, { data: { code: string; categoryId: number } }> {
  return useMutation({
    mutationFn: async ({ data }) => {
      const category = MOCK_REWARDS.find((r) => r.id === data.categoryId);
      const newCode: Code = {
        id: Date.now(),
        code: data.code,
        categoryId: data.categoryId,
        categoryName: category?.name ?? "Unknown",
        claimed: false,
        claimedBy: null,
        createdAt: new Date().toISOString(),
      };
      return newCode;
    },
  });
}

export function useDeleteCode(): UseMutationResult<void, Error, { id: number }> {
  return useMutation({
    mutationFn: async (_vars) => {
      return;
    },
  });
}

export function useAddAdmin(): UseMutationResult<Admin, Error, { data: { discordId: string; username?: string } }> {
  return useMutation({
    mutationFn: async ({ data }) => {
      const newAdmin: Admin = {
        id: Date.now(),
        discordId: data.discordId,
        username: data.username,
        addedAt: new Date().toISOString(),
      };
      return newAdmin;
    },
  });
}

export function useRemoveAdmin(): UseMutationResult<void, Error, { discordId: string }> {
  return useMutation({
    mutationFn: async (_vars) => {
      return;
    },
  });
}

// ---- ASLI CLAIM LOGIC (FIXED BRACKETS) ----

export function useClaimCode() {
  return useMutation({
    mutationFn: async ({ data }: { data: { code: string; discordId?: string } }) => {
      // Vercel proxy rewrite use karega browser mix-content block hatane ke liye
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: data.code, discordId: data.discordId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Invalid or already claimed code.');
      }

      return json as { categoryName: string; code: string };
    },
  });
  }
  
