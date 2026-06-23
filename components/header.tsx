import { siteConfig } from "@/lib/site";
import { UserButton } from "./user-button";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="flex items-center justify-between w-full sticky top-0 bg-background p-2 z-10">
      <Link href={"/n"}>
        <h1 className="text-2xl font-bold font-mono">{siteConfig.name}</h1>
      </Link>
      <UserButton />
    </div>
  );
};
