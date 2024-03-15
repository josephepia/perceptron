import { Component } from '@angular/core';
import { parse } from 'papaparse';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-logic',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './logic.component.html',
  styleUrl: './logic.component.scss',
})
export class LogicComponent {
  weights: number[][] = [];
  thresholds: number[] = [];

  /*   weights2: number[][] = [
    [0.7, 1],
    [0.5, 0.5],
    [0.2, 0.3],
  ];
  thresholds2: number[] = [0, -1]; */

  //Datos de entrenamiento
  /*   inputs: number[][] = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ];
  outputs: number[][] = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]; */

  //Error por iteracion
  eit: number[] = [];

  defineWeightsThresholds(rows: number, colums: number) {
    this.weights = Array.from({ length: rows }, () =>
      Array.from({ length: colums }, () =>
        parseFloat((Math.random() * 2 - 1).toFixed(1))
      )
    );
    this.thresholds = Array.from({ length: colums }, () =>
      parseFloat((Math.random() * 2 - 1).toFixed(1))
    );
  }

  attenuatedSomaFunctionOutput(
    inputs: number[],
    inputslength: number,
    outputslength: number
  ) {
    let result: number[] = Array(outputslength).fill(0);
    for (let i = 0; i < outputslength; i++) {
      let value = 0;
      let value2 = 0;
      for (let j = 0; j < inputslength; j++) {
        value += inputs[j] * this.weights[j][i];
      }
      value2 = value - this.thresholds[i];
      value2 = parseFloat(value2.toFixed(1));
      result[i] = value2;
    }
    return result;
  }

  activationFunction(outsomafunct: number[]) {
    let result: number[] = Array(outsomafunct.length).fill(0);
    for (let i = 0; i < outsomafunct.length; i++) {
      if (outsomafunct[i] >= 0) {
        result[i] = 1;
      } else {
        result[i] = 0;
      }
    }
    return result;
  }

  calculateLinealError(yr: number[], yd: number[]) {
    let error: number[] = Array(yr.length).fill(0);
    for (let i = 0; i < yr.length; i++) {
      error[i] = yd[i] - yr[i];
    }
    return error;
  }

  calculateErrorPattern(linealerror: number[], outputslength: number) {
    let result: number = 0;
    let value = 0;
    for (let i = 0; i < linealerror.length; i++) {
      value += linealerror[i];
    }
    value = Math.abs(value);
    result = value / outputslength;
    return result;
  }

  trainingAlgorithm(
    lienalerror: number[],
    inputs: number[],
    learningRat: number
  ) {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        this.weights[i][j] = parseFloat(
          (
            this.weights[i][j] +
            learningRat * lienalerror[j] * inputs[i]
          ).toFixed(1)
        );
      }
    }
    for (let i = 0; i < this.thresholds.length; i++) {
      this.thresholds[i] = parseFloat(
        (this.thresholds[i] + learningRat * lienalerror[i] * 1).toFixed(1)
      );
    }
  }

  calculateIterationError(patternerror: number[]) {
    let result: number = 0;
    let value = 0;
    for (let i = 0; i < patternerror.length; i++) {
      value += patternerror[i];
    }
    result = value / patternerror.length;
    return result;
  }

  train(
    inputslength: number,
    outputslength: number,
    parameterslength: number,
    inputs: number[][],
    outputs: number[][],
    learningRat: number,
    iterations: number,
    maximumAllowableError: number
  ) {
    this.defineWeightsThresholds(inputslength, outputslength);
    while (
      this.eit[length - 1] >= maximumAllowableError ||
      this.eit.length < iterations
    ) {
      let patternerror: number[] = [];
      for (let i = 0; i < parameterslength; i++) {
        let outsomafunct: number[] = [];
        let yr: number[] = [];
        let linealerror: number[] = [];
        outsomafunct = this.attenuatedSomaFunctionOutput(
          inputs[i],
          inputslength,
          outputslength
        );
        yr = this.activationFunction(outsomafunct);
        linealerror = this.calculateLinealError(yr, outputs[i]);
        patternerror.push(
          this.calculateErrorPattern(linealerror, outputslength)
        );
        this.trainingAlgorithm(linealerror, inputs[i], learningRat);
      }
      this.eit.push(this.calculateIterationError(patternerror));
    }
    console.log(this.weights);
    console.log(this.thresholds);
    console.log(this.eit);
  }
}
