import { AccesoVehicular } from "./accesoVehicular.model";
import { Cliente } from "./cliente.model";
import { TipoIncidencia } from "./tipoIncidencia.model";

export class Incidencia {
    idIncidencia?: number;
    cliente?: Cliente;
    comentario?: string;
    evidencia?: string;
    tipoIncidencia?: TipoIncidencia;
    fecha?: string;
    hora?: string;
}
