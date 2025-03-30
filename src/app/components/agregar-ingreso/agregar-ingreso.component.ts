import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { MatStepperModule } from '@angular/material/stepper';
import { UsuarioService } from '../../services/usuario.service';
import { TipoUsuario } from '../../models/tipoUsuario.model';
import { EspacioParqueoService } from '../../services/espacioParqueo.service';
import { ingresoVehicularService } from '../../services/ingresoVehicular.service';
import { Cliente } from '../../models/cliente.model';
import { Parqueo } from '../../models/parqueo.model';
import { AccesoVehicular } from '../../models/accesoVehicular.model';
import { UtilService } from '../../services/util.service';
import { forkJoin } from 'rxjs';
import { TipoVehiculo } from '../../models/tipoVehiculo.model';
import { Parqueos } from '../../models/parqueos.model';
import { Ubicacion } from '../../models/ubicacion.model';
import { ParqueosService } from '../../services/parqueos.service';
import { MatDialog } from '@angular/material/dialog';
import { CrudEspacioParqueoUpdateComponent } from '../crud-espacio-parqueo-update/crud-espacio-parqueo-update.component';
import { ModalListaEspaciosComponent } from '../modal-lista-espacios/modal-lista-espacios.component';
import { TipoParqueo } from '../../models/tipoParqueo.model';
import { EstadoEspacios } from '../../models/estadoEspacios.model';
@Component({
  selector: 'app-agregar-ingreso',
  standalone: true,
  imports: [AppMaterialModule,
    FormsModule, CommonModule, MenuComponent, ReactiveFormsModule, MatStepperModule],
  templateUrl: './agregar-ingreso.component.html',
  styleUrls: ['./agregar-ingreso.component.css'],
})

export class AgregarIngresoComponent implements OnInit {

  objAccesoVehicular: AccesoVehicular = {
    cliente: {
      identificador: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      idCliente: 0 // Añadir idCliente para evitar el error en el acceso
    },
    placaVehiculo: "",
    parqueos: {
      idParqueos: 0// Añadir idParqueo para evitar el error en el acceso
    }
  };

  objCliente: Cliente = {
    idCliente: 0,
    nombres: "",
    apellidos: "",
    identificador: "",
    telefono: "",
    numIncidencias: 0

  }

  espacioForm = this.formBuilder.group({
    espacio: ['', Validators.required],


  });

  formRegistraUsuarioa= this.formBuilder.group({});



  formRegistraUsuario = this.formBuilder.group({
    idCliente: [0], // Campo oculto que contiene el ID del cliente
    idUsuario: [0], // Campo oculto para el usuario autenticado
    idParqueos: [0], // Campo oculto para el parqueo
    idEspacio: [0], // Campo oculto para el espacio de parqueo
    tipoUsuario: ['', Validators.min(1)],
    dni: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[0-9]{8,12}$')]],
    nombres: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    apellidos: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$')]],
    tipoVehiculo: [{ value: '', disabled: false }, Validators.min(1)],
    placa: ['', [Validators.required, Validators.pattern('^[A-Z]{2}-\\d{3,5}$')]],
    cantPersonas: ['', [Validators.required, Validators.pattern('^[1-9]$')]],
    espacio: [0, []],
    telefono: ['', [Validators.required, Validators.minLength(7), Validators.pattern('^[9]{1}[0-9]{8}$')]],

  });


  // Variables para almacenar los espacios obtenidos de la API
  objetosEspaciosPP: Parqueos[] = [];
  objetosEspaciosPS: Parqueos[] = [];
  objetosEspaciosPSS: Parqueos[] = [];

  espaciosDiscapacitadoPP: string[] = [];
  espacioGerentePP: string[] = [];
  espaciosGeneralPP: string[] = [];

  espaciosDiscapacitadoPS: string[] = [];
  espacioGerentePS: string[] = [];
  espaciosGeneralPS: string[] = [];

  espaciosDiscapacitadoPSS: string[] = [];
  espacioGerentePSS: string[] = [];
  espaciosGeneralPSS: string[] = [];
  espacioSeleccionado: number = 0;
  ubicacionSeleccionada: string | null | undefined;

  mostrarNivelPrincipal: boolean = false;
  mostrarNivelSemiSotano: boolean = false;
  mostrarNivelSotano: boolean = false;
  registrarButtonDisabled: boolean = false;
  siguienteButtonDisabled: boolean = false;
  dataSource: any;
  filtro: string = '';
  varDni: string = '';

