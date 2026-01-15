import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuService, MenuItem } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  styleUrls: ['../../styles/navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() collapsed = new EventEmitter<boolean>();
  menus: MenuItem[] = [];
  mainMenus: MenuItem[] = [];
  openDropdownId: number | null = null;
  isCollapsed = false;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenuItems().subscribe((data: MenuItem[]) => {
      this.menus = data;
      this.mainMenus = data.filter(m => m.parentMenuOptNo === 0);
    });
  }

  getMenuIcon(menuText: string): string {
    const iconMap: { [key: string]: string } = {
      'Dashboard': 'dashboard',
      'Settings': 'settings',
      'Analytics': 'analytics',
      'Reports': 'assessment',
      'User Settings': 'person',
      'System Settings': 'tune',
      'Tab Demo': 'tab',
      'Dynamic Form Demo': 'dynamic_form',
      'Dynamic Table Demo': 'table_chart',
      'Merchant Match': 'store',
      'Statement Credit': 'credit_card'
    };
    return iconMap[menuText] || 'folder';
  }

  toggleDropdown(menuId: number): void {
    this.openDropdownId = this.openDropdownId === menuId ? null : menuId;
  }

  getSubMenus(menuId: number): MenuItem[] {
    return this.menus.filter(m => m.parentMenuOptNo === menuId);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsed.emit(this.isCollapsed);
  }
}
