import { Component, Input, Output, EventEmitter, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

export interface TabData {
  id: string;
  label: string;
  icon?: string;
  content: string;
  componentType?: any; // For component references
  componentData?: any; // Data to pass to component
  disabled?: boolean;
  warning?: {
    text: string;
    links?: Array<{ text: string; url: string }>;
  };
}

@Component({
  selector: 'app-tab-interface',
  standalone: true,
  imports: [CommonModule, MatIconModule, SafeHtmlPipe],
  templateUrl: './tab-interface.component.html',
  styleUrls: ['./tab-interface.component.scss']
})
export class TabInterfaceComponent implements OnInit {
  @Input() tabs: TabData[] = [];
  @Input() activeTabId: string = '';
  @Input() showIcons: boolean = true;
  @Input() tabStyle: 'default' | 'minimal' | 'outlined' = 'default';
  @Input() responsive: boolean = true;
  @Input() allowTabClose: boolean = false;
  @Input() maxTabs?: number;

  @Output() tabChange = new EventEmitter<string>();
  @Output() tabClose = new EventEmitter<string>();

  activeTab: TabData | null = null;

  ngOnInit() {
    if (this.tabs.length > 0) {
      if (this.activeTabId && this.tabs.find(tab => tab.id === this.activeTabId)) {
        this.activeTab = this.tabs.find(tab => tab.id === this.activeTabId) || null;
      } else {
        this.activeTab = this.tabs[0];
        this.activeTabId = this.tabs[0].id;
      }
    }
  }

  selectTab(tab: TabData) {
    if (tab.disabled) return;

    this.activeTab = tab;
    this.activeTabId = tab.id;
    this.tabChange.emit(tab.id);
  }

  closeTab(tabId: string, event: Event) {
    event.stopPropagation();
    this.tabClose.emit(tabId);
  }

  isTabActive(tab: TabData): boolean {
    return this.activeTab?.id === tab.id;
  }

  getTabClass(tab: TabData): string {
    const classes = ['tab-item'];

    if (this.isTabActive(tab)) {
      classes.push('active');
    }

    if (tab.disabled) {
      classes.push('disabled');
    }

    if (this.tabStyle) {
      classes.push(`style-${this.tabStyle}`);
    }

    return classes.join(' ');
  }

  getTabContainerClass(): string {
    const classes = ['tab-container'];

    if (this.responsive) {
      classes.push('responsive');
    }

    if (this.tabStyle) {
      classes.push(`style-${this.tabStyle}`);
    }

    return classes.join(' ');
  }
}
