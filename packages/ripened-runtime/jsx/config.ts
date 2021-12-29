type ObservableFn = (id: number) => void;

interface Properties {
  observables: Set<ObservableFn>;
  element: HTMLElement | null;
}

class Config {
  private static _instance: Config;

  private _count: number;
  private _shouldIncrement: boolean;
  private readonly _properties: Map<number, Properties>;

  private constructor() {
    this._count = 0;
    this._properties = new Map();
    this._shouldIncrement = true;
  }

  public static getInstance(): Config {
    if (!Config._instance) {
      Config._instance = new Config();
    }
    return Config._instance;
  }

  public setNewId() {
    if (this._shouldIncrement) this._count++;
    else this._shouldIncrement = true;
  }

  public delayIncrement() {
    this._shouldIncrement = false;
  }

  public addObservable(cb: ObservableFn, id: number = this._count) {
    const callbacks: Properties = this._properties.has(id)
      ? this._properties.get(id)!
      : {
          element: null,
          observables: new Set(),
        };
    callbacks.observables.add(cb);
    this._properties.set(id, callbacks!);
  }

  public removeObservable(observable: ObservableFn, id: number = this._count) {
    if (!this._properties.has(id)) return;
    const property = this._properties.get(id)!;
    property.observables.delete(observable);
  }

  public notify(id: number) {
    this.getObservable(id)?.observables.forEach(cb => cb(id));
  }

  public getObservable(id: number) {
    return this._properties.get(id);
  }

  public get count(): number {
    return this._count;
  }
}

export const getConfig = () => Config.getInstance();
