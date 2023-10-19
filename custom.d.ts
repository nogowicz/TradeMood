declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '@env' {
  export const YAHOO_FINANCE_API: string;
}
