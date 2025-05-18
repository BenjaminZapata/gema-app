export class DebounceClass<T extends (...args: any[]) => void> {
  private callback: T;
  private delay: number;
  private timerId: ReturnType<typeof setTimeout> | null;

  /**
   * Crea una instancia de Debounce
   * @param {delay} delay tiempo de espera en milisegundos antes de ejecutar la función callback
   * @param {T} callback Funcion a la que se le aplicara el debounce
   */
  constructor(delay: number, callback: T) {
    this.callback = callback;
    this.delay = delay;
    this.timerId = null;
  }

  /**
   * Ejecuta la función de callback después del tiempo de delay especificado.
   * Si se llama a este método nuevamente antes de que transcurra el delay,
   * el temporizador anterior se cancela y se inicia uno nuevo.
   * @param  {Parameters<T>} args Argumentos que se pasarán a la función de callback.
   */
  public execute(...args: Parameters<T>): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      this.callback.apply(null, args);
      this.timerId = null;
    }, this.delay);
  }

  /**
   * Cancela cualquier ejecución pendiente del callback.
   */
  public cancel(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
