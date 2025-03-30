import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Tesis } from '../models/tesis.model';
import { map } from "rxjs/operators";


const baseUrlTesis = AppSettings.API_ENDPOINT+ '/tesis';
const baseUrlCrudTesis = AppSettings.API_ENDPOINT+ '/crudTesis';


const baseUrlConsultaTesis = AppSettings.API_ENDPOINT+ '/consultaTesis';

@Injectable({
  providedIn: 'root'
})
export class TesisService {

  private baseUrlCrudTesis = AppSettings.API_ENDPOINT+ '/crudTesis'

  constructor(private http:HttpClient) { }

  //PC1 - Registrar
  registrar(data:Tesis):Observable<any>{
    return this.http.post(baseUrlTesis, data);
  }

  //PC2 - CRUD
  registrarCrud(data:Tesis):Observable<any>{
    return this.http.post(baseUrlCrudTesis+"/registraTesis", data);
  }
  actualizarCrud(data:Tesis):Observable<any>{
    return this.http.put(baseUrlCrudTesis+"/actualizaTesis", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudTesis+"/eliminaTesis/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudTesis+"/listaTesisPorTituloLike/"+ filtro);
  }

  validarTitulo(titulo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCrudTesis}/buscaPorTituloIgual`, { params: { titulo } });
  }

  //PC3 - CONSULTA

  consultarTesisComplejo(tit:string, desde:string, hasta:string, est:number, t:number, i:number, c:number):Observable<any>{
    const params = new HttpParams()
    .set("titulo", tit)
    .set("fecDesde", desde)
    .set("fecHasta", hasta)
    .set("estado", est)
    .set("idTema", t)
    .set("idIdioma", i)
    .set("idCentroEstudios", c);

    return this.http.get(baseUrlConsultaTesis+"/consultaTesisPorParametros", {params});
  }
  generateDocumentReport(tit:string, desde:string, hasta:string, est:number, t:number, i:number, c:number):Observable<any>{
    const params = new HttpParams()
    .set("titulo", tit)
    .set("fecDesde", desde)
    .set("fecHasta", hasta)
    .set("estado", est)
    .set("idTema", t)
    .set("idIdioma", i)
    .set("idCentroEstudios", c);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
      return this.http.post(baseUrlConsultaTesis +"/reporteTesisPDF?titulo="+tit+"&fecDesde="
        +desde+"&fecHasta="+hasta+"&estado="+est+"&idTema="+t+"&idIdioma="+i+"&idCentroEstudios="+c,'', requestOptions).pipe(map((response)=>{
      return {
          filename: 'reporteTesis2024.pdf',
          data: new Blob([response], {type: 'application/pdf'})
      };
  }));
}



generateDocumentExcel(tit:string, desde:string, hasta:string, est:number, t:number, i:number, c:number):Observable<any>{
const params = new HttpParams()
.set("titulo", tit)
.set("fecDesde", desde)
.set("fecHasta", hasta)
.set("estado", est)
.set("idTema", t)
.set("idIdioma", i)
.set("idCentroEstudios", c);

let headers = new HttpHeaders();
headers.append('Accept', 'application/vnd.ms-excel');
let requestOptions: any = { headers: headers, responseType: 'blob' };

return this.http.post(baseUrlConsultaTesis +"/reporteTesisExcel?titulo="+tit+"&fecDesde="
  +desde+"&fecHasta="+hasta+"&estado="+est+"&idTema="+t+"&idIdioma="+i+"&idCentroEstudios="+c,'', requestOptions).pipe(map((response)=>{
return {
    filename: 'reporteTesisExcel2024.xlsx',
    data: new Blob([response], {type: 'application/vnd.ms-excel'})
};
}));
}


}
