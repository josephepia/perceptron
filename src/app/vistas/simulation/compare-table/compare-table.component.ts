import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import _ from "lodash";
import Papa from "papaparse";
import fs from "fs";


@Component({
  selector: 'app-compare-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './compare-table.component.html',
  styleUrl: './compare-table.component.scss'
})
export class CompareTableComponent implements OnInit,OnChanges {
  @Input() inputParameters: any;
  @Input() trainingParameters: any;
  matrixData:number[][] = [];
  newMatrix: any[] = [];

  displayedColumns: string[] = [];
  displayedColumnsShow: any = {};
  dataSource = this.newMatrix;

ngOnInit(){



}

ngOnChanges(){
  this.readFile();

}

  readFile() {
    // leer archivo csv dataset modificado
    // Ruta al archivo que quieres leer
    const rutaArchivo = 'assets/newdatasets/new'+this.inputParameters.fileName+'.csv';
    let file:any ;
    
    // Leer el contenido del archivo
    fs.readFile(rutaArchivo, 'utf8', (error, datos) => {
      if (error) {
        console.error('Error al leer el archivo:', error);
        return;
      }
    
      file= datos;
      console.log(" archivo leido ", datos);
      Papa.parse(file, {
        complete: (result) => {
        
          const data = this.processCSVData(result.data);
          this.inputParameters = data;
        },
        header: true,
      });
      
      this.startSimulation()
    });

    // this.fileName = file.name;
    
    //crear la martriz nuava
    // this.matrixData = datos csv
    //cargamos umbrales y pesos optimos 

    //ejecuto algotirmo de simulacion.



    // actualizo matriz a mostrar en la tabla
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

findColumName(key: string){
  return this.displayedColumnsShow[key];
}

finalWeights:number[][]=[];
finalThresholds:number[]= [];

  startSimulation() {
  console.log("iniciando simulacion");
  
  if(this.inputParameters && this.trainingParameters){
  console.log("simulacion iniciada");
  
  this.displayedColumns = [];
  this.displayedColumnsShow = [];
  let newMatrixShow:any = [];
  
  
    // this.matrixData = [
    //     [0, 0, 0,0, 0],
    //     [0, 0, 1,0, 1],
    //     [0, 1, 0,1, 0],
    //     [1, 0, 0,1, 1],
    //   ];
      
       // let finalWeights:number[][] =[
      //   [2, 0],
      //   [2, 1],
      //   [0, -1],
      //   [0, 0]
      // ];
      // let finalThresholds:number[] = [-1,1]; 
      
    // this.finalWeights = [
    //     [2, 0],
    //     [2, 1],
    //     [0, -1],
    //     // [0, 0]
    //   ];
    this.finalThresholds = this.trainingParameters.finalThresholds//[-1,1];
    this.finalWeights = this.trainingParameters.finalWeights;
    this.matrixData = this.inputParameters.matrixData;

    let numInputs = this.inputParameters.numInputs;
    let numOutputs = this.inputParameters.numOutputs;
    let numPatterns = this.inputParameters.numPatterns;




    //this.newMatrix = _.cloneDeep(this.matrixData);



    for (let numPatron = 0; numPatron < numPatterns; numPatron++) {
      let pesosOld: number[][] = [];
      pesosOld = _.cloneDeep(this.finalWeights);

      let umbralesOld: number[] = [];
      umbralesOld = _.cloneDeep(this.finalThresholds);

      let salidasPatron: number[] = [];
      let sumatoriaPesoPorPatron: number[] = Array(numOutputs).fill(0);
      let yr: number[] = [];
      let errL: number[] = [];
      let errPattern:number = 0;
      
      
      if(!newMatrixShow[numPatron]){
        newMatrixShow[numPatron] = {}
        }
        newMatrixShow[numPatron]['position'] = numPatron;
      
      for (let i = 0; i < numOutputs; i++) {
      
      
          
        for (let j = 0; j < numInputs; j++) {
        
        this.displayedColumns[j] = "X"+j;
        this.displayedColumns[i+numInputs] = "Yd"+i;
        this.displayedColumns[i+numInputs+numOutputs] = "Yr"+i;
        this.displayedColumns[numInputs+numOutputs+numOutputs] = "Errorporpatron";
        
        
        this.displayedColumnsShow[this.displayedColumns[j]] = "X"+j;
        this.displayedColumnsShow[this.displayedColumns[i+numInputs]] = "Yd"+i;
        this.displayedColumnsShow[this.displayedColumns[i+numInputs+numOutputs]] = "Yr"+i;
        this.displayedColumnsShow[this.displayedColumns[numInputs+numOutputs+numOutputs]] = "Error por patron";
        
          newMatrixShow[numPatron][this.displayedColumns[j]] = this.matrixData[numPatron][j]; //Xn
          newMatrixShow[numPatron][this.displayedColumns[i+numInputs]] = this.matrixData[numPatron][numInputs+i]; //Ydn
        

          sumatoriaPesoPorPatron[i] += (this.matrixData[numPatron][j] * pesosOld[j][i])

          salidasPatron[i] = sumatoriaPesoPorPatron[i] - umbralesOld[i];
          yr[i] = this.funcionActivacion(salidasPatron[i]);
          
          newMatrixShow[numPatron][this.displayedColumns[i+numInputs+numOutputs]] = yr[i]; //Yrn
          
          errL[i] = this.matrixData[numPatron][numInputs + i] - yr[i]
          errPattern = Math.abs((errL.reduce((a, b) => a + b, 0))) / numOutputs;
        
          newMatrixShow[numPatron][this.displayedColumns[numInputs+numOutputs+numOutputs]] = errPattern; 
        
        }

        //agregar columnas por cada salida de la simulacion
        
        console.log("ubicacion yr ", numInputs+numOutputs+i);
        
        // agregar Yri
        // this.newMatrix[numPatron][numInputs+numOutputs+i] = yr[i];
        //agregar columan error obtenido
        // console.log("ubicacion errl ", numInputs+numOutputs+numOutputs+i);
        
        // this.newMatrix[numPatron][numInputs+numOutputs+numOutputs+i] = errL[i];
        // this.newMatrix[numPatron][this.displayedColumns[i+numOutputs+numOutputs]] = this.matrixData[numPatron][i];
        
      
        
      }


    }//final de patron
    this.displayedColumns.unshift("position");
    this.displayedColumnsShow["position"] = "#";
    this.matrixData = _.cloneDeep(newMatrixShow)
    this.dataSource = this.matrixData;
    console.log(" datos tabla local => ", newMatrixShow);
    console.log(" datos tabla global => ", this.newMatrix);
    
    console.log(" titulos tabla => ", this.displayedColumns);
    

  }
  
  
  }
  funcionActivacion(num: number): number {
    if (num >= 0) {
      return 1;
    }
    return 0
  }
}
