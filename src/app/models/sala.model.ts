import { DataCatalogo } from "./dataCatalogo.model";
import { Usuario } from "./usuario.model";


export class Sala {
    idSala?: number;
    numero?:string;
    piso?:number;
    numAlumnos?:number;
    recursos?:string;
    tipoSala?: DataCatalogo;
    sede ?: DataCatalogo;
    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario;
    estadoReserva?: DataCatalogo;
    estado?: number;
}