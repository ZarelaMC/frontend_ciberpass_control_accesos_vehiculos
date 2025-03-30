import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Autor } from '../models/autor.model';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

const baseUrlAutor = AppSettings.API_ENDPOINT+ '/autor';
//CRUD AUTOR
const baseUrlCrudAutor = AppSettings.API_ENDPOINT+ '/crudAutor'; 

//CRUD AUTOR -- PC3
const baseUrlConsultaAutor = AppSettings.API_ENDPOINT+ '/consultaAutor'; 
//==========================================================

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private baseUrlCrudAutor = AppSettings.API_ENDPOINT+ '/crudAutor'; 

  constructor(private http:HttpClient) { }
  registraAutor(obj:Autor): Observable<any>{
    return this.http.post(baseUrlAutor, obj);
  }
  //listo

  //PC2---
  //PC2 - CRUD 

registrarCrud(data:Autor):Observable<any>{ 
  return this.http.post(baseUrlCrudAutor+"/registraAutor", data); 
} 
actualizarCrud(data:Autor):Observable<any>{ 
  return this.http.put(baseUrlCrudAutor+"/actualizaAutor", data); 
} 
eliminarCrud(id:number):Observable<any>{ 
  return this.http.delete(baseUrlCrudAutor+"/eliminaAutor/"+id); 
} 

consultarCrud(filtro:string):Observable<any>{ 
  return this.http.get(baseUrlCrudAutor+"/listaAutorPorNombreLike/"+ filtro); 
} 
//validacion
validarTelefono(telefono: string):Observable<any>{
  return this.http.get<any>(`${this.baseUrlCrudAutor}/buscaAutorPorTelefono`, { params: { telefono } });
}

//validarTelefonoAct(telefono: string,idAutor:number):Observable<any>{
 // return this.http.get<any>(`${this.baseUrlCrudAutor}/buscaAutorPorTelefonoAct`, { params: { telefono,idAutor} });
//}
//listo

//=========================PC3-CONSULTA COMPLEJA ========================================================================0

//PC3 - Consultar
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

  return this.http.get(baseUrlConsultaAutor + "/consultaAutorPorParametros", { params });
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
  
    return this.http.post(baseUrlConsultaAutor +"/reporteAutorPDF?nombres="+nombres+"&apellidos="
      +apellidos+"&fecNacDesde="+fecNacDesde+"&fecNacHasta="+fecNacHasta+"&telefono="
      +telefono+"&celular="+celular+"&orcid="+orcid+"&estado="+
      estado+"&idPais="+idPais+"&idGrado="+idGrado,'', requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteAutor.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
  }

//EXCEL
generateAutorReportExcel(nombres: string, apellidos: string, fecNacDesde: string, fecNacHasta: string, telefono: string, celular: string,orcid: string,estado: number, idPais: number, idGrado: number): Observable<any> {
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
  headers.append('Accept', 'application/vnd.ms-excel');
  let requestOptions: any = { headers: headers, responseType: 'blob' };

  return this.http.post(baseUrlConsultaAutor + "/reporteAutorExcel?nombres=" + nombres + "&apellidos=" + apellidos + "&fecNacDesde=" + fecNacDesde + "&fecNacHasta=" +fecNacHasta + "&telefono=" + telefono+ "&celular="+ celular+ "&orcid="+ orcid +"&estado=" + estado + "&idPais=" + idPais + "&idGrado=" + idGrado, '', requestOptions).pipe(map((response) => {
    return {
      filename: 'reporteAutor.xlsx',
      data: new Blob([response], { type: 'application/vnd.ms-excel' })
    };
  }));
}





}
