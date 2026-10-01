<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:variable name="pages" select="sm:urlset/sm:url[not(contains(sm:loc, '/posts/'))]" />
  <xsl:variable name="posts" select="sm:urlset/sm:url[contains(sm:loc, '/posts/')]" />

  <xsl:template match="/">
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, follow" />
        <title>Sitemap</title>
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            background: #fff;
            color: #333;
            font: 500 16px/1.5 "Open Sans", ui-sans-serif, system-ui, sans-serif;
          }
          main { max-width: 960px; margin: 0 auto; padding: 48px 20px 80px; }
          h1, h2 {
            font-family: "Roboto Condensed", "Open Sans Condensed", "Arial Narrow", sans-serif;
            font-weight: 700;
            text-transform: uppercase;
            margin: 0;
          }
          h1 { font-size: 40px; line-height: 48px; }
          h2 { font-size: 28px; line-height: 36px; color: #c19979; margin-top: 48px; }
          .lead { margin: 12px 0 0; }
          .lead a { color: inherit; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { text-align: left; padding: 12px 8px; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
          th { font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; color: #777; }
          td.date { white-space: nowrap; width: 1%; color: #777; }
          a { color: #333; text-decoration: none; word-break: break-word; }
          a:hover, a:focus-visible { color: #c19979; text-decoration: underline; }
          .count { color: #777; font-weight: 500; font-size: 16px; text-transform: none; }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p class="lead">
            <xsl:value-of select="count(sm:urlset/sm:url)" /> URLs.
            Diese XML-Sitemap ist für Suchmaschinen bestimmt
            (<a href="https://www.sitemaps.org/">sitemaps.org</a>).
          </p>

          <xsl:if test="$pages">
            <h2>Seiten <span class="count">(<xsl:value-of select="count($pages)" />)</span></h2>
            <xsl:call-template name="table">
              <xsl:with-param name="urls" select="$pages" />
            </xsl:call-template>
          </xsl:if>

          <xsl:if test="$posts">
            <h2>Blog <span class="count">(<xsl:value-of select="count($posts)" />)</span></h2>
            <xsl:call-template name="table">
              <xsl:with-param name="urls" select="$posts" />
            </xsl:call-template>
          </xsl:if>
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="table">
    <xsl:param name="urls" />
    <table>
      <thead>
        <tr><th>URL</th><th>Geändert</th></tr>
      </thead>
      <tbody>
        <xsl:for-each select="$urls">
          <xsl:variable name="path" select="concat('/', substring-after(substring-after(sm:loc, '://'), '/'))" />
          <tr>
            <td><a href="{sm:loc}"><xsl:value-of select="$path" /></a></td>
            <td class="date">
              <xsl:if test="sm:lastmod">
                <xsl:value-of select="concat(substring(sm:lastmod, 9, 2), '.', substring(sm:lastmod, 6, 2), '.', substring(sm:lastmod, 1, 4))" />
              </xsl:if>
            </td>
          </tr>
        </xsl:for-each>
      </tbody>
    </table>
  </xsl:template>
</xsl:stylesheet>
