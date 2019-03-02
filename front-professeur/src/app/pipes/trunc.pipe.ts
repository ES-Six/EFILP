import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trunc'
})
export class TruncPipe implements PipeTransform {

  transform(lvalue: any): any {
    if (Number(lvalue)) {
      return Math.trunc(lvalue);
    } else {
      return NaN;
    }
  }

}
