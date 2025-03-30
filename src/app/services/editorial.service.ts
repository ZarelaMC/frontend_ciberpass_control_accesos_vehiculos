import { HttpClient , HttpHeaders , HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { Editorial } from '../models/editorial.model';
import { map } from "rxjs/operators";

const baseUrlEditorial = AppSettings.API_ENDPOINT+ '/editorial';
const baseUrlCrudEditorial = AppSettings.API_ENDPOINT+ '/crudEditorial';
const baseUrlConsultaEditorial = AppSettings.API_ENDPOINT+ '/consultaEditorial';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  private baseUrlCrudEditorial = AppSettings.API_ENDPOINT+ '/crudEditorial';
  constructor(private http:HttpClient) { }

  registrar(data:Editorial):Observable<any>{
    return this.http.post(baseUrlEditorial, data);
  }

  //PC2 - CRUD
  registrarCrud(data:Editorial):Observable<any>{
    return this.http.post(baseUrlCrudEditorial+"/registraEditorial", data);
  }
  actualizarCrud(data:Editorial):Observable<any>{
    return this.http.put(baseUrlCrudEditorial+"/actualizaEditorial", data);
  }
  eliminarCrud(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudEditorial+"/eliminaEditorial/"+id);
  }
  consultarCrud(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudEditorial+"/listaEditorialPorRazonSocialLike/"+ filtro);
  }
  validarRuc(ruc: string):Observable<any>{
    return this.http.get<any>(`${this.baseUrlCrudEditorial}/buscaEditorialPorRuc`, { params: { ruc } });
  }
  validarRazonSocial(razonSocial: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCrudEditorial}/buscaEditorialPorRazonSocial`, { params: { razonSocial } });
  }

   //PC3 - Consultar
   consultarRevistaComplejo(razonSocial:string, direccion:string, ruc:string, gerente:string, desde:string, hasta:string, estado:number, pais:number):Observable<any>{
    const params = new HttpParams()
    .set("razonSocial", razonSocial)
    .set("direccion", direccion)
    .set("ruc", ruc)
    .set("gerente", gerente)
    .set("fecDesde", desde)
    .set("fecHasta", hasta)
    .set("estado", estado)
    .set("idPais", pais);

return this.http.get(baseUrlConsultaEditorial+"/consultaEditorialPorParametros", {params});
}

generateDocumentReport(razonSocial:string, direccion:string, ruc:string, gerente:string, desde:string, hasta:string, estado:number, pais:number):Observable<any>{
  const params = new HttpParams()
  .set("razonSocial", razonSocial)
  .set("direccion", direccion)
  .set("ruc", ruc)
  .set("gerente", gerente)
  .set("fecDesde", desde)
  .set("fecHasta", hasta)
  .set("estado", estado)
  .set("idPais", pais);

      let headers = new HttpHeaders();
      headers.append('Accept', 'application/pdf');
      let requestOptions: any = { headers: headers, responseType: 'blob' };

      return this.http.post(baseUrlConsultaEditorial +"/reporteEditorialPDF?razonSocial="+razonSocial+"&direccion="
        +direccion+"&ruc="+ruc+"&gerente="+gerente+"&fecDesde="+desde+"&fecHasta="+hasta+"&estado="+
        estado+"&idPais="+pais,'', requestOptions).pipe(map((response)=>{
        return {
            filename: 'reporte Editorial 2024.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
    }));
}


generateDocumentExcel(razonSocial:string, direccion:string, ruc:string, gerente:string, desde:string, hasta:string, estado:number, pais:number):Observable<any>{
  const params = new HttpParams()
  .set("razonSocial", razonSocial)
  .set("direccion", direccion)
  .set("ruc", ruc)
  .set("gerente", gerente)
  .set("fecDesde", desde)
  .set("fecHasta", hasta)
  .set("estado", estado)
  .set("idPais", pais);

let headers = new HttpHeaders();
headers.append('Accept', 'application/vnd.ms-excel');
let requestOptions: any = { headers: headers, responseType: 'blob' };

return this.http.post(baseUrlConsultaEditorial +"/reporteEditorialExcel?razonSocial="+razonSocial+"&direccion="
+direccion+"&ruc="+ruc+"&gerente="+gerente+"&fecDesde="+desde+"&fecHasta="+hasta+"&estado="+
estado+"&idPais="+pais,'', requestOptions).pipe(map((response)=>{
  return {
      filename: 'reporteExcel20232.xlsx',
      data: new Blob([response], {type: 'application/vnd.ms-excel'})
  };
}));
}


}


