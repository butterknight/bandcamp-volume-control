import { IStorageState } from '../markup/interfaces/state.interface';

export class StorageService {
  public constructor(private readonly storage: chrome.storage.LocalStorageArea) {}

  public save(state: IStorageState, callback?: () => void): void {
    this.storage.set(state, () => {
      if (callback) {
        callback();
      }
    });
  }

  public load(callback: (volume: number) => void): void {
    this.storage.get(null, (state: Record<string, any>) => {
      const volume: number = this.normaliseVolume(state.bk_bvc_volume);
      callback(volume);
    });
  }

  private normaliseVolume(value: string | undefined): number {
    const defaultValue = 0.72;
    const numberValue: number | string | undefined = value && +value;
    if (!numberValue || numberValue < 0 || numberValue > 100) {
      return defaultValue;
    } else {
      return numberValue as number;
    }
  }
}
