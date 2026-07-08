"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState({
    primaryColor: "#FF2E93",
    secondaryColor: "#9333EA",
    bgColor: "#0B0B0F",
    cardColor: "#16161F",
    buttonColor: "#FF2E93",
    navColor: "#16161F",
    footerColor: "#0B0B0F",
    textColor: "#FFFFFF",
  });

  const applyTheme = useCallback((newTheme: typeof theme) => {
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", newTheme.primaryColor);
      root.style.setProperty("--color-secondary", newTheme.secondaryColor);
      root.style.setProperty("--color-bg", newTheme.bgColor);
      root.style.setProperty("--color-card", newTheme.cardColor);
      root.style.setProperty("--color-button", newTheme.buttonColor);
      root.style.setProperty("--color-nav", newTheme.navColor);
      root.style.setProperty("--color-footer", newTheme.footerColor);
      root.style.setProperty("--color-text", newTheme.textColor);
    }
  }, []);

  useEffect(() => {
    // 1. Initial Theme Load from Supabase settings
    const loadTheme = async () => {
      const { data } = await supabase
        .from("settings")
        .select("primary_color, secondary_color, bg_color, card_color, button_color, nav_color, footer_color, text_color")
        .eq("id", 1)
        .single();

      if (data) {
        applyTheme({
          primaryColor: data.primary_color || "#FF2E93",
          secondaryColor: data.secondary_color || "#9333EA",
          bgColor: data.bg_color || "#0B0B0F",
          cardColor: data.card_color || "#16161F",
          buttonColor: data.button_color || "#FF2E93",
          navColor: data.nav_color || "#16161F",
          footerColor: data.footer_color || "#0B0B0F",
          textColor: data.text_color || "#FFFFFF",
        });
      }
    };

    loadTheme();

    // 2. Subscribe to Supabase Realtime theme changes
    const channel = supabase
      .channel("public:settings-theme")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings", filter: "id=eq.1" },
        (payload) => {
          const newData = payload.new;
          setTheme((prev) => {
            const updated = {
              primaryColor: newData.primary_color || prev.primaryColor,
              secondaryColor: newData.secondary_color || prev.secondaryColor,
              bgColor: newData.bg_color || prev.bgColor,
              cardColor: newData.card_color || prev.cardColor,
              buttonColor: newData.button_color || prev.buttonColor,
              navColor: newData.nav_color || prev.navColor,
              footerColor: newData.footer_color || prev.footerColor,
              textColor: newData.text_color || prev.textColor,
            };
            if (typeof document !== "undefined") {
              const root = document.documentElement;
              root.style.setProperty("--color-primary", updated.primaryColor);
              root.style.setProperty("--color-secondary", updated.secondaryColor);
              root.style.setProperty("--color-bg", updated.bgColor);
              root.style.setProperty("--color-card", updated.cardColor);
              root.style.setProperty("--color-button", updated.buttonColor);
              root.style.setProperty("--color-nav", updated.navColor);
              root.style.setProperty("--color-footer", updated.footerColor);
              root.style.setProperty("--color-text", updated.textColor);
            }
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applyTheme]);

  return <>{children}</>;
}
