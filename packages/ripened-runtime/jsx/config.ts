class Config {
  private static _instance: Config;

  private _count: number;
  private readonly _callbacks: Map<number, Array<(id: number) => void>>;

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

  public assignCallback(cb: (id: number) => void, id: number = this._count) {
    const callbacks = this._callbacks.has(id) ? this._callbacks.get(id) : [];
    callbacks!.push(cb);
    this._callbacks.set(id, callbacks!);
  }

  public removeCallback(id: number) {
    this._callbacks.delete(id);
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

  public get callbacks(): Map<number, Array<(id: number) => void>> {
    return this._callbacks;
  }

  public getUniqueIdForNoneState() {
    // TODO: Make better solution
    return Math.random();
  }
}

export const getConfig = () => Config.getInstance();
