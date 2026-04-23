import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['fr', 'en'];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  console.log('--- getRequestConfig for locale ---', locale);
  
  if (!locale || !locales.includes(locale as any)) {
    console.log('--- locale not found or invalid, using default fr ---');
    // We can either trigger notFound() or fallback to a default
    // For development, fallback to fr to avoid 404s if middleware is still warming up
    return {
      locale: 'fr',
      messages: (await import(`../messages/fr.json`)).default
    };
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
