/*
 * Codle deployment settings. Both values are public (safe to ship to browsers).
 *
 * googleClientId : OAuth 2.0 "Web application" client ID from Google Cloud
 *                  Console -> APIs & Services -> Credentials. Add your site's
 *                  origin (e.g. https://codle.example.com) to "Authorized
 *                  JavaScript origins". Leave empty to fall back to a local
 *                  profile (or set GOOGLE_CLIENT_ID on the server: /api/config
 *                  fills it in at load time).
 * raukeEndpoint  : the server function that talks to Claude (api/rauke.js).
 */
window.CODLE_CONFIG = {
  googleClientId: "",
  raukeEndpoint: "/api/rauke",
  configEndpoint: "/api/config",
};
