---
name: Gaggenau (current state)
description: Restrained luxury appliance brand — warm-white canvas, black type, uppercase Gaggenau Display headings, orange-red hover accent.
colors:
  canvas: "#fbf6f4"
  ink: "#000000"
  charcoal: "#171412"
  accent: "#d73200"
  stone: "#7f7b79"
  rule: "#bbb7b5"
typography:
  display:
    fontFamily: "Gaggenau Display, GaggenauDisplay, Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 400
    textTransform: uppercase
  display-bold:
    fontFamily: "Gaggenau Display, GaggenauDisplay, Arial, sans-serif"
    fontSize: "48px"
    fontWeight: 700
  body:
    fontFamily: "Gaggenau Text, GaggenauText, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
rounded:
  card: "30px"
  pill: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  link-hover:
    textColor: "{colors.accent}"
---
<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-10-16T11:40:37Z sources=stardust/current/_computed-styles.json,stardust/current/assets/css -->

## Overview

Two front-end stacks share one brand: the German marketing home (/de/de, a Next.js "marketing-app") and the store templates (global region selector, energy-label selector, imprint, data-protection, newsletter confirmation, missing-page notice). Both render on a warm off-white canvas (#fbf6f4) with black text and the proprietary Gaggenau Display / Gaggenau Text faces.

## Colors

Canvas #fbf6f4 everywhere; ink #000; charcoal #171412 for buttons and dark bands; accent #d73200 appears only as a hover state on links and buttons; stone #7f7b79 and rule #bbb7b5 for secondary text and dividers.

## Typography

Headings in Gaggenau Display, uppercase on page titles (store h1 48px/700 on legal pages; 38px/400 h2 on the region selector "Wherever you are, a Gaggenau awaits"). Body 16px Gaggenau Text.

## Layout

Store templates: centered container with a logo-only header and a footer of social icons between horizontal rules, then Imprint / Legal links. Marketing home: full-bleed hero, mega-nav header, teaser grids and image bands. Container model: DESIGN.json extensions.breakpoints (cap-probe).

## Shapes

Square imagery; pill (9999px) controls; 30px radius on a few marketing-app elements.

## Components

Region accordion (plus icon + region name, bottom rule); teaser cards (image, title, CTA); dark footer link columns on the marketing home.

## Do's and Don'ts

Do keep the canvas warm-white and the accent hover-only. Don't add gradients, shadows or rounded cards that the source does not use.