  parqueosPorUbicacion: { [key: number]: Parqueos[] } = {}; // Definimos que cada clave es de tipo 'number' y el valor es un array de 'Parqueos'.
  lstUbicaciones: Ubicacion[] = []; // Se declara la propiedad lstPaises
  parqueos: Parqueos[] = [];
  lstTipoParqueo: TipoParqueo[] = [];
  lstTipoVehiculo: TipoVehiculo[] = [];
  lstEstadoEspacios: EstadoEspacios[] = [];

  objUsuario: Usuario = {};
  objParqueo: Parqueo = {};
  objEspacio: Parqueos = {};

  dni = '';
  varNombres = '';
  varApellidos = '';
  varTelefono: number = 0;
  varIdTipoUsuario: number = -1;
  lstTipoUsuario: TipoUsuario[] = [];
  esClienteNuevo: number  =0;
  horaIngreso: Date = new Date();
  formattedDate = this.horaIngreso.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
    // Variable para indicar si hubo error en la búsqueda
    errorEnBusqueda: boolean = false;


    tipoVehiculo: TipoVehiculo ={
      nombreTipoVehiculo: ""
    }



  
  constructor(
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private ingresoVehicularService: ingresoVehicularService,
    private formBuilder: FormBuilder,
    private espaciService: EspacioParqueoService,
    private utilService: UtilService,
    private parqueosService:  ParqueosService,
    private dialogService: MatDialog,

  ) {

    this.utilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);


    this.objUsuario.idUsuario = this.tokenService.getUserId();

