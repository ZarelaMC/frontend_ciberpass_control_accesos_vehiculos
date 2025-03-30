import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const baseUrlSalidaVehicular = AppSettings.API_ENDPOINT + '/accesoVehicular';


@Injectable({
    providedIn: 'root'
})
export class salidaVehicularService {
    constructor(private http: HttpClient){}


    listarSalidaVehicular(): Observable<any[]> {
        return this.http.get<any[]>(`${baseUrlSalidaVehicular}/listarSalidaVehicular`);
    }

    registrarIncidencia(idCliente: number): Observable<any> {
        const url = `${baseUrlSalidaVehicular}/registrarIncidencia/${idCliente}`;
        return this.http.post(url, {}, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json'  // Recibe un objeto JSON como respuesta
        });
    }

    registrarSalida(idAccesoVehicular: number): Observable<any> {
        const url = `${baseUrlSalidaVehicular}/registrarSalida/${idAccesoVehicular}`;
        return this.http.post<any>(url, {}, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    


    buscarDatosAcceso(idAccesoVehicular: number): Observable<any> {
        return this.http.get<any[]>(`${baseUrlSalidaVehicular}/obtenerDatosAcceso/${idAccesoVehicular}`);
    }
    
}