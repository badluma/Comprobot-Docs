import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Comprobot",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "local",
      cdnCaching: true,
      typography: {
        header: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
        body: "SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif",
        code: "SF Mono, Menlo, Monaco, monospace",
      },
      colors: {
        lightMode: {
          light: "#FFFFFF", // Background
          lightgray: "#FFFFFF",
          gray: "#b8b8b8",
          darkgray: "#000000", // Theme button
          dark: "#000000", // Text
          secondary: "#000000", // Accents
          tertiary: "#000000",
          highlight: "#000000",
          textHighlight: "#000000",
        },
        darkMode: {
          light: "#000000", // Background
          lightgray: "#000000", // Search bar
          gray: "#646464",
          darkgray: "#FFFFFF", // Theme button
          dark: "#FFFFFF", // Text
          secondary: "#FFFFFF", // Accents
          tertiary: "#FFFFFF",
          highlight: "#FFFFFF",
          textHighlight: "#FFFFFF",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
