"use client";

import { Button } from "./ui/button";
import { Icons } from "./ui/icons";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex items-center justify-between w-full">
      <p className="text-sm text-muted-foreground">
        © {currentYear} <span className="font-mono">ecrit.</span> All rights
        reserved.
      </p>

      <Button variant="ghost" size="icon">
        <Icons.github />
      </Button>
    </div>
  );
};
