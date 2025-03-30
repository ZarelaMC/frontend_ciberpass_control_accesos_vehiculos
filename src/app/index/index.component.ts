import { Component, OnInit } from '@angular/core';
import { TokenService } from '../security/token.service';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  imports: [MenuComponent]
})
export class IndexComponent implements OnInit {
  isLogged = false;

  intervalId: any;
  private nombreUsuario = "";

  constructor(private tokenService: TokenService) {}

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
    }

  }

}
