import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ConsultaService {
  private _consultalayer: any | null = null;
  private ConsultalayerSubject  = new BehaviorSubject(this._consultalayer);
  ConsultalayerSubject$: Observable<any | null> = this.ConsultalayerSubject.asObservable();
  private _filterlayer: any | null = null;
  private FilterlayerSubject  = new BehaviorSubject(this._filterlayer);
  FilterlayerSubject$: Observable<any | null> = this.FilterlayerSubject.asObservable();
  private _consultas: any[] = [];
  private _consultasBasicas: any[] = [];
  _area: any = null

  constructor() { }

  updateConsultalayer(layer: any | null){
    this.ConsultalayerSubject.next(layer);
  }

  updateFilterlayer(filter: any | null){
    this.FilterlayerSubject.next(filter);
  }

  get consultas() : any[]{
    return this._consultas;
  }

  set consultas(consulta: any) {
    this._consultas = consulta;
  }

  get consultasBasicas() : any[]{
    return this._consultasBasicas;
  }

  set area(area: any) {
    this._area = area;
  }

  get area() : any[]{
    return this._area;
  }

  set consultasBasicas(consulta: any) {
    this._consultasBasicas = consulta;
  }

  appendConsulta(consulta: any){
    this._consultas.push(consulta);
  }

  appendConsultaBasica(consulta: any){
    this._consultasBasicas.push(consulta);
  }
}
