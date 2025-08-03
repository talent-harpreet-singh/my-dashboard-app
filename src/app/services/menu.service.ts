import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface MenuItem {
  menuOptionNo: number;
  parentMenuOptNo: number;
  menuOptionTx: string;
  slugTx: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menus: MenuItem[] = [
    // Main Menu 1
    { menuOptionNo: 1, parentMenuOptNo: 0, menuOptionTx: 'Dashboard', slugTx: 'dashboard' },
    { menuOptionNo: 2, parentMenuOptNo: 1, menuOptionTx: 'Analytics', slugTx: 'rule-editor' },
    { menuOptionNo: 3, parentMenuOptNo: 1, menuOptionTx: 'Reports', slugTx: 'reports' },

    // Main Menu 2
    { menuOptionNo: 4, parentMenuOptNo: 0, menuOptionTx: 'Settings', slugTx: 'settings' },
    { menuOptionNo: 5, parentMenuOptNo: 4, menuOptionTx: 'User Settings', slugTx: 'settings-users' },
    { menuOptionNo: 6, parentMenuOptNo: 4, menuOptionTx: 'System Settings', slugTx: 'settings-system' },

    // Tab Demo
    { menuOptionNo: 7, parentMenuOptNo: 0, menuOptionTx: 'Tab Demo', slugTx: 'tab-demo' },
    
    // Dynamic Form Demo
    { menuOptionNo: 8, parentMenuOptNo: 0, menuOptionTx: 'Dynamic Form Demo', slugTx: 'dynamic-form-demo' },
  ];

  constructor() {}

  getMenuItems(): Observable<MenuItem[]> {
    return of(this.menus);
  }
}
