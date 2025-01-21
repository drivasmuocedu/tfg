export interface iProject {
    id?: number;
    nombre?: string;
    descripcion?: string;
    foto?: string;
    creationDate?:string;
    modificationDate?:string;
}

export class Project implements iProject {
  id?: number;
  nombre?: string;
  descripcion?: string;
  foto?: string;
  creationDate?:string;
  modificationDate?:string;

  constructor(project?: iProject) {
    if (project) {
      this.id = project.id;
      this.nombre = project.nombre;
      this.descripcion = project.descripcion;
      this.foto = project.foto;
      this.creationDate = project.creationDate;
      this.modificationDate = project.modificationDate;
    }
  }
}