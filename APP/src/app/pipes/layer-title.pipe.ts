import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'layerTitle'
})
export class LayerTitlePipe implements PipeTransform {

  transform(title?: string) {
    if(title) {
    // Divide el string en palabras usando el guion bajo como separador
      const words = title.split("_");
      // Capitaliza la primera letra de cada palabra
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      // Une las palabras nuevamente en un string
      const transformedString = capitalizedWords.join(" ");
      return transformedString;
  }
  return title;
  }
}
