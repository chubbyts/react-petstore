import type { FC } from 'react';

export const Table: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div {...props} className={`block w-full md:table ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div {...props} className={`block w-full md:table-header-group ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Tbody: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div {...props} className={`block w-full md:table-row-group ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Tr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div {...props} className={`mb-5 block even:bg-gray-100 md:mt-0 md:table-row ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
};

export const Th: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div
      {...props}
      className={`block border-x border-gray-300 bg-gray-100 px-4 font-bold first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-y md:px-4 md:py-3 md:first:border-l md:last:border-r ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </div>
  );
};

export const Td: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return (
    <div
      {...props}
      className={`block border-x border-gray-300 px-4 first:border-t first:pt-3 last:border-b last:pb-3 md:table-cell md:border-x-0 md:border-b md:px-4 md:py-3 md:first:border-l md:first:border-t-0 md:last:border-r ${
        props.className ?? ''
      }`}
    >
      {props.children}
    </div>
  );
};
