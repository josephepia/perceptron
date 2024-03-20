import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonUploadDataComponent } from './vistas/red/button-upload-data/button-upload-data.component';
import { ConfigComponent } from './vistas/red/config/config.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { LogicComponent } from './vistas/red/logic/logic.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { FormBuilder, Validators,ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { NeuronaComponent } from './vistas/red/neurona/neurona.component';

interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  title?: string;
}

interface Step {
  title: string,
  completed: boolean,
  order: number
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonUploadDataComponent,
    ConfigComponent,
    ButtonModule,
    CommonModule,
    LogicComponent,
    MatStepperModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatInputModule,
    NeuronaComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'perceptron';
  inputParameters:any = {};
  events: EventItem[];
  steps:Step[] = [];
  panelOpenState = false;
    constructor(
      private formBuilder: FormBuilder
    ) {
      
      this.steps = [
      {title: "Cargar banco de datos", completed:true, order: 1},
      {title: "Parametros de entrada", completed:true, order: 2},
      {title: "Dise;o", completed:true, order: 3},
      {title: "Inicializar pesos y umbrales", completed:true, order: 4},
      {title: "Configurar red", completed:true, order: 5},
      {title: "Parametros de entrenamiento", completed:true, order: 6},
      {title: "Entrenar red", completed:true, order: 7},
      {title: "Simulacion", completed:true, order: 8},

      ];
    
        this.events = [
            {  status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' , title: "Paso 1",},
            {  status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' , title: "Paso 1",},
            {  status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' , title: "Paso 1",},
            {  status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B', title: "Paso 1", }
        ];
    }
    
  //formualrio parametros de entrenamiento
  
  trainingParametersForm = this.formBuilder.group({
    numIterations: [1,[Validators.required,Validators.min(1)]],
    learningRat: [null,[Validators.required,this.rangeNumValidator()]],
    maxThreshold: [null,[Validators.required,Validators.min(0),Validators.max(1)]]
  });
  
  rangeNumValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rangoIncorrecto = control.value > 0 && control.value < 1
      return !rangoIncorrecto ? { rangoIncorrectoRat: { value: control.value } } : null;
    };
  }
    
  // cargar banco de datos
  
  handleData(data:any){
    this.inputParameters  = data;
    console.log("parametros de entrada => ", this.inputParameters);
  }
  
  
  
  //construir matriz de entradas y salidas
  
  //cargar pesos y umbrales oprimos -- asegurar la presistencia al terminar entrenamiento
  
  
  
  //presentar culaquier patron del banco nuevo y viejo 
  
  //calcular la salida de la red Yri. -- la respuesta debe ser la deseada
  

}