    // Cargar listas al iniciar
    this.utilService.listaUbicacion().subscribe(x => this.lstUbicaciones = x);
    this.utilService.listaTipoParqueo().subscribe(x => this.lstTipoParqueo = x);
    this.utilService.listaTipoVehiculo().subscribe(x => this.lstTipoVehiculo = x);
    this.utilService.listaEstadoEspacios().subscribe(x => this.lstEstadoEspacios = x);

  }

  
  

  ngOnInit(): void {
    // this.loadWatsonAssistant();


      this.formRegistraUsuario.patchValue({
        idUsuario: this.tokenService.getUserId()
      });

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



    
/*
      this.formRegistraUsuario.get('tipoUsuario')?.valueChanges.subscribe((valor) => {
        if (valor && valor !== '-1') {
          this.formRegistraVehiculo.get('tipoVehiculo')?.enable(); // Habilitar si se selecciona un tipo de usuario
        } else {
          this.formRegistraVehiculo.get('tipoVehiculo')?.disable(); // Deshabilitar si no hay selección válida
          this.formRegistraVehiculo.ge t('tipoVehiculo')?.reset(); // Limpiar el valor si se deshabilita
        }
      });
*/
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



  obtenerClienteId(identificador: string) {
    this.utilService.obtenerIdCliente(identificador).subscribe(
      idCliente => {
        this.formRegistraUsuario.patchValue({ idCliente: idCliente ?? 0 });
      },
      error => console.error('Error al obtener idCliente:', error)
    );
  }

  obtenerParqueoId(tipoVehiculo: string) {
    this.utilService.obtenerIdParqueo(tipoVehiculo).subscribe(
      idParqueo => {
        this.formRegistraUsuario.patchValue({ idParqueos: idParqueo ?? 0 });
      },
      error => console.error('Error al obtener idParqueo:', error)
    );
  }
  obtenerEspacioId(numeroEspacio: number) {
    this.utilService.obtenerIdEspacio(numeroEspacio).subscribe(
      idEspacio => {
        this.formRegistraUsuario.patchValue({ idEspacio: idEspacio ?? 0 });
      },
      error => console.error('Error al obtener idEspacio:', error)
    );
  }

// Método para obtener el idUbicacion basado en el parqueo seleccionado
getIdUbicacionFromParqueo(parqueoId: number): number | undefined {
  for (let ubicacion of this.lstUbicaciones) {
    if (ubicacion.idUbicacion !== undefined) {  // Verificamos que idUbicacion no sea undefined
      const parqueos = this.parqueosPorUbicacion[ubicacion.idUbicacion];
      if (parqueos?.some(parqueo => parqueo.idParqueos === parqueoId)) {
        return ubicacion.idUbicacion;  // Devolvemos el idUbicacion correspondiente
      }
    }
  }
  return undefined;  // Si no encontramos la ubicación, devolvemos undefined
}

  guardarDatos() {
    console.log("Iniciando guardarDatos...");

    // Inicializar objAccesoVehicular con los datos del formulario, asignando IDs si están presentes
    this.objAccesoVehicular = {
      cliente: { idCliente: this.formRegistraUsuario.get('idCliente')?.value || 0 },
      usuario: { idUsuario: this.formRegistraUsuario.get('idUsuario')?.value || 0 },
      parqueos: { idParqueos:  this.espacioSeleccionado },
      ubicacion: { 
        idUbicacion: this.getIdUbicacionFromParqueo(this.espacioSeleccionado)
      },      placaVehiculo: this.formRegistraUsuario.get('placa')?.value || ''
    };

    console.log("PRIMERA DEPURACION");
    console.log("Cliente ID inicial:", this.objAccesoVehicular.cliente?.idCliente);
    console.log("Cliente:", this.objAccesoVehicular.cliente);
    console.log("Usuario:", this.objAccesoVehicular.usuario);
    console.log("Parqueo:", this.objAccesoVehicular.parqueos);
    console.log("Ubicacion:", this.objAccesoVehicular.ubicacion);


    const requests = [];

    if (this.objAccesoVehicular.cliente && !this.objAccesoVehicular.cliente.idCliente) {
      const dni = this.formRegistraUsuario.get('dni')?.value;
      if (dni) {
        requests.push(this.utilService.obtenerIdCliente(dni));
      }
    }

    if (this.objAccesoVehicular.parqueos && !this.objAccesoVehicular.parqueos.idParqueos) {
      const tipoVehiculo = this.formRegistraUsuario.get('tipoVehiculo')?.value;
      if (tipoVehiculo) {
        requests.push(this.utilService.obtenerIdParqueo(tipoVehiculo));
      }
    }



    console.log("SEGUNDA DEPURACION");
    console.log("Cliente ID antes de forkJoin:", this.objAccesoVehicular.cliente?.idCliente);
    console.log("Parqueo ID antes de forkJoin:", this.objAccesoVehicular.parqueos?.idParqueos);
    console.log("Ubicacion ID antes de forkJoin:", this.objAccesoVehicular.parqueos?.ubicacion);
    console.log("Tipo de vehiculo ID antes de forkJoin:", this.objAccesoVehicular.parqueos?.tipoVehiculo);


    if (requests.length > 0) {
      forkJoin(requests).subscribe(
        (resultados) => {
          console.log("Resultados de forkJoin:", resultados);

          // Asignar los resultados a los campos correspondientes, asegurando que los objetos existan
              if (resultados[0]) {
                this.objAccesoVehicular.cliente = this.objAccesoVehicular.cliente || {}; // Inicializar si es undefined
                this.objAccesoVehicular.cliente.idCliente = resultados[0];
                console.log("ID Cliente asignado:", resultados[0]);
              }

              if (resultados[1]) {
                this.objAccesoVehicular.parqueos = this.objAccesoVehicular.parqueos || {}; // Inicializar si es undefined
                this.objAccesoVehicular.parqueos.idParqueos = resultados[1];
                console.log("ID Parqueo asignado:", resultados[1]);
              }

          // Registrar el acceso vehicular con los IDs asignados
          console.log("OBJETO PARA REGISTRO DESPUÉS DE forkJoin:", this.objAccesoVehicular);

          this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({

            next: (response) => {
              Swal.fire({
                icon: 'info',
                title: 'Registro Exitoso',
                text: response.mensaje,
              });
              console.log('Registro completado:', this.objAccesoVehicular);
            },
            error: (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: 'Registro no completado.',
              });
              console.error('Error en el registro:', error);
              console.error('JSON DEL REGISTRO:', this.objAccesoVehicular);
            },
            complete: () => {
              console.log('Proceso de registro completado.');
            }
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al obtener los datos necesarios.',
          });
          console.error('Error en las peticiones de IDs:', error);
        }
      );
    } else {
      // Si no hay requests pendientes, proceder con el registro directamente
      console.log("No se necesitan peticiones adicionales, registrando acceso vehicular...");

      this.ingresoVehicularService.registrarAccesoVehicular(this.objAccesoVehicular).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'info',
            title: 'Resultado del Registro',
            text: response.mensaje,
          });
          console.log('Registro completado:', this.objAccesoVehicular);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error en el registro',
            text: 'Registro no completado.',
          });
          console.error('Error en el registro:', error);
          console.error('JSON DEL REGISTRO:', this.objAccesoVehicular);
        },
        complete: () => {
          console.log('Proceso de registro completado.');
        }
      });
    }
  }

