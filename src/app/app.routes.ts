import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { IndexComponent } from './index/index.component';
// import { AgregarSalidaComponent } from './components/agregarar-salida/agregar-salida.component';
import { AgregarIngresoComponent } from './components/agregar-ingreso/agregar-ingreso.component';
//import { CrudEspacioParqueoComponent } from './components/crud-EspacioParqueo/crud-EspacioParqueo.component';
import { AgregarParqueosComponent } from './components/crud-EspacioParqueo/crud-EspacioParqueo.component';
import { InfoProblemasIngresoComponent } from './components/info-problemas-ingreso/info-problemas-ingreso.component';
import { CrudUbicacionesComponent } from './components/crud-ubicaciones/crud-ubicaciones.component';
import { AddSalidaVehicularComponent } from './components/add-salida-vehicular/add-salida-vehicular.component';
import { ListaEspaciosComponent } from './components/lista-espacios/lista-espacios.component';
import { incidenciasComponent } from './components/Incidencias_Consulta/incidencias_listado.component';

export const routes: Routes = [
    {path:"verRegistroIngreso", component:AgregarIngresoComponent },
    {path:"verRegistroSalida", component:AddSalidaVehicularComponent },
    {path:"verGestionIncidencias", component:incidenciasComponent },
    {path:"verGestionZonasParqueo", component:AgregarParqueosComponent },
    {path:"verGestionPlazasEspacios", component:ListaEspaciosComponent},  
    {path:"verReportes", component:ListaEspaciosComponent},  

    {path:"verCrudUbicacion", component:CrudUbicacionesComponent },
    {path:"verEspacioParqueo", component:AgregarParqueosComponent },
    {path:"verListaEspacios", component:ListaEspaciosComponent},
    {path:"verInfoProblemasIngreso", component:InfoProblemasIngresoComponent},
  
    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }

    
  ];
  
