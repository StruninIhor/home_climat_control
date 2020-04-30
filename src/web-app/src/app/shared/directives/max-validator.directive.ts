import { Directive, Input, ElementRef } from '@angular/core';
import { AbstractControl, ValidationErrors, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[app-max][ngModel],[app-max][formControl],[app-max][formControlName]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxValidatorDirective,
      multi: true
    }
  ]
})
export class MaxValidatorDirective implements Validator {
  @Input('app-max')
  set max(value: number) {
    this.maxValue = value;
    this.init();
  }

  get max(): number {
    return this.maxValue;
  }

  constructor(private el: ElementRef) {}

  maxValue: number;

  onChange: () => void;

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }

  init() {
    this.el.nativeElement.setAttribute('max', this.maxValue);
    this.onChange && this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors {
    if (this.maxValue === null) return;
    if (control.value > this.maxValue) {
      return {
        max: {
          max: this.maxValue
        }
      };
    }
  }
}
