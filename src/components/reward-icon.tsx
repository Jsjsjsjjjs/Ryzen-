import { SiDiscord, SiRoblox, SiYoutube } from "react-icons/si";
import { useState } from "react";

interface RewardIconProps {
  name: string;
  size?: number;
}

const MINECRAFT_IMG = "https://minecraft.wiki/images/Grass_Block_JE7_BE6.png";

const ICON_MAP: Record<
  string,
  { type: "si"; icon: React.ElementType; color: string } | { type: "img"; src: string }
> = {
  "Nitro Basic Yearly":    { type: "si",  icon: SiDiscord, color: "#5865F2" },
  "Nitro Boost Yearly":    { type: "si",  icon: SiDiscord, color: "#ff73fa" },
  "Mcfa Permanent":        { type: "img", src: MINECRAFT_IMG },
  "Minecraft Redeem Code": { type: "img", src: MINECRAFT_IMG },
  "Roblox 50$ Giftcard":   { type: "si",  icon: SiRoblox,  color: "#e53e3e" },
  "Roblox 100$ Giftcard":  { type: "si",  icon: SiRoblox,  color: "#e53e3e" },
  "10k Yt Subscribers":    { type: "si",  icon: SiYoutube, color: "#ff0000" },
  "30k Yt Subscribers":    { type: "si",  icon: SiYoutube, color: "#ff0000" },
};

function MinecraftImg({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span style={{ fontSize: size * 0.75 }}>🟫</span>;
  return (
    <img
      src={MINECRAFT_IMG}
      alt="Minecraft"
      style={{ width: size, height: size }}
      className="object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export function RewardIcon({ name, size = 32 }: RewardIconProps) {
  const match = ICON_MAP[name];
  if (!match) return <span style={{ fontSize: size * 0.8 }}>🎁</span>;

  if (match.type === "si") {
    const Icon = match.icon;
    return (
      <Icon
        size={size}
        color={match.color}
        style={{ filter: `drop-shadow(0 0 6px ${match.color}88)` }}
      />
    );
  }

  return <MinecraftImg size={size} />;
}
