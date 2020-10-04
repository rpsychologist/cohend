module.exports = {
  siteMetadata: {
    title: `Understanding Cohen's d`,
    description: `A tool to understand Cohen's d standardized effect size`,
    author: `Kristoffer Magnusson`,
    twitter: `@krstoffr`,
    version: '2.3.0',
    lastUpdated: `2020-10-04`,
    github: 'https://github.com/rpsychologist/cohend',
    url: 'https://rpsychologist.com/d3/cohend/'
  },
  pathPrefix: `/d3/cohend`,
  plugins: [
    `gatsby-plugin-material-ui`,
    `gatsby-transformer-remark`,
    `gatsby-transformer-yaml`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          `gatsby-remark-images`,
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              aliases: {},
              copy: true,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`,
              output: `html`,
            },
          },
        ],
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-47065595-1",
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/content/`
      }
    },
    {
      resolve: 'gatsby-plugin-zopfli',
      options: {
        extensions: ['css', 'html', 'js', 'svg', 'json']
      }
    },
    {
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: "Interpreting Cohen's d",
      short_name: "Cohend",
      start_url: "https://rpsychologist.com/d3/cohend/",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      display: "standalone",
      icon: "src/assets/cohend-icon.png", 
    },
  },
  'gatsby-plugin-offline',
  ]
};
