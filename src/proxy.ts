import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Laisse passer les fichiers statiques, les assets Next et les routes API :
  // seules les pages ont besoin de la négociation de langue.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