// Método para formatear la fecha en "yyyy-MM-dd hh:mm:ss"
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



buscarUsuarioPorDni(){
  console.log(">>> Filtrar EXCEL [ini]");
  console.log(">>> varDni: "+ this.varDni);

  this.usuarioService.buscarUsuarioDni(

    this.varDni
    ).subscribe(
      (x) => {
        this.dataSource = x;
        // Asegurarse de que los datos existan antes de usarlos
        if (this.dataSource && this.dataSource.length > 0) {
          const usuario = this.dataSource[0]; // Si es una lista, accede al primer usuario
          // Llenar los campos del formulario con los datos traídos
          this.formRegistraUsuario.patchValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos
          });
          console.log(">>> data: " + usuario.nombres);
        } else {
          console.log(">>> Usuario no encontrado");
          // Limpiar los campos si no hay resultados
          this.formRegistraUsuario.patchValue({
            nombres: '',
            apellidos: ''
          });
        }
      },
      (error) => {
        console.log(">>> Error al buscar por DNI: ", error);
        this.limpiarFormulario();
      }
    );
 
    console.log(">>> Filtrar [fin]");
  }


  mostrarFormularioRegistro() {
    this.formRegistraUsuario.patchValue({
      nombres: '',
      apellidos: '',
      telefono: ''
    });
  
    this.formRegistraUsuario.get('nombres')?.enable();
    this.formRegistraUsuario.get('apellidos')?.enable();
    this.formRegistraUsuario.get('telefono')?.enable();
  
    // Habilitamos el botón de "Registrar"
    this.registrarButtonDisabled = false;
  }
  
  buscarClientePorDni() {
    console.log('DNI buscado:', this.varDni);

    this.usuarioService.buscarClientePorDni(this.varDni).subscribe(
      (response) => {
        this.dataSource = response;
        console.log('Respuesta del servicio:', this.dataSource);

        if (this.dataSource && this.dataSource.length > 0) {
          const usuario = this.dataSource[0];
          console.log('Usuario encontrado:', usuario);

          // Actualizamos los valores del formulario y de las variables
          this.formRegistraUsuario.patchValue({
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
          });
          this.formRegistraUsuario.get('nombres')?.disable();
          this.formRegistraUsuario.get('apellidos')?.disable();

          this.varNombres = usuario.nombres;
          this.varApellidos = usuario.apellidos;

          // Cliente ya existe, es un cliente conocido, no es nuevo
          this.esClienteNuevo = 0;

          // Habilitamos el botón Siguiente
          this.siguienteButtonDisabled = false;
        } else {
          // Cliente no encontrado, es un cliente nuevo
          this.esClienteNuevo = 1;
          console.log('Cliente no encontrado, es nuevo.');

          // Mostramos la alerta
          Swal.fire({
            title: 'Cliente no encontrado',
            text: 'Por favor completar los campos de registros correspondientes',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Registrar Cliente"
          }).then((result) => {
            if (result.isConfirmed) {
              // Si el usuario acepta, mostramos el formulario para registrar al cliente
              this.mostrarFormularioRegistro();
            } else {
              // Si cancela, limpiamos el formulario
              this.formRegistraUsuario.reset();
              this.siguienteButtonDisabled = true;
            }
          });
        }
      },
      (error) => {
        console.error('Error al buscar por DNI:', error);
        this.limpiarFormulario();
      }
    );
  }

  // Función que maneja el botón "Next"
  onNextButtonClick() {
    if (this.esClienteNuevo === 1) {
      // Si es un cliente nuevo, registramos
      this.registrarCliente();
    } else {
      // Si no es nuevo, no hacemos nada (o tal vez redirigimos a otro paso)
      console.log('El cliente ya existe. No se realiza el registro.');
    }
  }


    
  registrarCliente() {
    const nuevoCliente: Cliente = {
      identificador: this.formRegistraUsuario.get('dni')?.value ?? '',
      nombres: this.formRegistraUsuario.get('nombres')?.value ?? '',
      apellidos: this.formRegistraUsuario.get('apellidos')?.value ?? '',
      telefono: this.formRegistraUsuario.get('telefono')?.value ?? ''
    };

      this.ingresoVehicularService.registrarCliente(nuevoCliente).subscribe({
      next: (response) => {
        console.log("Nuevo cliente creado:", response);
        this.formRegistraUsuario.patchValue({ idCliente: response.idCliente });
      },
      error: (error) => {
        console.error("Error al crear cliente:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'No se pudo registrar el cliente.',
        });
      }
    });
  }


  limpiarFormulario() {
    this.formRegistraUsuario.patchValue({ nombres: '', apellidos: '' });
    this.varNombres = '';
    this.varApellidos = '';
  }
  seleccionarEspacioN(espacio: number | undefined): void {


    if (espacio !== undefined) {
      this.espacioSeleccionado = espacio; 
      this.formRegistraUsuario.patchValue({ espacio });
  
      // Buscar la ubicación asociada al espacio seleccionado
      for (let ubicacion of this.lstUbicaciones) {
        if (ubicacion.idUbicacion !== undefined) { // Asegurarse de que idUbicacion no sea undefined
          const parqueos = this.parqueosPorUbicacion[ubicacion.idUbicacion];
          if (parqueos?.some(parqueo => parqueo.idParqueos === espacio)) {
            this.ubicacionSeleccionada = ubicacion.nombreUbicacion;
            break;
          }
        }
      }
      console.log('Espacio seleccionado:', espacio);
    } else {
      console.warn('El espacio seleccionado es undefined');
    }
  }
  
  
  
  // Manejo de tipo de vehículo
  onTipoVehiculoChange(tipo: string) {
    this.mostrarNivelPrincipal = false;
    this.mostrarNivelSotano = false;
    this.mostrarNivelSemiSotano = false;

    if (tipo === "Automovil") {
      this.mostrarNivelPrincipal = true;
      this.mostrarNivelSotano = true;
    } else if (tipo === "Motocicleta") {
      this.mostrarNivelSemiSotano = true;
    }
  }

