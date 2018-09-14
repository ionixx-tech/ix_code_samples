import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'SafePipe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


@Pipe({
  name: 'DateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'MMM-yyyy');
    return value;
  }
}

@Pipe({
  name: 'NormalDate',
})
export class NormalDate implements PipeTransform {
  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd-MM-yyyy');
    return value;
  }
}

@Pipe({
  name: 'SkipUnderScore',
})
export class SkipUnderScore implements PipeTransform {
  transform(value: string) {
    return value.replace(/_/g, ' ');
  }
}


@Pipe({
  name: 'RemoveSpaces',
})
export class RemoveSpaces implements PipeTransform {
  transform(value: string) {
    return value.replace(/ /g, '');
  }
}

@Pipe({
  name: 'Capitalise',
})
export class Capitalise implements PipeTransform {
  transform(input: string, length: number): string {
    if (input) {
      return input.length > 0 ? input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() )) : '';
    }
  }
}

@Pipe({
  name: 'NumberFixedLen',
})
export class NumberFixedLen implements PipeTransform {
  transform(n: string, len: string): any {
    /*n=>999
    * len=>10
    * @return nNum=>0000000999 */
    const num = parseInt(n, 10);
    const mLength = parseInt(len, 10);
    if (isNaN(num) || isNaN(mLength)) {
      return n;
    }

    let mNum = '' + num;
    if (mNum.length) {
      while (mNum.length < mLength) {
        mNum = '0' + mNum;
      }
    }


    return mNum;
  }
}
/*function zeroPadding(totalLength:number,padLegth:number){
  let returnResult = '';
  if (totalLength < padLegth){
    returnResult.concat("0")
    zeroPadding(totalLength,padLegth)
  }
  else{
    return returnResult;
  }

}*/

@Pipe({
  name: 'KeyValues'})

export class KeyValues implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (key) {
        keys.push({key: key, value: value[key]});
      }
    }
    return keys;
  }
}


@Pipe({
  name: 'ToPercent'})

export class ToPercent implements PipeTransform {
  transform(value: string) {
    return parseInt(value, 10) / 100;
  }
}
