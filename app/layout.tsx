import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import React from "react";
import { Metadata } from "next";
import { theme } from "@/theme";

export const metadata: Metadata = {
  title: "Kesk-Vaela 8 kuluarvestus",
  description: "Korteri kulude arvestus",
  manifest: "/web.manifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
