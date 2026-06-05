/**
 * useSiteConfig - Detect which site is being served based on hostname
 * Allows a single codebase to serve multiple e-commerce sites with different content
 */

export type SiteType = 'cards' | 'baskets' | 'printmail' | 'default';

export interface SiteConfig {
  site: SiteType;
  name: string;
  showCardShowcase: boolean;
  showBasketShowcase: boolean;
  showPrintShowcase: boolean;
}

export function useSiteConfig(): SiteConfig {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Determine site based on hostname
  if (
    hostname.includes('card') ||
    hostname.includes('longislandcard') ||
    hostname.includes('longislandcards')
  ) {
    return {
      site: 'cards',
      name: 'Long Island Cards',
      showCardShowcase: true,
      showBasketShowcase: false,
      showPrintShowcase: false,
    };
  }

  if (
    hostname.includes('basket') ||
    hostname.includes('gift') ||
    hostname.includes('ligiftbasket')
  ) {
    return {
      site: 'baskets',
      name: 'Long Island Gift Baskets',
      showCardShowcase: false,
      showBasketShowcase: true,
      showPrintShowcase: false,
    };
  }

  if (
    hostname.includes('print') ||
    hostname.includes('mail') ||
    hostname.includes('printandmail') ||
    hostname.includes('printmail')
  ) {
    return {
      site: 'printmail',
      name: 'Long Island Print and Mail',
      showCardShowcase: false,
      showBasketShowcase: false,
      showPrintShowcase: true,
    };
  }

  if (hostname.includes('convenience') || hostname.includes('convenienc')) {
    return {
      site: 'default',
      name: 'Long Island Convenience',
      showCardShowcase: false,
      showBasketShowcase: false,
      showPrintShowcase: false,
    };
  }

  // Default/fallback for localhost development
  return {
    site: 'default',
    name: 'Long Island Print and Mail',
    showCardShowcase: true,
    showBasketShowcase: false,
    showPrintShowcase: true,
  };
}
