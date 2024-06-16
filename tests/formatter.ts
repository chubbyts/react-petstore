import prettier from '@prettier/sync';

export const formatHtml = (html: string) => {
  return prettier.format(html, { parser: 'html' });
};
