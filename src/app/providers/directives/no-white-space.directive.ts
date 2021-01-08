import { Directive } from '@angular/core';
import { Validator, ValidatorFn, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appNoWhiteSpace]',
})
export class NoWhiteSpaceDirective implements Validator {
  constructor() {}

  private valFn = this.NoWhitespaceValidator();
  validate(control: AbstractControl): { [key: string]: any } {
    return this.valFn(control);
  }

  NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let isWhitespace = (control.value || '').trim().length === 0;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: 'value is only whitespace' };
    };
  }
}
