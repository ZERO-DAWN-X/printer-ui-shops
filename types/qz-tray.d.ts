declare module "qz-tray" {
  type ConnectOptions = {
    retries?: number;
    delay?: number;
  };

  type ConfigOptions = {
    encoding?: string;
  };

  type QzConfig = Record<string, unknown>;

  type QzApi = {
    websocket: {
      connect: (options?: ConnectOptions) => Promise<void>;
      disconnect: () => Promise<void>;
      isActive: () => boolean;
    };
    printers: {
      find: (query?: string) => Promise<unknown>;
      getDefault: () => Promise<string>;
    };
    configs: {
      create: (printerName: string, options?: ConfigOptions) => QzConfig;
    };
    print: (config: QzConfig, data: string[]) => Promise<void>;
  };

  const qz: QzApi;
  export default qz;
}
