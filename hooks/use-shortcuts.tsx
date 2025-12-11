"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import useModal from "./use-modal";
import { authClient } from "@/lib/auth-client";
import type { ModalTypes, Notes } from "@/lib/types";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/lib/keys";

type BaseShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  label: string;
  requiresAuth?: boolean;
  requiresNote?: boolean;
};

type ModalShortcut = BaseShortcut & {
  type: "modal";
  modal: ModalTypes;
  requiresAuth: boolean;
};

type ActionShortcut = BaseShortcut & {
  type: "action";
  action: () => void;
};

export type Shortcut = ModalShortcut | ActionShortcut;

const triggerButtonActive = (shortcutType: string) => {
  const button = document.querySelector(`[data-shortcut="${shortcutType}"]`);
  if (!button) return;

  button.classList.add("shortcut-active");
  setTimeout(() => {
    button.classList.remove("shortcut-active");
  }, 150);
};

export const SHORTCUTS: Shortcut[] = [
  {
    key: "n",
    ctrl: true,
    alt: true,
    type: "modal",
    modal: "create-note",
    requiresAuth: true,
    label: "New Note",
  },
  {
    key: "k",
    ctrl: true,
    type: "modal",
    modal: "search",
    requiresAuth: true,
    label: "Search",
  },
  {
    key: "p",
    ctrl: true,
    shift: true,
    type: "modal",
    modal: "settings",
    requiresAuth: true,
    label: "Settings",
  },
  {
    key: "d",
    ctrl: true,
    shift: true,
    type: "modal",
    modal: "delete-note",
    requiresAuth: true,
    requiresNote: true,
    label: "Delete Note",
  },
  {
    key: "s",
    ctrl: true,
    shift: true,
    type: "modal",
    modal: "share-note",
    requiresAuth: true,
    requiresNote: true,
    label: "Share Note",
  },
] as const;

export const formatShortcut = (shortcut: Shortcut): string => {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push("Ctrl");
  if (shortcut.alt) parts.push("Alt");
  if (shortcut.shift) parts.push("Shift");
  parts.push(shortcut.key.toUpperCase());
  return parts.join("+");
};

const matchShortcut = (e: KeyboardEvent, shortcut: Shortcut): boolean => {
  const ctrlMatch = shortcut.ctrl
    ? e.ctrlKey || e.metaKey
    : !e.ctrlKey && !e.metaKey;
  const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
  const altMatch = shortcut.alt ? e.altKey : !e.altKey;
  const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

  return ctrlMatch && shiftMatch && altMatch && keyMatch;
};

export const useShortcuts = () => {
  const onOpen = useModal((state) => state.onOpen);
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      if (isTyping && !hasModifier) return;

      for (const shortcut of SHORTCUTS) {
        if (matchShortcut(e, shortcut)) {
          e.preventDefault();
          e.stopPropagation();

          if (shortcut.type === "action") {
            triggerButtonActive(
              shortcut.label.toLowerCase().replace(/\s+/g, "-")
            );
            shortcut.action();
            return;
          }

          triggerButtonActive(shortcut.modal);

          if (shortcut.requiresAuth && !session?.user) {
            toast.error("Please login to perform this action");
            return;
          }

          if (shortcut.requiresNote) {
            const slugMatch = pathname.match(/^\/n\/([^/]+)$/);
            if (!slugMatch) {
              toast.error("Please open a note first");
              return;
            }
            const slug = slugMatch[1];
            const noteData = queryClient.getQueryData<Notes>([
              KEYS.NOTES,
              slug,
            ]);
            if (!noteData) {
              toast.error("Note data not available");
              return;
            }
            onOpen(shortcut.modal, noteData);
            return;
          }

          onOpen(shortcut.modal);
          return;
        }
      }
    },
    [session, onOpen, pathname, queryClient]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [handleKeyDown]);
};
