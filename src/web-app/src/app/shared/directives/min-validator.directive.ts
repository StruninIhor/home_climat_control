import { Directive, Input, ElementRef } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[app-min][ngModel],[app-min][formControl],[app-min][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MinValidatorDirective,
      multi: true
    }]
})
export class MinValidatorDirective implements Validator {
  @Input('app-min')
  set min(value: number) {
    this.minValue = value;
    this.init();
  }

  get min(): number {
    return this.minValue;
  }

  constructor(private el: ElementRef) {}

  minValue: number;

  onChange: () => void;

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  init() {
    this.el.nativeElement.setAttribute('min', this.minValue);
    this.onChange && this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors {
    if (this.minValue === null) return;
    if (control.value < this.minValue) {
      return {
        min: {
          min: this.minValue
        }
      };
    }
  }
}
