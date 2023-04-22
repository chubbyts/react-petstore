import { format } from 'prettier';

export const formatHtml = (html: string) => {
  return format(html, { parser: 'html' });
};
