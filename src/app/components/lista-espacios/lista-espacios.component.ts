import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { ParqueosService } from '../../services/parqueos.service';
import { UtilService } from '../../services/util.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { CrudEspacioParqueoUpdateComponent } from '../crud-espacio-parqueo-update/crud-espacio-parqueo-update.component';
import { Router } from '@angular/router';
import { ModalListaEspaciosComponent } from '../modal-lista-espacios/modal-lista-espacios.component';


@Component({
  selector: 'app-lista-espacios',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule, MatDialogModule],
  templateUrl: './lista-espacios.component.html',
  styleUrl: './lista-espacios.component.css'
})
export class ListaEspaciosComponent implements OnInit {
  // Grilla
  dataSource: any;

  lstUbicaciones: Ubicacion[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];
  parqueos: Parqueos[] = [];
  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {};

  // Variables para los filtros (inicializados con valores por defecto)
  varTipoVehiculo: number = -1;
  varEstadoEspacio: number = -1;
  varTipoParqueo: number = -1;

  constructor(
    private router: Router,
    private dialogService: MatDialog,
    private tokenService: TokenService,
    private parqueosService: ParqueosService,
    private utilService: UtilService,
    private formBuilder: FormBuilder
  ) {
    // Cargar listas al iniciar
    this.utilService.listaUbicacion().subscribe(x => this.lstUbicaciones = x);
    this.utilService.listaTipoParqueo().subscribe(x => this.lstTipoParqueo = x);
    this.utilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
  }

  // Método para agrupar parqueos por ubicación
  agruparPorUbicacion() {
    this.parqueosPorUbicacion = {};
    this.parqueos.forEach(parqueo => {
      const idUbicacion = parqueo.ubicacion?.idUbicacion;
      if (idUbicacion !== undefined) {
        if (!this.parqueosPorUbicacion[idUbicacion]) {
          this.parqueosPorUbicacion[idUbicacion] = [];
        }
        this.parqueosPorUbicacion[idUbicacion].push(parqueo);
      }
    });
  }

  ngOnInit(): void {
    // Traer parqueos y agrupar
    this.parqueosService.listarTodos().subscribe(
      (data: Parqueos[]) => {
        this.parqueos = data;
        this.agruparPorUbicacion();
      },
      (error) => {
        console.error('Error al cargar los parqueos', error);
      }
    );

    //filtrado
    // Llenar listas para los combobox
    this.utilService.listaTipoVehiculo().subscribe(
      tipos => this.lstTipoVehiculo = tipos
    );
    this.utilService.listaEstadoEspacios().subscribe(
      estados => this.lstEstadoEspacios = estados
    );
    this.utilService.listaTipoParqueo().subscribe(
      parqueos => this.lstTipoParqueo = parqueos
    );
    //SACAR EL "DESHABILITADO" DEL CBO (ESTE ES PARA LA ELIMINAICON)
    this.utilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 1);
      // Limitar la lista a los primeros 3 elementos
      this.lstEstadoEspacios = this.lstEstadoEspacios.slice(1, 4);
    });

  }
  //---------------------COLORES Y ESTILOS DEPENDIENDO TIPO, ESTADO,VEHICULO
  // Obtener el color según el tipo de parqueo
  getColor(tipo: string): string {
    switch (tipo) {
      case 'Gerencia':
        return '#2BA555';
      case 'General':
        return 'grey';
      case 'Discapacitado':
        return '#15395A';
      default:
        return 'transparent';
    }
  }

  // Obtener el ícono de vehículo según el tipo

  getVehiculoIcon(tipo: string): string {
    switch (tipo) {
      case 'Automóvil':
        return 'fa-car';
      case 'Motocicleta':
        return 'fa-motorcycle';
      case 'Bicicleta':
        return 'fa-bicycle';
      case 'Camión':
        return 'fa-truck';
      case 'Furgoneta':
        return 'caravan';
      case 'Bicicross':
        return 'fa-bicycle';
      case 'Mototaxi':
        return 'fa-moped';
      default:
        return 'fa-car'; // Default icon
    }
  }


  // Obtener opacidad según el estado
  getEstadoOpacity(estado: string): string {
    return estado === 'Disponible' ? '1' : '0.5'; // Disponible = opaco, Ocupado = menos opaco
  }
  //------------------------FIN COLORES / ESTILOS

  //FILTRACION COMPLEJA
  filtrar() {
    console.log(">>> Filtrar [inicio]");
    console.log(">>> varTipoVehiculo: " + this.varTipoVehiculo);
    console.log(">>> varEstadoEspacio: " + this.varEstadoEspacio);
    console.log(">>> varTipoParqueo: " + this.varTipoParqueo);

    // Filtrar la lista de parqueos
    let parqueosFiltrados = this.parqueos.filter(parqueo => {
      // Filtrar por tipo de vehículo
      const filtroVehiculo = this.varTipoVehiculo === -1 || parqueo.tipoVehiculo?.idTipoVehiculo === this.varTipoVehiculo;

      // Filtrar por estado de espacio
      const filtroEstado = this.varEstadoEspacio === -1 || parqueo.estadoEspacios?.idEstadoEspacios === this.varEstadoEspacio;

      // Filtrar por tipo de parqueo
      const filtroParqueo = this.varTipoParqueo === -1 || parqueo.tipoParqueo?.idTipoParqueo === this.varTipoParqueo;

      // Devolver el parqueo si cumple con todos los filtros
      return filtroVehiculo && filtroEstado && filtroParqueo;
    });

    // Actualizar la lista de parqueos con los parqueos filtrados
    this.agruparPorUbicacionFiltrada(parqueosFiltrados);
    console.log(">>> Filtrar [fin]");
  }

  // Función para agrupar parqueos filtrados por ubicación
  agruparPorUbicacionFiltrada(parqueosFiltrados: Parqueos[]) {
    this.parqueosPorUbicacion = {};
    parqueosFiltrados.forEach(parqueo => {
      const idUbicacion = parqueo.ubicacion?.idUbicacion;
      if (idUbicacion !== undefined) {
        if (!this.parqueosPorUbicacion[idUbicacion]) {
          this.parqueosPorUbicacion[idUbicacion] = [];
        }
        this.parqueosPorUbicacion[idUbicacion].push(parqueo);
      }
    });
  }



  //--  

  // Método para abrir el diálogo de actualización
  openReadDialog(obj: Ubicacion) {
    const dialogo = this.dialogService.open(ModalListaEspaciosComponent, { data: obj });
    dialogo.afterClosed().subscribe(
      x => {
        if (x === 1) {
          this.parqueosService.listarTodos().subscribe(
            (data: Parqueos[]) => {
              this.parqueos = data;
              this.agruparPorUbicacion();
            },
            (error) => {
              console.error('Error al cargar los parqueos', error);
            }
          );
        }
      }
    );
  }

  // Métodos para redirigir a formularios
  redirigirARegistroUbicacion() {
    this.router.navigate(['/verCrudUbicacion']);
  }

  redirigirARegistroParqueos() {
    this.router.navigate(['/verEspacioParqueo']);
  }


}
