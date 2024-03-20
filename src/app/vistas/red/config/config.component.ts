import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { select, selectAll } from "d3";
import { ChartModule } from 'primeng/chart';
import Chart from 'chart.js/auto';
import _ from "lodash";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    ChartModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent implements OnChanges {
  @Input() inputParameters: any;
  @Input() trainingParameters: any;
  @Output() dataTraining = new EventEmitter<any>();


  ngOnChanges() {
    // console.log("algo cambi[o en hijo");
    if (this.chart && this.inputParameters && this.trainingParameters) {
      console.log(" datos antes de entrenar inputparameters ", this.inputParameters, "paramatros entrena ", this.trainingParameters);

      this.trainingNetwork()
    }
  }
  

  totalIterationError: number[] = [];
  maximumError: number = 0;
  data: any;
  finalWeights:number[][] = [];
  finalThresholds:number[]=[];
  options: any;
  labels: [] = [];

  public chart!: Chart;
  ngOnInit() {
    this.createChart();
    this.trainingNetwork();
  }

  createChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');




    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart

      data: {
        labels: [],
        datasets: [
          {
            label: 'Eror por iteración',
            data: [],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0.4
          },
          {
            label: 'Error máximo',
            // data: Array(this.totalIterationError.length).fill(this.maximumError),
            data: Array(this.totalIterationError.length).fill(this.maximumError),
            fill: false,
            borderDash: [5, 5],
            borderColor: documentStyle.getPropertyValue('--pink-500'),
            tension: 0.4
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          decimation: {
            // enabled: true,
            // algorithm: 'lttb',
            samples: 50,
            // threshold: 10
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
            }
          }
        }
      }

    });

  }

  //numInputs,
  //numOutputs,
  //numPatterns,
  //matrixData,




  numeroAleatorio() {
    return Math.floor(Math.random() * 2);
  }

  generarNumeroEntreMenosUnoYUno() {
    return Math.random() * 2 - 1; // Genera un número aleatorio entre -1 y 1
  }




  crearMatriz(filas: number, columnas: number, functionNumRandom: Function) {

    let matriz = [];
    for (let i = 0; i < filas; i++) {
      matriz[i] = [];
      if (columnas > 0) {
        for (let j = 0; j < columnas; j++) {
          matriz[i][j] = functionNumRandom();
        }
      } else {
        for (let j = 0; j < filas; j++) {
          matriz[j] = functionNumRandom();
        }
      }

    }
    return matriz;
  }


  funcionActivacion(num: number): number {
    if (num >= 0) {
      return 1;
    }
    return 0
  }
  
  save() {
    // Convertir los datos a una cadena CSV utilizando Papa.parse
    console.log("pesos a guardar ",this.finalWeights);
    console.log("umbrales a guardar ",this.finalThresholds);
    const finalWeightsStrings = this.finalWeights.map(row => row.map(value => String(value)));
    const finalThresholdsStrings = this.finalThresholds.map(value => String(value));
    console.log("pesos a guardar ",finalWeightsStrings);
    console.log("umbrales a guardar ",finalThresholdsStrings);
    const finalThresholdsCSV = Papa.unparse(finalThresholdsStrings,{header: false});
    const finalWeightsCSV = Papa.unparse(finalWeightsStrings);

    // Definir la ruta completa del archivo CSV
    const filePathThresholds = path.join(__dirname, 'assets/thresholds', this.inputParameters.fileName+'thresholds.csv');
    const filePathWeights = path.join(__dirname, 'assets/weights', this.inputParameters.fileName+'Weights.csv');

    // Escribir el archivo CSV en la ubicación especificada
    fs.writeFileSync(filePathThresholds, finalThresholdsCSV);
    fs.writeFileSync(filePathWeights, finalWeightsCSV);

    console.log('Archivo CSV guardado en:', filePathThresholds);
    console.log('Archivo CSV guardado en:', filePathWeights);
  }

  trainingNetwork() {
    if (this.chart && this.inputParameters && this.trainingParameters) {
      this.chart.reset();


      //establecer matriz de pesos al azar 
      

      this.finalWeights  = this.crearMatriz(this.inputParameters.numInputs, this.inputParameters.numOutputs, this.generarNumeroEntreMenosUnoYUno);
      this.finalThresholds  = this.crearMatriz(this.inputParameters.numOutputs, 0, this.generarNumeroEntreMenosUnoYUno);


      //numInputs,
      //numOutputs,
      //numPatterns,
      //matrixData,
      // this.inputParameters.matrixData = [
      //   [0, 0, 0,0, 0],
      //   [0, 0, 1,0, 1],
      //   [0, 1, 0,1, 0],
      //   [1, 0, 0,1, 1],
      // ];

      // this.inputParameters.numInputs    = 3;
      // this.inputParameters.numOutputs   = 2;
      // this.inputParameters.numPatterns  = 4;

      // let finalWeights:number[][] =[
      //   [2, 0],
      //   [2, 1],
      //   [0, -1],
      //   [0, 0]
      // ];
      // let finalThresholds:number[] = [-1,1]; 
      // let umbralesOld = [...umbrales];
      // let pesosOld = [...pesos];
      // console.log("matriz de pesos creada => ", pesos);
      // console.log("matriz de umbrales creados  => ", umbrales);

      //definir algoritmo entrenamiento y funciona activacion
      // let numInteraciones = 100;

      // this.maximumError = 0.01;
      // let rataAprendizaje = 0.5;
      let numInteraciones = this.trainingParameters.numIterations;

      this.maximumError = this.trainingParameters.maxThreshold;
      let rataAprendizaje = this.trainingParameters.learningRat;

      this.totalIterationError = [];



      // establecer matriz de umbral al azar 

      // definimos vectores a reutilizar


      let errIteracion = 1;
      let continuar = true;
      do {
        let errPatern: number[] = [];

        for (let numPatron = 0; numPatron < this.inputParameters.numPatterns; numPatron++) {
          let pesosOld: number[][] = [];
          pesosOld = _.cloneDeep(this.finalWeights);
          let pesosNew: number[][] = Array.from({ length: this.inputParameters.numInputs }, () => new Array(this.inputParameters.numOutputs));

          let umbralesOld: number[] = [];
          umbralesOld = _.cloneDeep(this.finalThresholds);
          let umbralesNew: number[] = [];

          let salidasPatron: number[] = [];
          let sumatoriaPesoPorPatron: number[] = Array(this.inputParameters.numOutputs).fill(0);
          let yr: number[] = [];
          let errL: number[] = [];


          for (let i = 0; i < this.inputParameters.numOutputs; i++) {

            for (let j = 0; j < this.inputParameters.numInputs; j++) {

              sumatoriaPesoPorPatron[i] += (this.inputParameters.matrixData[numPatron][j] * pesosOld[j][i])

              salidasPatron[i] = sumatoriaPesoPorPatron[i] - umbralesOld[i];
              yr[i] = this.funcionActivacion(salidasPatron[i]);
              errL[i] = this.inputParameters.matrixData[numPatron][this.inputParameters.numInputs + i] - yr[i]


              errPatern[numPatron] = Math.abs((errL.reduce((a, b) => a + b, 0))) / this.inputParameters.numOutputs;


            }

            for (let j = 0; j < this.inputParameters.numInputs; j++) {

              //reajustamos pesos y umbrales al ya no necesitar el valor antiguo
              //  console.log(" peso nuevo  = [",j+1,"x",i+1,"] =",pesosOld[j][i],"+ (",rataAprendizaje,"*",errL[i],"*",this.inputParameters.matrixData[numPatron][j],") = ",pesosOld[j][i]+(rataAprendizaje*errL[i]*this.inputParameters.matrixData[numPatron][j]));

              pesosNew[j][i] = pesosOld[j][i] + (rataAprendizaje * errL[i] * this.inputParameters.matrixData[numPatron][j]);
              // console.log(" peso nuevo guardado ", pesosNew[j][i]);

              umbralesNew[i] = umbralesOld[i] + (rataAprendizaje * errL[i] * 1);

            }









          }
          this.finalWeights = _.cloneDeep(pesosNew);
          this.finalThresholds = _.cloneDeep(umbralesNew)

          // console.log("pesos patron old => ", pesosOld, "patron - ",numPatron);
          //  console.log("pesos patron new => ", pesosNew,"patron - ",numPatron);


          // console.log("pesos patron final => ", finalWeights, "patron - ",numPatron);
          //  console.log("umbral patron final => ", finalThresholds,"patron - ",numPatron);
          //umbralesOld = [...umbrales];
          //salidas por patron
          //  console.log("------------- patron => ", numPatron);

          //  console.log("salida patron ", salidasPatron);
          //  console.log(" yr activacion ", yr);
          //  console.log("error lineal por patron ", errL);
          //  console.log(" error patron ", errPatern);
          //  console.log("------------- pesos y umbrales ");
          //  console.log("pesos patron old => ", pesosOld);
          //  console.log("pesos patron new => ", pesos);
          //  console.log("umbrales patron ",finalThresholds);





          // this.chart?.update();


        }//final de patron
        // console.log(" error por patron => ", errPatern);

        errIteracion = (errPatern.reduce((a, b) => a + b, 0)) / this.inputParameters.numPatterns;
        numInteraciones--;

        // console.log("peso por iteracion => ", pesos);
        // console.log("umbrales por iteracion => ", umbrales);
        // console.log("peso por iteracion aux=> ", pesosAux);
        // console.log("umbrales por iteracion aux => ", umbralesAux);
        // console.log("errore por iteracion => ", errIteracion);
        // console.log("error iteracion all ", errIteracion);

        this.totalIterationError.push(errIteracion);
        console.log("datos itraecion ", this.totalIterationError);

        // console.log("datasets de shart => ", this.chart?.data);
        // this.chart.data.labels = Object.keys(this.totalIterationError);
        //   this.chart.data.datasets[0].data.push(errIteracion);
        //   this.chart.data.datasets[1].data.push(this.maximumError);
        //   this.chart?.update();

        // this.createChart();

        // continuar = this.verificarCondicion(errIteracion, numInteraciones);

      } while (errIteracion > this.maximumError && numInteraciones > 0);


      this.chart.data.labels = Object.keys(this.totalIterationError);
      this.chart.data.datasets[0].data = this.totalIterationError;
      this.chart.data.datasets[1].data = Array(this.totalIterationError.length).fill(this.maximumError);
      this.chart?.update();

      if(errIteracion <= this.maximumError){
        this.dataTraining.emit({
          finalThresholds: this.finalThresholds,
          finalWeights: this.finalWeights
        })
      }else{
        this.dataTraining.emit(null);
      }
      // setTimeout(()=>{
      //   this.chart.data.labels = Object.keys(this.totalIterationError);
      //   this.chart.data.datasets[0].data = this.totalIterationError;
      //   this.chart.data.datasets[1].data = Array(this.totalIterationError.length).fill(this.maximumError);
      //   // this.chart.options.plugins.decimation.algorithm = 'lttb';
      // // chart.options.plugins.decimation.enabled = true;
      // // this.chart!.options!.plugins!.decimation!.enabled =true;
      // // this.chart!.options!.plugins!.decimation!.algorithm ='lttb';
      // // this.chart!.options!.plugins!.decimation!.threshold =60;
      //   // this.chart?.options?.animation?.duration = 0;
      //   this.chart?.update();
      // }, 10);
    }




  }

  verificarCondicion(errIteracion: number, numInteraciones: number) {
    // Lógica para verificar la condición de continuación
    return errIteracion > this.maximumError && numInteraciones > 0
  }


}
