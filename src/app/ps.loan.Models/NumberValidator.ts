import { AbstractControl, ValidationErrors } from "@angular/forms";

export class NumberValidator {
    static number(val: any):  boolean {
        if (val) {
            var digits = val.replace(/[^0-9]/g, '');

            if (digits !== val) {
                return false;
            }

            return true;

          }
          return false;
    };
}
