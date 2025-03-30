import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Alumno } from '../models/alumno.model';
import { Observable, map } from 'rxjs';

const baseUrlAlumno = AppSettings.API_ENDPOINT + '/alumno';
const baseUrlCrudAlumno = AppSettings.API_ENDPOINT + '/crudAlumno';
const baseUrlConsultaAlumno = AppSettings.API_ENDPOINT + '/consultaAlumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor(private http: HttpClient) { }

  // PC1 - REGISTER
  registrar(data: Alumno): Observable<any> {
    return this.http.post(baseUrlAlumno, data);
  }

  // PC2 - CRUD
  registrarCrud(data: Alumno): Observable<any> {
    return this.http.post(baseUrlCrudAlumno + "/registraAlumno", data);
  }

  actualizarCrud(data: Alumno): Observable<any> {
    return this.http.put(baseUrlCrudAlumno + "/actualizaAlumno", data);
  }

  eliminarCrud(id: number): Observable<any> {
    return this.http.delete(baseUrlCrudAlumno + "/eliminaAlumno/" + id);
  }

  consultarCrud(filtro: string): Observable<any> {
    return this.http.get(baseUrlCrudAlumno + "/listaAlumnoPorTituloLike/" + filtro);
  }

  validarNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${baseUrlCrudAlumno}/buscaPorNombreIgual`, { params: { nombre } });
  }

  // validación
  validarTelefono(telefono: string): Observable<any> {
    return this.http.get<any>(`${baseUrlCrudAlumno}/buscaAlumnoPorTelefono`, { params: { telefono } });
  }

  // validación
  validarDni(dni: string): Observable<any> {
    return this.http.get<any>(`${baseUrlCrudAlumno}/buscaAlumnoPorDni`, { params: { dni } });
  }

  // PC3 - Consultar
  consultaAlumnoCompleja(nom: string, ape: string, tel: string, cel: string, dni: string, 
    cor: string, tip: string, est: number, desde: string, hasta: string, p: number, m: number): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nom)
      .set("apellidos", ape)
      .set("telefono", tel)
      .set("celular", cel)
      .set("dni", dni)
      .set("correo", cor)
      .set("tipoSangre", tip)
      .set("estado",est) // Convertir a string
      .set("fechaNacDesde", desde)
      .set("fechaNacHasta", hasta)
      .set("pais", p) // Convertir a string
      .set("modalidad", m); // Convertir a string

    return this.http.get(baseUrlConsultaAlumno + "/consultaAlumnoPorParametros", { params });
  }

  generarDocumentoExcel(nom: string, ape: string, tel: string, cel: string, dni: string, cor: string, tip: string,
    est: number, desde: string, hasta: string, p: number, m: number): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nom)
      .set("apellidos", ape)
      .set("telefono", tel)
      .set("celular", cel)
      .set("dni", dni)
      .set("correo", cor)
      .set("tipoSangre", tip)
      .set("estado",est) // Convertir a string
      .set("fechaNacDesde", desde)
      .set("fechaNacHasta", hasta)
      .set("pais", p) // Convertir a string
      .set("modalidad", m); // Convertir a string

    
      let headers = new HttpHeaders();
      headers.append('Accept', 'application/vnd.ms-excel');
      let requestOptions: any = { headers: headers, responseType: 'blob' };

      return this.http.post(baseUrlConsultaAlumno + "/reporteAlumnoExcel?nombres="+nom+"&apellidos="+ape+
        "&telefono="+tel+"&celular="+cel+"&dni="+dni+"&correo="+cor+"&tipoSangre="+tip+"&estado="+est+"&fechaNacDesde="+desde+"&fechaNacHasta="+hasta+
        "&idPais="+p+"&idModalidad="+m,'',
      
        requestOptions).pipe(map((response)=>{
          return {
              filename: 'reporteAlumnoExcel.xlsx',
              data: new Blob([response], {type: 'application/vnd.ms-excel'})
          };
          }
    
          )
    
          );
    
    }

    generateDocumentReport(nom: string, ape: string, tel: string, cel: string, dni: string, cor: string, tip: string,
      est: number, desde: string, hasta: string, p: number, m: number): Observable<any> {
      const params = new HttpParams()
        .set("nombres", nom)
        .set("apellidos", ape)
        .set("telefono", tel)
        .set("celular", cel)
        .set("dni", dni)
        .set("correo", cor)
        .set("tipoSangre", tip)
        .set("estado",est) // Convertir a string
        .set("fechaNacDesde", desde)
        .set("fechaNacHasta", hasta)
        .set("pais", p) // Convertir a string
        .set("modalidad", m); // Convertir a string

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaAlumno + "/reporteAlumnoPDF?nombres="+nom+"&apellidos="+ape+
      "&telefono="+tel+"&celular="+cel+"&dni="+dni+"&correo="+cor+"&tipoSangre="+tip+"&estado="+est+"&fechaNacDesde="+desde+"&fechaNacHasta="+hasta+
      "&idPais="+p+"&idModalidad="+m,'',
      
      requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteAlumnoPDF.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}



}
