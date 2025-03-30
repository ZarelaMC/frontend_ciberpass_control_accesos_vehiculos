import { Cliente } from "./cliente.model";
import { EspacioParqueo } from "./espacioParqueo";
import { Parqueo } from "./parqueo.model";
import { Parqueos } from "./parqueos.model";
import { Ubicacion } from "./ubicacion.model";

import { Usuario } from "./usuario.model";

export class AccesoVehicular {

    idAccesoVehicular?: number;
    cliente?: Cliente;
    usuario?: Usuario;
    parqueos?: Parqueos;
    ubicacion?: Ubicacion;

    placaVehiculo?: string;
    estado?: string;
    
    fechaRegistro?: Date | string;
    fechaActualizacion?: Date | string;

}
