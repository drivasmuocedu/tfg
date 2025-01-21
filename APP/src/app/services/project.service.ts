import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';

@Injectable()
export class ProjectService {
  private _project!: Project;
  private _selectedlayers: any[] = [];
  private _selectedLayerGroups: any[] = [];

  constructor() { }

  get project (): Project {
    return this._project;
  }

  set project (project: Project) {
    this._project = project;
  }

  get selectedlayers (): any[] {
    return this._selectedlayers;
  }

  set selectedlayers (selectedlayers: any[]) {
    this._selectedlayers = selectedlayers;
  }

  get selectedLayerGroups (): any[] {
    return this._selectedLayerGroups;
  }

  set selectedLayerGroups (selectedLayerGroups: any[]) {
    this._selectedLayerGroups = selectedLayerGroups;
  }


}
