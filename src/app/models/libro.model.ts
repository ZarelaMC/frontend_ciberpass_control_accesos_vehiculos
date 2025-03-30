import { DataCatalogo } from "./dataCatalogo.model";
import { Editorial } from "./editorial.model";
import { Usuario } from "./usuario.model";
 
export class Libro {
    idLibro ?: number;
    titulo ?: string;
    anio ?: number;
    serie ?: string;
    estado ?: number;
    categoriaLibro ?: DataCatalogo;
    estadoPrestamo ?: DataCatalogo;
    tipoLibro ?: DataCatalogo;
    editorial ?: Editorial;
    usuarioRegistro ?: Usuario;
    usuarioActualiza ?: Usuario;
}
