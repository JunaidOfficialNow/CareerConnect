import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'formatedDescription',
})
export class FormatedDescriptionPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    return value.replace(/\n/g, "<br>");
  }
}

@NgModule({
  declarations: [
    FormatedDescriptionPipe,
  ],
  exports: [FormatedDescriptionPipe],
})
export class FormatedDescriptionPipeModule {}