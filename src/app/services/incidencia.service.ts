import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { Incidencia } from '../models/incidencia.model';
import { Observable } from 'rxjs';
import { AccesoVehicular } from '../models/accesoVehicular.model';
import { baseUrlIngresoVehicular } from './ingresoVehicular.service';
import { Cliente } from '../models/cliente.model';


const baseUrlIncidencia = AppSettings.API_ENDPOINT+ '/incidencias';


@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

    
    constructor(private http: HttpClient){}

    registrarIncidencia(data:Incidencia):Observable<any>{
      return this.http.post<any>(`${baseUrlIncidencia}/registrarIncidencia`, data);
    }    

    subirEvidenciaS3(fileEvidencia: File): Observable<string> {
        const formData = new FormData();
        formData.append('file', fileEvidencia);
        return this.http.post<string>(`${baseUrlIncidencia}/upload/`,formData, { responseType: 'text' as 'json' });
    }
  
    totalIncidenciasXIdCliente(idCliente : number): Observable<number | string> {
        return this.http.get<number | string>(`${baseUrlIngresoVehicular}/totalIncidencias/`+idCliente);
    }

    /*
    buscarAccesoXId(idAcceso : number): Observable<AccesoVehicular> {
        return this.http.get<AccesoVehicular>(`${baseUrlIngresoVehicular}/obtenerAcceso/`+idAcceso);
    }*/
    /*
     subirEvidenciaS3(fileEvidencia:File):Observable<string>{
      return this.http.post('http://localhost:8090/url/incidencia/upload/', fileEvidencia, { responseType: 'text' })
    }*/
}
