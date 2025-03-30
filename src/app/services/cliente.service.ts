import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from "rxjs";
import { Cliente } from "../models/cliente.model";

const baseUrlCliente = AppSettings.API_ENDPOINT + '/cliente';


@Injectable({
    providedIn: 'root'
})
export class clienteService {
    constructor(private http: HttpClient){}




     // Método para obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(`${baseUrlCliente}`);
  }

//Consulta
consultarClienteComplejo(nombres: string, apellidos: string, identificador:string): Observable<any> {
    const params = new HttpParams()
      .set("nombres", nombres)
      .set("apellidos", apellidos)
      .set("identificador", identificador);
  
    return this.http.get(baseUrlCliente + "/consultaClientePorParametros", { params });
  }

  /*
  buscarClientePorId(id:number): Observable<Cliente[]>{
    return this.http.get<Cliente[]>(baseUrlCliente+"/buscarClientePorId/"+id);
  }*/

    buscarClientePorId(id: number): Observable<Cliente> {
        return this.http.get<Cliente>(`${baseUrlCliente}/buscarClientePorId/${id}`);
    }
 
  informeLimiteIncidencias(idCliente: number): Observable<any> {
    // Pasar parámetros
    const params = new HttpParams().set("idCliente", idCliente.toString());

    // Configurar cabeceras
    let headers = new HttpHeaders().set('Accept', 'application/pdf');

    // Opciones de solicitud
    let requestOptions: any = { headers: headers, responseType: 'blob', params: params };

    // Hacer la solicitud POST
    return this.http.post(baseUrlCliente + "/informeLimiteIncidenciasPDF", '', requestOptions).pipe(
        map((response) => {
            return {
                filename: 'InformeLimiteIncidencias.pdf',
                data: new Blob([response], { type: 'application/pdf' })
            };
        })
    );
}

  
    traerConductorXIdAcceso(idAcceso : number):Observable<any>{
      return this.http.get(baseUrlCliente+"/obtenerClienteIdAcceso/"+ idAcceso);
    }

}