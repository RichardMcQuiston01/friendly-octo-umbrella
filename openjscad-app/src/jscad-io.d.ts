declare module '@jscad/io' {
  export const stlSerializer: {
    serialize: (options: { binary?: boolean }, geometry: any) => string;
  };
}