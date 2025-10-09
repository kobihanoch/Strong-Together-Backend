import createError from "http-errors";

export const botBlocker = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const appVersion = req.headers["x-app-version"];
  const acceptHeader = req.headers["accept"] || "";
  const path = req.path;

  // If sent from app continue
  if (appVersion) return next();
  if (path.includes("verify") || path.includes("resetpassword")) return next();

  // Try to catch null user agent
  if (!userAgent) return next(createError(404, "Not found"));

  // Accept header
  if (
    acceptHeader.includes("text/html") ||
    acceptHeader.includes("application/xml")
  ) {
    console.warn(`[BOT ALERT] Suspicious accept header: ${acceptHeader}`);
    return next(createError(404, "Not found"));
  }

  const suspiciousKeywords = [
    "curl",
    "wget",
    "python",
    "go-http-client",
    "zgrab",
    "masscan",
    "ahrefsbot",
    "semrushbot",
  ];

  const badPaths = [
    /^\/\.env$/,
    /^\/\.git\//,
    /^\/@vite\/env$/,
    /^\/actuator\//,
    /^\/v2\/_catalog$/,
    /^\/ecp\//,
    /^\/_all_dbs$/,
    /^\/telescope\//,
    /^\/debug\//,
    /^\/info\.php$/,
    /^\/\.vscode\//,
    /^\/\.DS_Store$/,
    /^\/config\.json$/,
    /^\/admin\/|^\/wp-admin\//,
    /^\/phpmyadmin\//,
    /^\/shell\//,
    /^\/jmx-console\//,
    /^\/owa\//,
    /favicon\.ico$/,
    /\/(sell|robot|wordpress)\//i,
    /wp-login\.php$/,
    /\.well-known\//,
    /\%20select\%20/i,
    /etc\/passwd/i,
  ];

  const isSuspicious =
    suspiciousKeywords.some((keyword) =>
      userAgent.toLowerCase().includes(keyword)
    ) || badPaths.some((bad) => bad.test(path));

  if (isSuspicious) {
    console.warn(`[BOT ALERT] Blocked suspicious UA: ${userAgent}`);
    return next(createError(404, "Not found"));
  }

  return next();
};
