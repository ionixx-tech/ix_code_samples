import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[DecimalNumber]'
})
export class DecimalNumber {

  regexStr = '^[ 0-9\.]*$';
  constructor(private el: ElementRef) { }

  @Input() DecimalNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.DecimalNumber) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  regexStr = '^[0-9]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyNumber) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13, 37 , 39 , 40, 38].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}


@Directive({
  selector: '[OnlyAlphabet]'
})
export class OnlyAlphabet {

  regexStr = '^[ a-zA-Z]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyAlphabet: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyAlphabet) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}


@Directive({
  selector: '[OnlyAphaNumber]'
})
export class OnlyAphaNumber {

  regexStr = '^[ 0-9a-zA-Z]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyAphaNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyAphaNumber) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}

@Directive({
  selector: '[OnlyAddress]'
})
export class OnlyAddress {

  regexStr = '^[ 0-9a-zA-Z\-\,\.\/\"\&]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyAddress: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyAddress) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}


@Directive({
  selector: '[OnlyPhone]'
})
export class OnlyPhone {

  regexStr = '^[0-9\(\)\+\-]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyPhone: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyPhone) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}



@Directive({
  selector: '[OnlyAlphaNumeric]'
})
export class OnlyAlphaNumeric {

  regexStr = '^[a-zA-Z0-9]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyAlphaNumeric: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyAlphaNumeric) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13, 37, 39].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}

@Directive({
  selector: '[OnlyAlphabetDot]'
})
export class OnlyAlphabetDot {

  regexStr = '^[ a-zA-Z\.]*$';
  constructor(private el: ElementRef) { }

  @Input() OnlyAlphabetDot: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent> event;
    if (this.OnlyAlphabetDot) {
      // console.log(event, this.OnlyNumber);
      if ([46, 8, 9, 27, 13, 37, 39].indexOf(e.keyCode) !== -1) {
        return;
      }
      const ch = (e.key);
      const regEx =  new RegExp(this.regexStr);
      if (regEx.test(ch)) {
        return;
      }else {
        e.preventDefault();
      }
    }
  }
}
