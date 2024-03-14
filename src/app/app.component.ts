import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonUploadDataComponent } from './vistas/red/button-upload-data/button-upload-data.component';
import { ConfigComponent } from './vistas/red/config/config.component';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { LogicComponent } from './vistas/red/logic/logic.component';
interface EventItem {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonUploadDataComponent,
    ConfigComponent,
    TimelineModule,
    ButtonModule,
    CardModule,
    CommonModule,
    LogicComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'perceptron';
  inputParameters = {};
  events: EventItem[];

    constructor() {
        this.events = [
            { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
            { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
            { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
            { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ];
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
