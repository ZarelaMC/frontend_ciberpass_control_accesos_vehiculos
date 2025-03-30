import { Pais } from "./pais.model";
import { Usuario } from "./usuario.model";

export class Editorial {

    idEditorial?: number;
    razonSocial?:string;
    direccion?:string;
    ruc?:string;
    gerente?:string;
    fechaCreacion?:Date;
    estado?: number;
    pais?:Pais;
    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;
}
