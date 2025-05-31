import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NavbarComponent, CommonModule, RouterModule],
  standalone: true
})
export class AppComponent {
  isNavbarCollapsed = false;

  onNavbarCollapsed(collapsed: boolean) {
    this.isNavbarCollapsed = collapsed;
  }
}
