export class EventService {
  private readonly listeners: Record<string, Array<(event: any) => any>> = {};

  public emit(name: string, value: any): void {
    const listeners = this.listeners[name];
    if (!listeners) {
      return;
    }

    listeners.forEach((listener: (event: any) => any) => {
      listener(value);
    });
  }

  public listen(name: string, listener: (event: any) => any): void {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(listener);
  }

  public remove(name: string, listener: (event: any) => any): void {
    const listeners = this.listeners[name];
    if (!listeners) {
      return;
    }

    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }
}
