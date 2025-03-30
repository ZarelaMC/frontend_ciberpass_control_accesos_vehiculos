import { Component, OnInit } from '@angular/core';
import { Opcion } from '../security/opcion';
import { TokenService } from '../security/token.service';
import { RouterLink } from '@angular/router';
import { AppMaterialModule } from '../app.material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ RouterLink, AppMaterialModule, FormsModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isLogged = false;
  opciones : Opcion[] = [];

  nombreUsuario = "";

  constructor(private tokenService: TokenService) {
    console.log("MenuComponent >>> constructor >>> " + this.tokenService.getToken());
  }

  ngOnInit() {
    console.log("MenuComponent >>> ngOnInit >>> ");

    this.opciones = this.tokenService.getOpciones().filter( x => x.tipo === 1);

    

    console.log("MenuComponent >>> ngOnInit >>> " + this.tokenService.getToken());
    if (this.tokenService.getToken()) {
      console.log("MenuComponent >>> this.isLogged = true >>> ");
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserNameComplete()|| '{}';
    } else {
      console.log("MenuComponent >>> this.isLogged = false >>> ");
      this.isLogged = false;
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

}