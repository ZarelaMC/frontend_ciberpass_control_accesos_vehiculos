import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Alumno } from '../models/alumno.model';
import { Pais } from '../models/pais.model';
import { DataCatalogo } from '../models/dataCatalogo.model';
import { Editorial } from '../models/editorial.model';
import { Ubicacion } from '../models/ubicacion.model';
import { TipoParqueo } from '../models/tipoParqueo.model';
import { TipoVehiculo } from '../models/tipoVehiculo.model';
import { EstadoEspacios } from '../models/estadoEspacios.model';
import { TipoUbicacion } from '../models/tipoUbicacion.model';
import { TipoIncidencia } from '../models/tipoIncidencia.model';

const baseUrlUtil = AppSettings.API_ENDPOINT+ '/util';

const baseUrl = AppSettings.API_ENDPOINT+ '/accesoVehicular';

const baseUrlCBOS = AppSettings.API_ENDPOINT+ '/utilCBO';




@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private http:HttpClient) { }


  /*------------------------------CRUD PARQUEO--------------------------------------------*/
  listaUbicacion():Observable<Ubicacion[]>{
    return this.http.get<Ubicacion[]>(baseUrlCBOS+"/listaUbicacion");
  }

  listaTipoUbicacion():Observable<TipoUbicacion[]>{
    return this.http.get<TipoUbicacion[]>(baseUrlCBOS+"/listaTipoUbicacion");
  }

  listaTipoParqueo():Observable<TipoParqueo[]>{
    return this.http.get<TipoParqueo[]>(baseUrlCBOS+"/listaTipoParqueo");
  }

  listaTipoVehiculo():Observable<TipoVehiculo[]>{
    return this.http.get<TipoVehiculo[]>(baseUrlCBOS+"/listaTipoVehiculo");
  }

  listaEstadoEspacios():Observable<EstadoEspacios[]>{
    return this.http.get<EstadoEspacios[]>(baseUrlCBOS+"/listaEstadoEspacios");
  }

  listaTipoIncidencia():Observable<TipoIncidencia[]>{
    return this.http.get<TipoIncidencia[]>(baseUrlCBOS+"/listaTiposIncidencia");
  }

  /*------------------------------CRUD PARQUEO--------------------------------------------*/
  // Método para obtener el ID de un Cliente por DNI
  obtenerIdCliente(dni: string): Observable<number> {
    return this.http.get<number>(`${baseUrl}/cliente/id/${dni}`);
  }

  // Método para obtener el ID de un Parqueo por nombre
  obtenerIdParqueo(nombre: string): Observable<number> {
    return this.http.get<number>(`${baseUrl}/parqueos/id/${nombre}`);
  }

  // Método para obtener el ID de un Espacio de Parqueo por número
  obtenerIdEspacio(numeroEspacio: number): Observable<number> {
    return this.http.get<number>(`${baseUrl}/ubicacion/idUbicacion${numeroEspacio}`);

  }

}


