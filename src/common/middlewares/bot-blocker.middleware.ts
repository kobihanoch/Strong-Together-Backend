import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../infrastructure/logger.ts';
import { markSentryBotBlocked } from '../../infrastructure/sentry.ts';

@Injectable()
export class BotBlockerMiddleware implements NestMiddleware {
  private readonly logger = createLogger('middleware:bot-blocker');

  use(req: Request, res: Response, next: NextFunction) {
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

    if (!userAgent) {
      markSentryBotBlocked('missing_user_agent');
      throw new NotFoundException('Not found');
    }

    if (acceptHeader.includes('text/html') || acceptHeader.includes('application/xml')) {
      markSentryBotBlocked('suspicious_accept_header');
      (req.logger || this.logger).warn(
        { event: 'bot_blocker.accept_header_blocked', acceptHeader, path },
        'Blocked suspicious accept header',
      );
      throw new NotFoundException('Not found');
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
      markSentryBotBlocked('suspicious_user_agent_or_path');
      (req.logger || this.logger).warn(
        { event: 'bot_blocker.user_agent_blocked', userAgent, path },
        'Blocked suspicious user agent',
      );
      throw new NotFoundException('Not found');
    }

    next();
  }
}