// Selección de espacio
  seleccionarEspacio(espacio: string | number | undefined) {
    if (espacio === undefined) {
      console.warn('Espacio no válido seleccionado.');
      return;
    }
    this.espacioSeleccionado = Number(espacio);
  }

  guardarNombresApe() {
    const nombresBuscado = this.formRegistraUsuario.get('nombres')?.value ?? '';
    const apellidosBuscado = this.formRegistraUsuario.get('apellidos')?.value ?? '';
    const tipoVehiculo = this.formRegistraUsuario.get('tipoVehiculo')?.value ?? '';

    this.tipoVehiculo.nombreTipoVehiculo = tipoVehiculo;
    this.varNombres= nombresBuscado;
    this.varApellidos = apellidosBuscado;

    console.log('Tipo de Vehiculo guardado:', this.tipoVehiculo);
    console.log('Nombres guardados:', this.varNombres);
    console.log('Apellidos guardados:', this.varApellidos);  
  }


  habilitarBtnSiguienteRegistroUsuario() {
    if (this.formRegistraUsuario.controls.nombres.value?.trim() === "" 
    || this.formRegistraUsuario.controls.apellidos.value?.trim() === "" 
    || this.formRegistraUsuario.invalid === true) {
      return true;
    } else {
      return false;
    }
  }

  habilitarBtnSiguienteRegistroVehiculo(){
    if (this.formRegistraUsuario.invalid === true || this.espacioSeleccionado === 0) {
      //console.log("hay campos vacíos en vehículo");
      return true;
    } else {
      return false;
    }
  }


agruparPorUbicacion() {
  this.parqueosPorUbicacion = {}; // Limpiamos el objeto antes de agrupar
  this.parqueos.forEach(parqueo => {
    const idUbicacion = parqueo.ubicacion?.idUbicacion;
    console.log(`Procesando parqueo con idUbicacion: ${idUbicacion}`);  // Verifica si idUbicacion existe
    if (idUbicacion !== undefined) {
      if (!this.parqueosPorUbicacion[idUbicacion]) {
        this.parqueosPorUbicacion[idUbicacion] = [];
      }
      this.parqueosPorUbicacion[idUbicacion].push(parqueo);
    }
  });
  console.log('parqueosPorUbicacion:', this.parqueosPorUbicacion); // Verifica si el objeto está agrupado correctamente
}


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


  

}