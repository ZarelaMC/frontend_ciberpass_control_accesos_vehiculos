import { DataCatalogo } from "./dataCatalogo.model";
import { Pais } from "./pais.model";
import { Usuario } from "./usuario.model";

export class Alumno {

    idAlumno?: number;
    nombres?: string;
    apellidos?: string;
    telefono?: number;
    celular?: number;
    dni?: number;
    correo?: string;
    tipoSangre?: string;
    fechaNacimiento?: Date;

    pais?:Pais;
    modalidad?: DataCatalogo;

    usuarioRegistro?:Usuario;
    usuarioActualiza?:Usuario;

    estado?: number;


   
}
