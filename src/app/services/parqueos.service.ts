import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Parqueos } from '../models/parqueos.model';
import { AppSettings } from '../app.settings';
const baseUrlIngresoVehicular = AppSettings.API_ENDPOINT + '/accesoVehicular';
@Injectable({
  providedIn: 'root'
})
export class ParqueosService {
  private parqueosSubject = new BehaviorSubject<Parqueos[]>([]);
  parqueos$ = this.parqueosSubject.asObservable();
  private baseUrl = 'http://localhost:8090/url/parqueos';

  
  

  constructor(private http: HttpClient) { }

  // Listar todos los parqueos
  listarTodos(): Observable<Parqueos[]> {
    return this.http.get<Parqueos[]>(`${this.baseUrl}`);
  }


  // Buscar parqueo por ID
  buscarPorId(idParqueos: number): Observable<Parqueos> {
    return this.http.get<Parqueos>(`${this.baseUrl}/${idParqueos}`);
  }

  // Registrar nuevo parqueo
  registrarParqueo(parqueo: Parqueos): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/registraParqueo", parqueo);
  }

  // Actualizar parqueo existente


actualizarParqueo(parqueo: Parqueos): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/actualizaParqueo/${parqueo.idParqueos}`, parqueo);
}


  // Eliminar parqueo por ID
  eliminarParqueo(idParqueos: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${idParqueos}`);
  }

  // Listar parqueos por estado
  listarPorEstado(estado: string): Observable<Parqueos[]> {
    return this.http.get<Parqueos[]>(`${this.baseUrl}/estado/${estado}`);
  }

  // Listar parqueos por tipo
  listarPorTipo(tipo: string): Observable<Parqueos[]> {
    return this.http.get<Parqueos[]>(`${this.baseUrl}/tipo/${tipo}`);

   

  }
   // Servicio ParqueosService: Agregar método para listar parqueos agrupados por ubicación
agrupadosPorUbicacion(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/agrupadosPorUbicacion`);
}

//consulta compleja
consultaParqueosPorParametros(
  tipoVehiculo: number,
  estadoEspacio: number,
  tipoParqueo: number
): Observable<any> {
  const params = new HttpParams()
    .set("tipoVehiculo", tipoVehiculo.toString())
    .set("estadoEspacio", estadoEspacio.toString())
    .set("tipoParqueo", tipoParqueo.toString());

  return this.http.get<any>(`${this.baseUrl}/consultaParqueosPorParametros`, { params });
}
//NUEVO
// Filtrar accesos vehiculares por ID de parqueo
filtrarAccesosPorParqueo(idParqueos: number): Observable<any> {
  return this.http.get<any>(`${baseUrlIngresoVehicular}/filtrarPorParqueo/${idParqueos}`);
}



}
