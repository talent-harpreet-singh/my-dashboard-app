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
    { menuOptionNo: 9, parentMenuOptNo: 1, menuOptionTx: 'Tier Profile Details', slugTx: 'tier-profile-details' },

    // Main Menu 2
    { menuOptionNo: 4, parentMenuOptNo: 0, menuOptionTx: 'Settings', slugTx: 'settings' },
    { menuOptionNo: 5, parentMenuOptNo: 4, menuOptionTx: 'User Settings', slugTx: 'settings-users' },
    { menuOptionNo: 6, parentMenuOptNo: 4, menuOptionTx: 'System Settings', slugTx: 'settings-system' },

    // Tab Demo
    { menuOptionNo: 7, parentMenuOptNo: 0, menuOptionTx: 'Tab Demo', slugTx: 'tab-demo' },
    
    // Dynamic Form Demo
    { menuOptionNo: 8, parentMenuOptNo: 0, menuOptionTx: 'Dynamic Form Demo', slugTx: 'dynamic-form-demo' },
    
    // Dynamic Table Demo
    { menuOptionNo: 10, parentMenuOptNo: 0, menuOptionTx: 'Dynamic Table Demo', slugTx: 'dynamic-table-demo' },
    
    // Merchant Match
    { menuOptionNo: 11, parentMenuOptNo: 0, menuOptionTx: 'Merchant Match', slugTx: 'merchant-match' },
    
    // Statement Credit
    { menuOptionNo: 12, parentMenuOptNo: 0, menuOptionTx: 'Statement Credit', slugTx: 'statement-credit' },
    
    // Search Form Demo
    { menuOptionNo: 13, parentMenuOptNo: 0, menuOptionTx: 'Search Form Demo', slugTx: 'search-form-demo' },
  ];

  constructor() {}

  getMenuItems(): Observable<MenuItem[]> {
    return of(this.menus);
  }
}
