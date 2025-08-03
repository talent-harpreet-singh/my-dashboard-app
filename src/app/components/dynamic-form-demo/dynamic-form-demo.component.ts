import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../common/dynamic-form/dynamic-form.component';
import { FormField } from '../../models/form-model';

@Component({
  selector: 'app-dynamic-form-demo',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <div class="demo-container">
      <h1>Dynamic Form Examples</h1>
      
      <div class="example-section">
        <h2>Example 1: Cascading Dropdowns (Promo Data)</h2>
        <app-dynamic-form
          [title]="'Promo Data Details'"
          [fields]="visiblePromoFields"
          [formData]="promoFormData"
          (fieldChange)="onPromoFieldChange($event)"
        ></app-dynamic-form>
      </div>

      <div class="example-section">
        <h2>Example 2: Conditional Fields Based on Selection</h2>
        <app-dynamic-form
          [title]="'User Registration Form'"
          [fields]="visibleUserFields"
          [formData]="userFormData"
          (fieldChange)="onUserFieldChange($event)"
        ></app-dynamic-form>
      </div>

      <div class="example-section">
        <h2>Example 3: Multi-Step Configuration</h2>
        <app-dynamic-form
          [title]="'Product Configuration'"
          [fields]="visibleProductFields"
          [formData]="productFormData"
          (fieldChange)="onProductFieldChange($event)"
        ></app-dynamic-form>
      </div>

      <div class="example-section">
        <h2>Example 4: Dynamic Validation Fields</h2>
        <app-dynamic-form
          [title]="'Payment Information'"
          [fields]="visiblePaymentFields"
          [formData]="paymentFormData"
          (fieldChange)="onPaymentFieldChange($event)"
        ></app-dynamic-form>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
    width: 88rem;
      max-width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    
    .demo-container h1 {
      text-align: center;
      color: #1a4da0;
      margin: 0;
      padding: 20px 0;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .example-section {
      margin: 0;
      padding: 0;
      border: none;
      border-radius: 0;
      background: transparent;
    }
    
    .example-section h2 {
      color: #333;
      margin: 0;
      padding: 20px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      font-size: 1.3rem;
    }
  `]
})
export class DynamicFormDemoComponent {
  // Example 1: Promo Data Form
  promoFormData: any = {
    lob: '',
    promoLevel: '',
    parentHierarchy: '',
    parentNode: '',
    promo: '',
    type: '',
    numberOfDays: '',
    spendQualifier: '',
    otherQualifier: '',
    viewableNumberOfDays: '',
    priority: '',
    storedProcDisplay: '',
    earnCap: '',
    spendCap: ''
  };
  promoFields: FormField[] = [
    {
      key: 'lob',
      label: 'LOB',
      type: 'select',
      options: [
        { value: 'Consumer', label: 'Consumer' },
        { value: 'Commercial', label: 'Commercial' }
      ]
    },
    {
      key: 'promoLevel',
      label: 'Promo Level',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ]
    },
    {
      key: 'parentHierarchy',
      label: 'Parent Hierarchy',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ]
    },
    {
      key: 'parentNode',
      label: 'Parent Node',
      type: 'select',
      options: []
    },
    {
      key: 'promo',
      label: 'Promo',
      type: 'select',
      options: []
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 'New Account', label: 'New Account' },
        { value: 'Existing Account', label: 'Existing Account' }
      ]
    },
    {
      key: 'numberOfDays',
      label: 'Number of Days',
      type: 'number'
    },
    {
      key: 'spendQualifier',
      label: 'Spend Qualifier',
      type: 'text'
    },
    {
      key: 'otherQualifier',
      label: 'Other Qualifier',
      type: 'text'
    },
    {
      key: 'viewableNumberOfDays',
      label: 'Viewable Number of Days',
      type: 'number'
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'number'
    },
    {
      key: 'storedProcDisplay',
      label: 'Stored Proc Display',
      type: 'select',
      options: [
        { value: 'YES', label: 'YES' },
        { value: 'NO', label: 'NO' }
      ]
    },
    {
      key: 'earnCap',
      label: 'Earn Cap',
      type: 'number'
    },
    {
      key: 'spendCap',
      label: 'Spend Cap',
      type: 'number'
    }
  ];

  // Example 2: User Registration Form
  userFormData: any = {
    userType: '',
    firstName: '',
    lastName: '',
    companyName: '',
    businessType: '',
    studentId: '',
    university: '',
    graduationYear: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
  userFields: FormField[] = [
    {
      key: 'userType',
      label: 'User Type',
      type: 'select',
      options: [
        { value: 'individual', label: 'Individual' },
        { value: 'business', label: 'Business' },
        { value: 'student', label: 'Student' }
      ]
    },
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text'
    },
    {
      key: 'companyName',
      label: 'Company Name',
      type: 'text'
    },
    {
      key: 'businessType',
      label: 'Business Type',
      type: 'select',
      options: [
        { value: 'startup', label: 'Startup' },
        { value: 'sme', label: 'Small & Medium Enterprise' },
        { value: 'enterprise', label: 'Enterprise' }
      ]
    },
    {
      key: 'studentId',
      label: 'Student ID',
      type: 'text'
    },
    {
      key: 'university',
      label: 'University',
      type: 'text'
    },
    {
      key: 'graduationYear',
      label: 'Graduation Year',
      type: 'number'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text'
    },
    {
      key: 'address',
      label: 'Address',
      type: 'text'
    },
    {
      key: 'city',
      label: 'City',
      type: 'text'
    },
    {
      key: 'state',
      label: 'State',
      type: 'text'
    },
    {
      key: 'zipCode',
      label: 'ZIP Code',
      type: 'text'
    }
  ];

  // Example 3: Product Configuration
  productFormData: any = {
    productCategory: '',
    electronicsType: '',
    clothingType: '',
    bookGenre: '',
    furnitureType: '',
    brand: '',
    model: '',
    color: '',
    size: '',
    material: '',
    price: '',
    warranty: '',
    inStock: '',
    stockQuantity: ''
  };
  productFields: FormField[] = [
    {
      key: 'productCategory',
      label: 'Product Category',
      type: 'select',
      options: [
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'books', label: 'Books' },
        { value: 'furniture', label: 'Furniture' }
      ]
    },
    {
      key: 'electronicsType',
      label: 'Electronics Type',
      type: 'select',
      options: [
        { value: 'smartphone', label: 'Smartphone' },
        { value: 'laptop', label: 'Laptop' },
        { value: 'tablet', label: 'Tablet' },
        { value: 'accessories', label: 'Accessories' }
      ]
    },
    {
      key: 'clothingType',
      label: 'Clothing Type',
      type: 'select',
      options: [
        { value: 'men', label: 'Men' },
        { value: 'women', label: 'Women' },
        { value: 'kids', label: 'Kids' },
        { value: 'unisex', label: 'Unisex' }
      ]
    },
    {
      key: 'bookGenre',
      label: 'Book Genre',
      type: 'select',
      options: [
        { value: 'fiction', label: 'Fiction' },
        { value: 'non-fiction', label: 'Non-Fiction' },
        { value: 'academic', label: 'Academic' },
        { value: 'children', label: 'Children' }
      ]
    },
    {
      key: 'furnitureType',
      label: 'Furniture Type',
      type: 'select',
      options: [
        { value: 'living-room', label: 'Living Room' },
        { value: 'bedroom', label: 'Bedroom' },
        { value: 'kitchen', label: 'Kitchen' },
        { value: 'office', label: 'Office' }
      ]
    },
    {
      key: 'brand',
      label: 'Brand',
      type: 'text'
    },
    {
      key: 'model',
      label: 'Model',
      type: 'text'
    },
    {
      key: 'color',
      label: 'Color',
      type: 'text'
    },
    {
      key: 'size',
      label: 'Size',
      type: 'text'
    },
    {
      key: 'material',
      label: 'Material',
      type: 'text'
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number'
    },
    {
      key: 'warranty',
      label: 'Warranty (months)',
      type: 'number'
    },
    {
      key: 'inStock',
      label: 'In Stock',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      key: 'stockQuantity',
      label: 'Stock Quantity',
      type: 'number'
    }
  ];

  // Example 4: Payment Information
  paymentFormData: any = {
    paymentMethod: '',
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    cryptoType: '',
    walletAddress: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: ''
  };
  paymentFields: FormField[] = [
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: 'credit-card', label: 'Credit Card' },
        { value: 'debit-card', label: 'Debit Card' },
        { value: 'bank-transfer', label: 'Bank Transfer' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'crypto', label: 'Cryptocurrency' }
      ]
    },
    {
      key: 'cardNumber',
      label: 'Card Number',
      type: 'text'
    },
    {
      key: 'cardHolder',
      label: 'Card Holder Name',
      type: 'text'
    },
    {
      key: 'expiryMonth',
      label: 'Expiry Month',
      type: 'select',
      options: [
        { value: '01', label: '01' }, { value: '02', label: '02' },
        { value: '03', label: '03' }, { value: '04', label: '04' },
        { value: '05', label: '05' }, { value: '06', label: '06' },
        { value: '07', label: '07' }, { value: '08', label: '08' },
        { value: '09', label: '09' }, { value: '10', label: '10' },
        { value: '11', label: '11' }, { value: '12', label: '12' }
      ]
    },
    {
      key: 'expiryYear',
      label: 'Expiry Year',
      type: 'select',
      options: [
        { value: '2024', label: '2024' }, { value: '2025', label: '2025' },
        { value: '2026', label: '2026' }, { value: '2027', label: '2027' },
        { value: '2028', label: '2028' }, { value: '2029', label: '2029' },
        { value: '2030', label: '2030' }
      ]
    },
    {
      key: 'cvv',
      label: 'CVV',
      type: 'text'
    },
    {
      key: 'bankName',
      label: 'Bank Name',
      type: 'text'
    },
    {
      key: 'accountNumber',
      label: 'Account Number',
      type: 'text'
    },
    {
      key: 'routingNumber',
      label: 'Routing Number',
      type: 'text'
    },
    {
      key: 'paypalEmail',
      label: 'PayPal Email',
      type: 'text'
    },
    {
      key: 'cryptoType',
      label: 'Cryptocurrency Type',
      type: 'select',
      options: [
        { value: 'bitcoin', label: 'Bitcoin' },
        { value: 'ethereum', label: 'Ethereum' },
        { value: 'litecoin', label: 'Litecoin' },
        { value: 'cardano', label: 'Cardano' }
      ]
    },
    {
      key: 'walletAddress',
      label: 'Wallet Address',
      type: 'text'
    },
    {
      key: 'billingAddress',
      label: 'Billing Address',
      type: 'text'
    },
    {
      key: 'billingCity',
      label: 'Billing City',
      type: 'text'
    },
    {
      key: 'billingState',
      label: 'Billing State',
      type: 'text'
    },
    {
      key: 'billingZip',
      label: 'Billing ZIP',
      type: 'text'
    }
  ];

  // Promo Form Methods
  onPromoFieldChange(event: { key: string; value: any }) {
    this.promoFormData[event.key] = event.value;
    
    if (event.key === 'parentHierarchy') {
      this.promoFormData['parentNode'] = '';
      this.promoFormData['promo'] = '';
      this.updatePromoParentNodeOptions();
    } else if (event.key === 'parentNode') {
      this.promoFormData['promo'] = '';
      this.updatePromoOptions();
    }
  }

  updatePromoParentNodeOptions() {
    const parentNodeField = this.promoFields.find(f => f.key === 'parentNode');
    if (parentNodeField) {
      const hierarchyValue = this.promoFormData['parentHierarchy'];
      switch (hierarchyValue) {
        case '1':
          parentNodeField.options = [
            { value: '10011341 - SPANISH WORLDPOINT', label: '10011341 - SPANISH WORLDPOINT' },
            { value: '10011342 - ENGLISH WORLDPOINT', label: '10011342 - ENGLISH WORLDPOINT' }
          ];
          break;
        case '2':
          parentNodeField.options = [
            { value: '20011341 - SPANISH PREMIUM', label: '20011341 - SPANISH PREMIUM' },
            { value: '20011342 - ENGLISH PREMIUM', label: '20011342 - ENGLISH PREMIUM' }
          ];
          break;
        case '3':
          parentNodeField.options = [
            { value: '30011341 - SPANISH ELITE', label: '30011341 - SPANISH ELITE' },
            { value: '30011342 - ENGLISH ELITE', label: '30011342 - ENGLISH ELITE' }
          ];
          break;
        default:
          parentNodeField.options = [];
      }
    }
  }

  updatePromoOptions() {
    const promoField = this.promoFields.find(f => f.key === 'promo');
    if (promoField) {
      const parentNodeValue = this.promoFormData['parentNode'];
      switch (parentNodeValue) {
        case '10011341 - SPANISH WORLDPOINT':
          promoField.options = [
            { value: 'SPANISH_WORLD_1', label: 'Spanish World Promo 1' },
            { value: 'SPANISH_WORLD_2', label: 'Spanish World Promo 2' }
          ];
          break;
        case '10011342 - ENGLISH WORLDPOINT':
          promoField.options = [
            { value: 'ENGLISH_WORLD_1', label: 'English World Promo 1' },
            { value: 'ENGLISH_WORLD_2', label: 'English World Promo 2' }
          ];
          break;
        case '20011341 - SPANISH PREMIUM':
          promoField.options = [
            { value: 'SPANISH_PREMIUM_1', label: 'Spanish Premium Promo 1' },
            { value: 'SPANISH_PREMIUM_2', label: 'Spanish Premium Promo 2' }
          ];
          break;
        case '20011342 - ENGLISH PREMIUM':
          promoField.options = [
            { value: 'ENGLISH_PREMIUM_1', label: 'English Premium Promo 1' },
            { value: 'ENGLISH_PREMIUM_2', label: 'English Premium Promo 2' }
          ];
          break;
        case '30011341 - SPANISH ELITE':
          promoField.options = [
            { value: 'SPANISH_ELITE_1', label: 'Spanish Elite Promo 1' },
            { value: 'SPANISH_ELITE_2', label: 'Spanish Elite Promo 2' }
          ];
          break;
        case '30011342 - ENGLISH ELITE':
          promoField.options = [
            { value: 'ENGLISH_ELITE_1', label: 'English Elite Promo 1' },
            { value: 'ENGLISH_ELITE_2', label: 'English Elite Promo 2' }
          ];
          break;
        default:
          promoField.options = [];
      }
    }
  }

  // User Form Methods
  onUserFieldChange(event: { key: string; value: any }) {
    this.userFormData[event.key] = event.value;
  }

  // Product Form Methods
  onProductFieldChange(event: { key: string; value: any }) {
    this.productFormData[event.key] = event.value;
  }

  // Payment Form Methods
  onPaymentFieldChange(event: { key: string; value: any }) {
    this.paymentFormData[event.key] = event.value;
  }

  // Visibility methods for each form
  get visiblePromoFields(): FormField[] {
    return this.promoFields.filter(field => this.isPromoFieldVisible(field));
  }

  get visibleUserFields(): FormField[] {
    return this.userFields.filter(field => this.isUserFieldVisible(field));
  }

  get visibleProductFields(): FormField[] {
    return this.productFields.filter(field => this.isProductFieldVisible(field));
  }

  get visiblePaymentFields(): FormField[] {
    return this.paymentFields.filter(field => this.isPaymentFieldVisible(field));
  }

  isPromoFieldVisible(field: FormField): boolean {
    if (field.key === 'parentNode') {
      return !!this.promoFormData['parentHierarchy'];
    }
    if (field.key === 'promo') {
      return !!this.promoFormData['parentNode'];
    }
    return true;
  }

  isUserFieldVisible(field: FormField): boolean {
    const userType = this.userFormData['userType'];
    
    if (field.key === 'companyName' || field.key === 'businessType') {
      return userType === 'business';
    }
    if (field.key === 'studentId' || field.key === 'university' || field.key === 'graduationYear') {
      return userType === 'student';
    }
    return true;
  }

  isProductFieldVisible(field: FormField): boolean {
    const category = this.productFormData['productCategory'];
    
    if (field.key === 'electronicsType') {
      return category === 'electronics';
    }
    if (field.key === 'clothingType') {
      return category === 'clothing';
    }
    if (field.key === 'bookGenre') {
      return category === 'books';
    }
    if (field.key === 'furnitureType') {
      return category === 'furniture';
    }
    if (field.key === 'stockQuantity') {
      return this.productFormData['inStock'] === 'yes';
    }
    return true;
  }

  isPaymentFieldVisible(field: FormField): boolean {
    const paymentMethod = this.paymentFormData['paymentMethod'];
    
    if (field.key === 'cardNumber' || field.key === 'cardHolder' || 
        field.key === 'expiryMonth' || field.key === 'expiryYear' || field.key === 'cvv') {
      return paymentMethod === 'credit-card' || paymentMethod === 'debit-card';
    }
    if (field.key === 'bankName' || field.key === 'accountNumber' || field.key === 'routingNumber') {
      return paymentMethod === 'bank-transfer';
    }
    if (field.key === 'paypalEmail') {
      return paymentMethod === 'paypal';
    }
    if (field.key === 'cryptoType' || field.key === 'walletAddress') {
      return paymentMethod === 'crypto';
    }
    return true;
  }
} 