import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'thumbnailProject'
})
export class ThumbnailPlanPipe implements PipeTransform {

  transform(thumbnail?: string | null): string {
    if (thumbnail) {
      return thumbnail;
    }
    return 'assets/images/placeholder-image.png';
  }

}
