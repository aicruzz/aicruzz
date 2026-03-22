// This declaration tells TypeScript to resolve '@aicruzz/types'
// from the local types file until npm workspaces are configured.
declare module '@aicruzz/types' {
  export * from './aicruzz';
}
