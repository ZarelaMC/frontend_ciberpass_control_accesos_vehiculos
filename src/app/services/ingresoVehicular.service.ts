import { Injectable } from "@angular/core";
import { AppSettings } from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { AccesoVehicular } from "../models/accesoVehicular.model";
import { Observable } from "rxjs";
import { Cliente } from "../models/cliente.model";

export const baseUrlIngresoVehicular = AppSettings.API_ENDPOINT + '/accesoVehicular';
const baseUrlRegistroCliente = AppSettings.API_ENDPOINT + '/accesoVehicular';

@Injectable({
    providedIn: 'root'
})
export class ingresoVehicularService {
    constructor(private http: HttpClient){}

    registrarAccesoVehicular(obj: AccesoVehicular): Observable<any> {
        return this.http.post(`${baseUrlIngresoVehicular}/registraAV`, obj);
    }

    registrarCliente(obj: Cliente): Observable<any> {
        return this.http.post(`${baseUrlRegistroCliente}/registrarCliente`, obj);
    }

 
    

    buscarAccesoXId(idAcceso : number): Observable<AccesoVehicular> {
        return this.http.get<AccesoVehicular>(`${baseUrlIngresoVehicular}/obtenerAcceso/`+idAcceso);
    }
}