import { Component, OnInit } from '@angular/core';
import { EspacioParqueoService } from '../../services/espacioParqueo.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { EspacioParqueo } from '../../models/espacioParqueo';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';

import { Ubicacion } from '../../models/ubicacion.model';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { ParqueosService } from '../../services/parqueos.service';
import { UtilService } from '../../services/util.service';
import { CrudEspacioParqueoUpdateComponent } from '../crud-espacio-parqueo-update/crud-espacio-parqueo-update.component';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-crudEspacio-parqueo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule, MatDialogModule],
  templateUrl: './crud-EspacioParqueo.component.html',

  styleUrls: ['./crud-EspacioParqueo.component.css']
})
export class AgregarParqueosComponent implements OnInit {
  lstParqueos: Parqueos[]= [];
  lstUbicaciones: Ubicacion[] = []; // Se declara la propiedad lstPaises
  lstTipoParqueo: TipoParqueo[] = []; // Se declara la propiedad lstTipoParqueo
  lstTipoVehiculo: TipoVehiculo[] = []; // Se declara la propiedad lstTipoVehiculo
  lstEstadoEspacios: EstadoEspacios[] = []; // Se declara la propiedad lstEstadoEspacios
  parqueos: Parqueos[] = [];
  // Este será el objeto donde vamos a agrupar los parqueos por ubicación
  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {}; // Definimos que cada clave es de tipo 'number' y el valor es un array de 'Parqueos'.



  objParqueo: Parqueos = {
    ubicacion: {
      idUbicacion: -1
    },
    tipoParqueo: {
      idTipoParqueo: -1
    },
    tipoVehiculo: {
      idTipoVehiculo: -1
    },
    estadoEspacios: {
      idEstadoEspacios: 1
    }
  }

  objUsuario: Usuario = {};



  espacioParqueoForm!: FormGroup;

  showForm: boolean = false;  // Variable para mostrar/ocultar el formulario
  filtro: string = ''; // Para el filtro de búsqueda
  displayedColumns: string[] = ['idEspacio', 'idParqueos', 'tipoEspacio', 'numeroEspacio', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);



  // Validaciones del formulario
  formsRegistra = this.formBuilder.group({
    validaUbicacion: ['', Validators.min(1)],
    validaTipo: ['', Validators.min(1)],
    validaTipoVehiculo: ['', Validators.min(1)],
    validaEstadoEspacios: ['', Validators.min(1)]
  });

  constructor(
    private router: Router, // PARA OPCION +NUEVO
    private dialogService: MatDialog,
    private tokenService: TokenService,
    private parqueosService: ParqueosService,
    private UtilService: UtilService,
    private formBuilder: FormBuilder
  ) {
    this.UtilService.listaUbicacion().subscribe(x => this.lstUbicaciones = x);
    this.UtilService.listaTipoParqueo().subscribe(x => this.lstTipoParqueo = x);
    this.UtilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);
    this.UtilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  // Método que agrupa los parqueos por ubicación
  agruparPorUbicacion() {
    this.parqueosPorUbicacion = {}; // Limpiamos el objeto antes de agrupar
    this.parqueos.forEach(parqueo => {
      // Verificamos que la ubicación y su id sean válidos
      const idUbicacion = parqueo.ubicacion?.idUbicacion;
      if (idUbicacion !== undefined) {
        // Si no existe la clave de la ubicación, la creamos
        if (!this.parqueosPorUbicacion[idUbicacion]) {
          this.parqueosPorUbicacion[idUbicacion] = [];
        }
        // Agregamos el parqueo al arreglo de la ubicación correspondiente
        this.parqueosPorUbicacion[idUbicacion].push(parqueo);
      }
    });
  }


  ngOnInit(): void {
    // Traemos la lista de parqueos y agrupamos por ubicación después de obtenerlos
    this.parqueosService.listarTodos().subscribe(
      (data: Parqueos[]) => {
        this.parqueos = data;
        this.agruparPorUbicacion(); // Llamamos al método de agrupación después de obtener los parqueos
      },
      (error) => {
        console.error('Error al cargar los parqueos', error);
      }
    );

    //SACAR EL "DESHABILITADO" DEL CBO (ESTE ES PARA LA ELIMINAICON)
    this.UtilService.listaEstadoEspacios().subscribe(x => {
      this.lstEstadoEspacios = x.filter(estado => estado.idEstadoEspacios !== 1);
      // Limitar la lista a los primeros 3 elementos
      this.lstEstadoEspacios = this.lstEstadoEspacios.slice(1, 4);

    });
  }


  ///----------------------------------------COLOR

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

  //----------------------------------FIN ESTILOS DE BOTON
  // Método de registro de parqueo
  registra() {
    this.objParqueo.usuarioActualiza = this.objUsuario;
    this.objParqueo.usuarioRegistro = this.objUsuario;
    this.parqueosService.registrarParqueo(this.objParqueo).subscribe(
      x => {
        if (x.error) {
          // Si hay un error, mostramos el mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error en la Actualización',
            text: x.error, // Aquí asumimos que `response.error` contiene el mensaje de error
          });
        } else {
          // Si no hay error, mostramos el mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Resultado de la Actualización',
            text: x.mensaje, // Aquí usamos `response.mensaje` si la actualización fue exitosa
          });

          // Actualizamos la lista de parqueos después de registrar uno nuevo
          this.parqueosService.listarTodos().subscribe(
            (data: Parqueos[]) => {
              this.parqueos = data;
              // Agrupamos nuevamente los parqueos después de la actualización
              this.agruparPorUbicacion();
            },
            (error) => {
              console.error('Error al cargar los parqueos', error);
            }
          );

          // Limpiamos el formulario después de registrar
          this.objParqueo = {
            ubicacion: { idUbicacion: -1 },
            tipoParqueo: { idTipoParqueo: -1 },
            tipoVehiculo: { idTipoVehiculo: -1 },
            estadoEspacios: { idEstadoEspacios: 1 }
          };
          this.formsRegistra.reset();
        }
      }
    );
  }

  

  //abrir opendialog
  openUpdateDialog(obj: Ubicacion) {
    console.log(">>> openUpdateDialog [ini]");
    const dialogo = this.dialogService.open(CrudEspacioParqueoUpdateComponent, { data: obj });
    dialogo.afterClosed().subscribe(
      x => {
        console.log(">>> x >> " + x);
        if (x === 1) { // Se lleva 1 le doy refrescar a la tabla
          // Actualizamos la lista de parqueos después de registrar uno nuevo
          this.parqueosService.listarTodos().subscribe(
            (data: Parqueos[]) => {
              this.parqueos = data;
              // Agrupamos nuevamente los parqueos después de la actualización
              this.agruparPorUbicacion();
            },
            (error) => {
              console.error('Error al cargar los parqueos', error);
            }
          );
        }
      }
    );
    console.log(">>> openUpdateDialog [fin]");
  }

  //OPCION +NUEVO
  // Método para redirigir a la página de registro de ubicaciones
  redirigirARegistroUbicacion() {
    this.router.navigate(['/verCrudUbicacion']); // Aquí puedes poner la ruta de tu página de registro
  }

  redirigirAListaEspacios() {
    this.router.navigate(['/verListaEspacios']);
  }

}