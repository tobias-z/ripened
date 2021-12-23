class Config {
  private static _instance: Config;

  private _count: number;
  private readonly _callbacks: Map<number, (id: number) => void>;

  private constructor() {
    this._count = 0;
    this._callbacks = new Map();
  }

  public static getInstance(): Config {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public setNewId() {
    this._count++;
  }

  public assignCallback(cb: (id: number) => void) {
    this._callbacks.set(this._count, cb);
  }

  public getCallback(id: number) {
    return this._callbacks.get(id);
  }

  public getActiveCallback() {
    return this._callbacks.get(this._count);
  }

  public get count(): number {
    return this._count;
  }

  public get callbacks(): Map<number, (id: number) => void> {
    return this._callbacks;
  }

  public getUniqueIdForNoneState() {
    // TODO: Make better solution
    return Math.random();
  }
}

export const getConfig = () => Config.getInstance();
