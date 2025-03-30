import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UbicacionService } from '../../services/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TipoUbicacion } from '../../models/tipoUbicacion.model';
import { Parqueos } from '../../models/parqueos.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { ParqueosService } from '../../services/parqueos.service';
import Swal from 'sweetalert2';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
import { CrudUbicacionUpdateComponent } from '../crud-ubicacion-update/crud-ubicacion-update.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-ubicaciones',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule],
  templateUrl: './crud-ubicaciones.component.html',
  styleUrls: ['./crud-ubicaciones.component.css']


})
export class CrudUbicacionesComponent implements OnInit {
  lstUbicaciones: Ubicacion[] = []; // Se declara la propiedad lstPaises
  lstTipoUbicacion: TipoUbicacion[] = []; // Se declara la propiedad lstTipoParqueo
  lstEstadoEspacios: EstadoEspacios[] = []; // Se declara la propiedad lstEstadoEspacios
  parqueos: Parqueos[] = [];
  //--listado-- Este será el objeto donde vamos a agrupar los parqueos por ubicación
  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {}; // Definimos que cada clave es de tipo 'number' y el valor es un array de 'Parqueos'.


  objUbicacion: Ubicacion = {
    nombreUbicacion: "",
    tipoUbicacion: {
      idTipoUbicacion: -1
    },
    limiteParqueos: undefined,
    estadoEspacios: {
      idEstadoEspacios: 1
    }
  }

  objUsuario: Usuario = {};
  //2.VALIDACIONES
  formsRegistra = this.formBuilder.group({
    //aqui se define lo que se va a validar
    validaNombreUbicacion: ['', [Validators.required, Validators.pattern('^[a-zA-Zá-úÁ-ÚñÑ0-9 ]{3,30}$')]],
    validaTipoUbicacion: ['', Validators.min(1)],
    validaLimiteParqueos: ['', [Validators.required, Validators.min(1), Validators.max(300)]],
    validaEstadoEspacios: ['', Validators.min(1)]


  });
  //
  constructor(
    private router: Router, // PARA REDIRIGIR
    private dialogService: MatDialog,
    private tokenService: TokenService,
    private ubicacionService: UbicacionService,
    private parqueosService: ParqueosService,
    private utilService: UtilService,
    private formBuilder: FormBuilder
    //vldcn
  ) {
    this.utilService.listaTipoUbicacion().subscribe(x => this.lstTipoUbicacion = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);
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
    // Cargar lista de ubicaciones
    this.ubicacionService.listarTodos().subscribe(x => this.lstUbicaciones = x);

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
    this.utilService.listaEstadoEspacios().subscribe(x => {
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

  // Método de registro de ubiscacion
  registra() {
    this.objUbicacion.usuarioActualiza = this.objUsuario;
    this.objUbicacion.usuarioRegistro = this.objUsuario;
    this.ubicacionService.registrarUbicacion(this.objUbicacion).subscribe(
      x => {
        if (x.error) {
          // Si hay un error, mostramos el mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error en el Registro',
            text: x.error, // Aquí asumimos que `response.error` contiene el mensaje de error
          });
        } else {
          // Si no hay error, mostramos el mensaje de éxito
          Swal.fire({
            icon: 'success',
            title: 'Resultado del Registro',
            text: x.mensaje, // Aquí usamos `response.mensaje` si la actualización fue exitosa
          });

          //LISTADO
          // Actualizamos la lista de parqueos después de registrar uno nuevo
          this.ubicacionService.listarTodos().subscribe(
            (data: Ubicacion[]) => {
              this.lstUbicaciones = data;
              // Agrupamos nuevamente los parqueos después de la actualización
              this.agruparPorUbicacion();
            },
            (error) => {
              console.error('Error al cargar los parqueos', error);
            }
          );
          //FIN LISTADO

          // Limpiamos el formulario después de registrar
          this.objUbicacion = {
            nombreUbicacion: "",
            tipoUbicacion: {
              idTipoUbicacion: -1
            },
            limiteParqueos: undefined,
            estadoEspacios: {
              idEstadoEspacios: 1
            }
          };
          this.formsRegistra.reset();
        }
      }
    );
  }


  //abrir opendialog
  openUpdateDialog(obj: Ubicacion) {
    console.log(">>> openUpdateDialog [ini]");
    const dialogo = this.dialogService.open(CrudUbicacionUpdateComponent, { data: obj });
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

  redirigirAListaEspacios() {
    this.router.navigate(['/verListaEspacios']); 
  }

}