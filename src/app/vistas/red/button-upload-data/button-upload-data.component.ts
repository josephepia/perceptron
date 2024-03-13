import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import * as Papa from 'papaparse';
@Component({
  selector: 'app-button-upload-data',
  standalone: true,
  imports: [
    ButtonModule,
    FileUploadModule,
    ],
  templateUrl: './button-upload-data.component.html',
  styleUrl: './button-upload-data.component.scss'
})
export class ButtonUploadDataComponent {
  @Output() dataProcessed = new EventEmitter<any>();

  onFileChange(event: any, buttonUp: any) {
    buttonUp.clear();
    const file = event.files[0];

    Papa.parse(file, {
      complete: (result) => {
        const data = this.processCSVData(result.data);
        this.dataProcessed.emit(data);
      },
      header: true,
    });
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
}
