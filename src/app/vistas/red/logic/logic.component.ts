import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-logic',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './logic.component.html',
  styleUrl: './logic.component.scss'
})
export class LogicComponent {
  object1 = { name: 'Angular' , age: 10};
}
