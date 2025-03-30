export class EspacioParqueo {
    idEspacio?: number;
    idParqueo?: number;
    tipoEspacio?: string; // general, discapacitado, gerencia
    numeroEspacio?: number;
    estado?: string; // disponible, ocupado, reservado
    fechaCreacion?: Date;
    fechaActualizacion?: Date;
}