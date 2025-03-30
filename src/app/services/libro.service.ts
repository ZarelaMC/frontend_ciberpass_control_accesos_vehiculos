import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Libro } from '../models/libro.model';
import { Observable, map } from 'rxjs';
 

//Bases de URL 
const baseUrlLibro = AppSettings.API_ENDPOINT+ '/libro';
const baseUrlCrudLibro = AppSettings.API_ENDPOINT+ '/crudLibro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private baseUrlCrudLibro = AppSettings.API_ENDPOINT+ '/crudLibro';
  constructor(private http: HttpClient){}

  //Registrar PC1
  registrarLibro(data:Libro): Observable<any>{
    return this.http.post(baseUrlLibro, data)
  }


  //Registrar PC2
  registrarCrudLibro(data:Libro):Observable<any>{
    return this.http.post(baseUrlCrudLibro+"/registraLibro", data);
  }
  //Actualizar
  actualizarCrudLibro(data:Libro):Observable<any>{
    return this.http.put(baseUrlCrudLibro+"/actualizaLibro", data);
  }
  //Eliminar
  eliminarCrudLibro(id:number):Observable<any>{
    return this.http.delete(baseUrlCrudLibro+"/eliminaLibro/"+id);
  }
  //Consultar
  consultarCrudLibro(filtro:string):Observable<any>{
    return this.http.get(baseUrlCrudLibro+"/listaLibroPorTituloLike/"+ filtro);
  }

  //VALIDACIONES
  validarTituloIgual(titulo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCrudLibro}/buscaPorTituloIgual`, { params: { titulo } });
  }

  validarCodigoTituloIgual(codigo : number, titulo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrlCrudLibro}/buscaPorCodigoTituloActualizar`, { params: { codigo, titulo } });
  }

  //PC3
  //______________________________ CONSULTA Compleja ______________________________
  consultaComplejaLibroParametros(titulo:string, anio:number, serie:string, fechRegDesde:string, fechRegHasta:string, 
                                  estado:number, idCategoria:number, idEstadoP:number, idTipo:number, idEditorial:number
                                  ) : Observable<any> 
  {
    //Pasar parámetros
    const params = new HttpParams() 
    .set("titulo", titulo)
    .set("anio", anio)
    .set("serie", serie)
    .set("fecDesde", fechRegDesde)
    .set("fecHasta", fechRegHasta)
    .set("estado", estado)
    .set("idCateg", idCategoria)
    .set("idEstadoPrest", idEstadoP)
    .set("idTipo", idTipo)
    .set("idEditorial", idEditorial);
    return this.http.get(baseUrlCrudLibro+"/consultaComplejaLibro", {params});
  }

  //______________________________ REPORTES ______________________________
   //EXCEL
   reporteComplejoLibroExcel(titulo:string, anio:number, serie:string, fechRegDesde:string, fechRegHasta:string, 
    estado:number, idCategoria:number, idEstadoP:number, idTipo:number, idEditorial:number
    ): Observable<any> 
    {
    //Pasar parámetros
    const params = new HttpParams() 
    .set("titulo", titulo)
    .set("anio", anio)
    .set("serie", serie)
    .set("fecDesde", fechRegDesde)
    .set("fecHasta", fechRegHasta)
    .set("estado", estado)
    .set("idCateg", idCategoria)
    .set("idEstadoPrest", idEstadoP)
    .set("idTipo", idTipo)
    .set("idEditorial", idEditorial);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/vnd.ms-excel');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
    

    return this.http.post(baseUrlCrudLibro+"/reporteComplejoLibroExcel?titulo="+titulo+"&anio="+anio+"&serie="+serie+"&fecDesde="+fechRegDesde+"&fecHasta="+fechRegHasta+"&estado="+estado+"&idCateg="+idCategoria+"&idEstadoPrest="+idEstadoP+"&idTipo="+idTipo+"&idEditorial="+idEditorial,'', requestOptions).pipe(map((response)=>{
      return {
        filename: 'reporteExcel20232.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
      };
    }));
  }

  //PDF
  reporteComplejoLibroPDF(titulo:string, anio:number, serie:string, fechRegDesde:string, fechRegHasta:string, 
    estado:number, idCategoria:number, idEstadoP:number, idTipo:number, idEditorial:number
    ) : Observable<any> 
    {
    //Pasar parámetros
    const params = new HttpParams() 
    .set("titulo", titulo)
    .set("anio", anio)
    .set("serie", serie)
    .set("fecDesde", fechRegDesde)
    .set("fecHasta", fechRegHasta)
    .set("estado", estado)
    .set("idCateg", idCategoria)
    .set("idEstadoPrest", idEstadoP)
    .set("idTipo", idTipo)
    .set("idEditorial", idEditorial);

    let headers = new HttpHeaders();
          headers.append('Accept', 'application/pdf');
          let requestOptions: any = { headers: headers, responseType: 'blob' };
        return this.http.post(baseUrlCrudLibro+"/reporteComplejoLibroPDF?titulo="+titulo+"&anio="+anio+"&serie="
          +serie+"&fecDesde="+fechRegDesde+"&fecHasta="+fechRegHasta+"&estado="+estado+"&idCateg="+idCategoria+"&idEstadoPrest="
          +idEstadoP+"&idTipo="+idTipo+"&idEditorial="+idEditorial, '', requestOptions).pipe(map((response)=>{
          return {
            filename: 'reporteLibroPDF.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
        }));
  }

  
}




/*
let blob = new Blob([response], { type: 'application/vnd.ms-excel' });
                
      // Validar si el Blob está vacío
      if (blob.size === 0) {
          // Acción específica cuando la respuesta está vacía
          return new Error('El archivo Excel está vacío.');
      } else {
        return {
          filename: 'reporteExcel.xlsx',
          data: blob
      };
*/
