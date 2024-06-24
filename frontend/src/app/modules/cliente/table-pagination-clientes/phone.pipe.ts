import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat'
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    // Remover caracteres não numéricos
    const cleaned = ('' + value).replace(/\D/g, '');

    // Formatar o número conforme a máscara (00) 00000-0000
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return value;
  }
}
