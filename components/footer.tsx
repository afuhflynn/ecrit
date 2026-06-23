"use client";

import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-muted-foreground">
        © {currentYear} <span className="font-mono">{siteConfig.name}</span> All
        rights reserved.
      </p>

      <Button variant="ghost" size="icon" asChild>
        <Link href={siteConfig.links.github} target="_blank">
          <Icons.github className="size-4" />
        </Link>
      </Button>
    </div>
  );
};
