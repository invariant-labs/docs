/** @type {import('@docusaurus/types').DocusaurusConfig} */

const math = require("remark-math");
const katex = require("rehype-katex");

module.exports = {
  title: "Invariant Docs",
  tagline: "Comprehensive guide for using Invariant DEX.",
  url: "https://docs.invariant.app",
  baseUrl: "/",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-16x16.png",
  organizationName: "Invariant",
  projectName: "Invariant docs",

  themeConfig: {
    metadata: [
      {
        name: "description",
        content:
          "Invariant Docs: Comprehensive guide for using Invariant DEX - the most efficient tool for creating concentrated liquidity.",
      },
      {
        name: "keywords",
        content:
          "AMM DEX, concentrated liquidity, DeFi exchange, crypto trading, capital efficiency, risk management, decentralized finance, DeFi, liquidity pools, yield farming, blockchain",
      },
      { name: "author", content: "Invariant" },
      { name: "robots", content: "index, follow" },
      {
        httpEquiv: "Cache-Control",
        content: "no-cache, no-store, must-revalidate",
      },
      { httpEquiv: "X-UA-Compatible", content: "IE=edge" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://docs.invariant.app/" },
      {
        property: "og:title",
        content: "Invariant Docs - Your Guide to Invariant DEX",
      },
      {
        property: "og:description",
        content:
          "Learn how to use Invariant's AMM DEX with our comprehensive documentation. Dive into advanced DeFi tools and maximize efficiency.",
      },
      {
        property: "og:image",
        content: "https://docs.invariant.app/img/logo.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: "https://docs.invariant.app/" },
      {
        name: "twitter:title",
        content:
          "Invariant Docs - Comprehensive Guide for Invariant DEX",
      },
      {
        name: "twitter:description",
        content:
          "Explore Invariant's features and learn how to leverage its concentrated liquidity for optimal DeFi strategies.",
      },
      {
        name: "twitter:image",
        content: "https://docs.invariant.app/img/logo.png",
      },
      { name: "twitter:creator", content: "@invariant_labs" },
    ],
    headTags: [
      {
        tagName: "script",
        attributes: { type: "application/ld+json" },
        innerHTML: `
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Invariant Docs",
          "url": "https://docs.invariant.app/",
          "description": "Comprehensive documentation for Invariant DEX.",
          "publisher": {
            "@type": "Organization",
            "name": "Invariant",
            "logo": "https://docs.invariant.app/img/logo.png"
          }
        }
        `,
      },
      {
        tagName: "link",
        attributes: { rel: "canonical", href: "https://docs.invariant.app/" },
      },
    ],
    navbar: {
      title: "Invariant",
      logo: {
        alt: "Invariant Logo",
        src: "img/logo.png",
      },
      items: [
        { to: "/docs/solana/introduction", label: "Solana", position: "left" },
        { to: "/docs/eclipse/get_started", label: "Eclipse", position: "left" },
        {
          to: "/docs/aleph_zero/get_started",
          label: "Aleph Zero",
          position: "left",
        },
        // { to: '/docs/casper/installation', label: 'Casper Network', position: 'left' },
        { to: "/docs/vara/get_started", label: "VARA", position: "left" },
        {
          to: "/docs/alephium/installation",
          label: "Alephium",
          position: "left",
        },
        {
          html: '<i class="fa-solid fa-x icon-x"></i>',
          href: "https://x.com/invariant_labs",
          position: "right",
        },
        {
          html: '<i class="fab fa-github fa-lg icon-github"></i>',
          href: "https://github.com/invariant-labs",
          position: "right",
        },
        {
          html: '<i class="fab fa-discord icon-discord"></i>',
          href: "https://discord.com/invite/w6hTeWTJvG",
          position: "right",
        },
        {
          html: '<i class="fab fa-youtube icon-youtube"></i>',
          href: "https://www.youtube.com/@invariant_labs",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Home",
              to: "/docs/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/w6hTeWTJvG",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/invariant_labs",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/invariant-labs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Invariant | Built with Docusaurus.`,
    },
    prism: {
      theme: require("prism-react-renderer/themes/vsDark"),
      additionalLanguages: ["rust"],
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          remarkPlugins: [math],
          rehypePlugins: [katex],
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://invariant.app/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html"],
        toExtensions: ["html"],
        redirects: [
          {
            from: "/docs/aleph_zero/",
            to: "/docs/aleph_zero/installation",
          },
          {
            from: "/docs/alephium/",
            to: "/docs/alephium/installation",
          },
          {
            from: "/docs/solana/",
            to: "/docs/solana/introduction",
          },
          {
            from: "/docs/eclipse/",
            to: "/docs/eclipse/introduction",
          },
          // {
          //   from: '/docs/casper/',
          //   to: '/docs/casper/installation'
          // },
          {
            from: "/docs/vara/",
            to: "/docs/vara/installation",
          },
        ],
        createRedirects(existingPath) {
          if (existingPath === "/docs/aleph_zero/") {
            return "/docs/aleph_zero/installation";
          }
          if (existingPath === "/docs/alephium/") {
            return "/docs/alephium/installation";
          }
          if (existingPath === "/docs/solana/") {
            return "/docs/solana/introduction";
          }
          // if (existingPath === '/docs/casper/') {
          //   return '/docs/casper/installation'
          // }
          if (existingPath === "/docs/eclipse/") {
            return "/docs/eclipse/introduction";
          }
          if (existingPath === "/docs/vara/") {
            return "/docs/vara/installation";
          }
          // Path does not require a redirect.
          return undefined;
        },
      },
    ],
  ],
};
