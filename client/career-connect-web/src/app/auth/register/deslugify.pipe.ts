import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deslugify',
})
export class DeslugifyPipe implements PipeTransform {
  transform(slug: string, ...args: unknown[]): unknown {
    let str = slug.replace(/_/g, ' ');

    for (let i = 0; i < str.length; i++) {
      if (i == 0) {
        str = `${str[i].toUpperCase()}${str.substring(1)}`;
      }
      if (str[i] === ' ') {
        str = `${str.substring(0, i + 1)}${str[
          i + 1
        ].toUpperCase()}${str.substring(i + 2)}`;
      }
    }
    return str;
  }
}
