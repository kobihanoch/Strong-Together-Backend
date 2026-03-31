import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { createLogger } from '../config/logger.ts';

const logger = createLogger('middleware:bot-blocker');

export const botBlocker = (req: Request, res: Response, next: NextFunction): void => {
  const userAgent = req.headers['user-agent'];
  const appVersion = req.headers['x-app-version'];
  const acceptHeader = req.headers['accept'] || '';
  const path = req.path;

  if (appVersion) return next();
  if (
    path.includes('verify') ||
    path.includes('resetpassword') ||
    path.includes('daily') ||
    path.includes('changeemail')
  ) {
    return next();
  }

  if (!userAgent) return next(createError(404, 'Not found'));

  if (acceptHeader.includes('text/html') || acceptHeader.includes('application/xml')) {
    (req.logger || logger).warn(
      { event: 'bot_blocker.accept_header_blocked', acceptHeader, path },
      'Blocked suspicious accept header',
    );
    return next(createError(404, 'Not found'));
  }

  const suspiciousKeywords = [
    'curl',
    'wget',
    'python',
    'go-http-client',
    'zgrab',
    'masscan',
    'ahrefsbot',
    'semrushbot',
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
    suspiciousKeywords.some((keyword) => userAgent.toLowerCase().includes(keyword)) ||
    badPaths.some((bad) => bad.test(path));

  if (isSuspicious) {
    (req.logger || logger).warn(
      { event: 'bot_blocker.user_agent_blocked', userAgent, path },
      'Blocked suspicious user agent',
    );
    return next(createError(404, 'Not found'));
  }

  return next();
};
