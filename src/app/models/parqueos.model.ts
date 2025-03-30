import { EstadoEspacios } from "./estadoEspacios.model";
import { TipoParqueo } from "./tipoParqueo.model";
import { TipoVehiculo } from "./tipoVehiculo.model";
import { Ubicacion } from "./ubicacion.model";
import { Usuario } from "./usuario.model";

export class Parqueos {
   
    idParqueos?: number;
    ubicacion?: Ubicacion; // Referencia a la ubicación asociada

    tipoParqueo?: TipoParqueo; // Referencia al tipo de parqueo asociado

    tipoVehiculo?: TipoVehiculo; // Referencia al tipo de vehículo asociado

    estadoEspacios?: EstadoEspacios; // Referencia al estado del espacio asociado

    fechaCreacion?: Date; // Fecha de creación del registro
    fechaActualizacion?: Date; // Fecha de última actualización

    usuarioRegistro?: Usuario;
    usuarioActualiza?: Usuario;

    isHovered?: boolean; // Nueva propiedad opcional
}
