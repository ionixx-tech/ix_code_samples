import { NgModule } from '@angular/core';
import { DateFormatPipe, SkipUnderScore, RemoveSpaces, Capitalise, NumberFixedLen, NormalDate, KeyValues, ToPercent ,SafePipe} from './app.filter';
import {AuthGuard} from './guard/auth.guard';
import { OnlyNumber, OnlyAlphabet, OnlyPhone, OnlyAphaNumber,
  OnlyAlphaNumeric, OnlyAlphabetDot, DecimalNumber, OnlyAddress} from './app.directive';

@NgModule({
    declarations: [
      DateFormatPipe,
      SkipUnderScore,
      RemoveSpaces,
      Capitalise,
      NumberFixedLen,
      SafePipe,
      NormalDate,
      KeyValues,
      ToPercent,
      OnlyNumber,
      OnlyAphaNumber,
      OnlyAlphabet,
      OnlyPhone,
      OnlyAlphaNumeric,
      OnlyAlphabetDot,
      OnlyAphaNumber,
      OnlyAddress,
      DecimalNumber
    ],
    imports: [],
    exports: [
      OnlyAlphabet,
      OnlyNumber,
      OnlyAphaNumber,
      DecimalNumber,
      SafePipe,
      OnlyPhone,
      DateFormatPipe,
      SkipUnderScore,
      RemoveSpaces,
      Capitalise,
      NumberFixedLen,
      NormalDate,
      KeyValues,
      ToPercent,
      OnlyAlphaNumeric,
      OnlyAddress,
      OnlyAlphabetDot,
        ],
    providers: [AuthGuard],
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: []
        };
    }
}
