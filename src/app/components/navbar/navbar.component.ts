import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { MenuService, MenuItem } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  isMobileMenuOpen = false;

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isCollapsed = false;
      this.collapsed.emit(false);
    }
  }

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
      'Statement Credit': 'credit_card',
      'Search Form Demo': 'search'
    };
    return iconMap[menuText] || 'folder';
  }

  toggleDropdown(menuId: number): void {
    this.openDropdownId = this.openDropdownId === menuId ? null : menuId;
  }

  /** Expand sidebar when collapsed so labels/submenus are usable after icon click */
  onNavMainClick(menuId: number): void {
    if (this.isCollapsed) {
      this.isCollapsed = false;
      this.collapsed.emit(false);
    }
    this.toggleDropdown(menuId);
  }

  getSubMenus(menuId: number): MenuItem[] {
    return this.menus.filter(m => m.parentMenuOptNo === menuId);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsed.emit(this.isCollapsed);
  }
}
