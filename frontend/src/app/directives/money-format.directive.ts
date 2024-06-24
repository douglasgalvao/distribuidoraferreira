import { Directive, ElementRef, HostListener, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appFormatoMonetario]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormatoMonetarioDirective),
      multi: true
    }
  ]
})
export class FormatoMonetarioDirective implements ControlValueAccessor {

  @Input() valor: string;

  private _onChange: (value: any) => void;
  private _onTouched: () => void;

  constructor(private el: ElementRef) {
    this.valor = '';
    this._onChange = () => {}; // Inicializa com uma função vazia
    this._onTouched = () => {}; // Inicializa com uma função vazia
  }

  writeValue(value: any): void {
    this.valor = value;
    this.el.nativeElement.value = this.formatarValor(value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    let valor = event.target.value.replace(/[^0-9]/g, '');
    if (valor.length > 0) {
      valor = this.formatarValor(valor);
    }
    this.el.nativeElement.value = valor;
    this._onChange(valor);
  }

  @HostListener('blur', [])
  onBlur(): void {
    this._onTouched();
  }

  private formatarValor(valor: string): string {
    const valorNumerico = parseFloat(valor);
    return valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
