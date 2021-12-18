export interface Config {
  entryPoint?: string;
  publicDirectory?: string;
  target?: string[];
  devServerPort?: number;
  liveReload?: boolean;
  showDevUpdates?: boolean;
}
