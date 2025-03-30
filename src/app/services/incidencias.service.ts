
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Autor } from '../models/autor.model';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

//CRUD AUTOR

//CRUD AUTOR -- PC3
const baseUrlConsultaIncidencias = AppSettings.API_ENDPOINT+ '/incidencias'; 
//==========================================================

@Injectable({
  providedIn: 'root'
})
export class incidenciasService {

  constructor(private http:HttpClient) { }



/*PDF Descarga incidencias*/

//Consultar
consultarAutorComplejo(nombres: string, apellidos: string, fecNacDesde: string, fecNacHasta: string,telefono: string, celular: string,orcid: string, estado: number, idPais: number, idGrado: number): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nombres)
      .set("apellidos", apellidos)
      .set("fecNacDesde", fecNacDesde)
      .set("fecNacHasta", fecNacHasta)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("orcid", orcid)
      .set("estado", estado)
      .set("idPais", idPais)
      .set("idGrado", idGrado);
  
    return this.http.get(baseUrlConsultaIncidencias + "/consultaAutorPorParametros", { params });
  }
  
  //PDF
  generateAutorReportPDF(nombres: string, apellidos: string, fecNacDesde: string, fecNacHasta: string, telefono: string, celular: string,orcid: string,estado: number, idPais: number, idGrado: number): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nombres)
      .set("apellidos", apellidos)
      .set("fecNacDesde", fecNacDesde)
      .set("fecNacHasta", fecNacHasta)
      .set("telefono", telefono)
      .set("celular", celular)
      .set("orcid", orcid)
      .set("estado", estado)
      .set("idPais", idPais)
      .set("idGrado", idGrado);
  
      let headers = new HttpHeaders();
      headers.append('Accept', 'application/pdf');
      let requestOptions: any = { headers: headers, responseType: 'blob' };
    
      return this.http.post(baseUrlConsultaIncidencias +"/reporteAutorPDF?nombres="+nombres+"&apellidos="
        +apellidos+"&fecNacDesde="+fecNacDesde+"&fecNacHasta="+fecNacHasta+"&telefono="
        +telefono+"&celular="+celular+"&orcid="+orcid+"&estado="+
        estado+"&idPais="+idPais+"&idGrado="+idGrado,'', requestOptions).pipe(map((response)=>{
        return {
            filename: 'reporteAutor.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
    }));
    }
  
 
}