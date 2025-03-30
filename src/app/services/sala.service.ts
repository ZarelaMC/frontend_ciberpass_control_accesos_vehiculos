import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Sala } from "../models/sala.model";
import { Observable, map } from "rxjs";


const baseUrlSala = AppSettings.API_ENDPOINT+ '/sala';
const baseUrlCrudSala = AppSettings.API_ENDPOINT+ '/crudSala';
const baseUrlConsultaSala = AppSettings.API_ENDPOINT+ '/consultaSala';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  private baseUrlCrudSala = AppSettings.API_ENDPOINT+ '/crudSala';

  constructor(private http:HttpClient) { }

  //PC1 - Registrar
  registrar(data:Sala):Observable<any>{
    return this.http.post(baseUrlSala, data);
  }

  //PC2 - CRUD
  registrarCrud(data:Sala):Observable<any>{
    return this.http.post(baseUrlCrudSala+"/registraSala", data);
  }
  actualizarCrud(data:Sala):Observable<any>{
    return this.http.put(baseUrlCrudSala+"/actualizaSala", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudSala+"/eliminaSala/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudSala+"/listaSalaPorNumeroLike/"+ filtro);
  }
  validarNumero(numero: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCrudSala}/buscaPorNumeroIgual`, { params: { numero } });
  }

  //PC3 - Consultar
  consultarSalaComplejo(num:string, piso:number, numAl:number, recu:string, est:number, t:number, s:number, e:number):Observable<any>{
    const params = new HttpParams()
    .set("numero", num)
    .set("piso", piso)
    .set("numAlumnos", numAl)
    .set("recursos", recu)
    .set("estado", est)
    .set("idTipoSala", t)
    .set("idSede", s)
    .set("idEstadoReserva", e);

  return this.http.get(baseUrlConsultaSala+"/consultaSalaPorParametros", {params});
  }

  generateDocumentReport(num:string, piso:number, numAl:number, recu:string, est:number, t:number, s:number, e:number): Observable<any> {
    const params = new HttpParams()
    .set("numero", num)
    .set("piso", piso)
    .set("numAlumnos", numAl)
    .set("recursos", recu)
    .set("estado", est)
    .set("idTipoSala", t)
    .set("idSede", s)
    .set("idEstadoReserva", e);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaSala +"/reporteSalaPDF?numero="+num+"&piso="+piso+
      "&numAlumnos="+numAl+"&recursos="+recu+"&estado="+est+"&idTipoSala="+t+"&idSede="+s+
      "&idEstadoReserva="+e,'', requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteDocente20232.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}

  generateDocumentExcel(num:string, piso:number, numAl:number, recu:string, est:number, t:number, s:number, e:number): Observable<any> {
    const params = new HttpParams()
    .set("numero", num)
    .set("piso", piso)
    .set("numAlumnos", numAl)
    .set("recursos", recu)
    .set("estado", est)
    .set("idTipoSala", t)
    .set("idSede", s)
    .set("idEstadoReserva", e);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsultaSala +"/reporteSalaExcel?numero="+num+"&piso="+piso+"&numAlumnos="+numAl+"&recursos="+recu+"&estado="+est+"&idTipoSala="+t+"&idSede="+s+"&idEstadoReserva="+e,'', requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteExcel20232.xlsx',
          data: new Blob([response], {type: 'application/vnd.ms-excel'})
      };
  }));
}
}