import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import * as Papa from 'papaparse';
import { saveAs } from 'file-saver';
import {MatButtonModule} from '@angular/material/button';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-button-upload-data',
  standalone: true,
  imports: [
    ButtonModule,
    FileUploadModule,
    MatButtonModule
    ],
  templateUrl: './button-upload-data.component.html',
  styleUrl: './button-upload-data.component.scss'
})
export class ButtonUploadDataComponent implements OnChanges, OnInit{
  @Output() dataProcessed = new EventEmitter<any>();
  @Input() isUpload: boolean = true;
  @Input() inputParametters: any = null;
  @Input() isDataset: boolean = true;
  @Input() isThreshold: boolean = true;
  
  title: string = "Guardar";
  
  ngOnChanges(){
  console.log(" input parametrter que llegan onChangs ", this.inputParametters);
  
      if(this.isUpload){ //boton para subir archivos
        this.title = "Selecciona un archivo"
        
        
      }
  }
  
  ngOnInit(): void {
  console.log(" input parametrter que llegan Oninit ", this.inputParametters);
    
  }
  
  
  fileName!: string;
  onFileChange(event: any, buttonUp: any) {
    if(this.isUpload){
    buttonUp.click();
    }else{
      this.downLoadCSV();
    }
  }
  
  upLoadCSV(event: any){
    // buttonUp.clear();
    console.log("archivos ", event);
    const file = event.target.files[0];
    this.fileName = file.name;
    
   
      Papa.parse(file, {
        complete: (result:any) => {
            console.log("data file ", result.data);
            
          const data = this.isDataset ?  this.processCSVData(result.data) : this.isThreshold ? (result.data[0]).map(Number) :  result.data.map((item:any) => item.map(Number));
          this.dataProcessed.emit(data);
        },
        header: this.isDataset,
      });
    
    
  }
  
  downLoadCSV() {
  console.log("inputs prameters ", this.inputParametters);
  
  console.log("venctor umbral ", this.inputParametters.finalThresholds, "vector pesos ", this.inputParametters.finalWeights)
    let weights =this.inputParametters.finalWeights.map((item:any) => item.map(String));// Convertir array de strings a array de strings
    let thresholds =[this.inputParametters.finalThresholds.map(String)];// Convertir array de strings a array de strings
    
    
    console.log("pesos y umbrales convertidos a cadena ", thresholds,weights);
    
    const csvWeights = Papa.unparse(weights,{delimiter: ";", newline:"\n",header:false});
    
    const csvThreshold = Papa.unparse(thresholds,{delimiter: ";", newline:"\n",header:false});
    
    const blobThresholds = new Blob([csvThreshold], { type: 'text/csv;charset=utf-8' });
    const blobWeights = new Blob([csvWeights], { type: 'text/csv;charset=utf-8' });
    saveAs(blobThresholds, 'finalThreshold'+this.inputParametters.fileName || ''+'.csv');
    saveAs(blobWeights, 'finalWeights'+this.inputParametters.fileName || ''+'.csv');
  }

  processCSVData(rows: any[]): any {
    if (!rows.length) return null;

    const titles = Object.keys(rows[0]);
    let changeIndex = this.findChangeIndex(titles);
    
    const numInputs = changeIndex;
    const numOutputs = titles.length - changeIndex;
    const numPatterns = rows.length;
    const matrixData = rows.map(row =>
      titles.map(title => parseFloat(row[title] || "0"))
    );

    return {
      numInputs,
      numOutputs,
      numPatterns,
      matrixData,
      fileName: this.fileName
    };
  }

  findChangeIndex(titles: string[]): number {
    let lastTitle = titles[0];
    for (let i = 1; i < titles.length; i++) {
      if (!this.isSameType(lastTitle, titles[i])) {
        return i;
      }
      lastTitle = titles[i];
    }
    return titles.length;
  }

  isSameType(title1: string, title2: string): boolean {
    return title1[0] === title2[0];
  }
}
