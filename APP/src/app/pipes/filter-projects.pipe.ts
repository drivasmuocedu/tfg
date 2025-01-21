import { Pipe, PipeTransform } from '@angular/core';
import { Project } from '../models/project.model';

@Pipe({
  name: 'filterProjects' , pure: false
})
export class FilterProjectsPipe implements PipeTransform {

  transform(items: Project[], filter?: string | null): Project[] {

    if (filter) {
      return items.filter((item) => item.nombre?.toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1);
    }
    return items;
  }

}
