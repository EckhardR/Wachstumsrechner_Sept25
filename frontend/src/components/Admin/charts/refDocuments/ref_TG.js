import fs from 'fs';

export default class Ref_TG {
    constructor() {
      const fileName = 'ref_TB_exact.txt'; // Make sure this file exists in the correct location
      const myArr = fs.readFileSync(fileName, 'utf8').split('\n');
      const data = myArr.map((line) => line.split('\t'));
  
      this.P3 = [];
      this.P10 = [];
      this.P50 = [];
      this.P90 = [];
      this.P97 = [];
  
      for (let i = 0; i < data.length; i++) {
        for (let j = 24; j <= 34; j++) {
          const value = Number(data[i][(j - 24) * 5]);
          if (value !== 0 && value !== '#N/A') {
            this.P3[j] = this.P3[j] || [];
            this.P3[j][i + 158] = value;
          }
  
          const value1 = Number(data[i][(j - 24) * 5 + 1]);
          if (value1 !== 0 && value1 !== '#N/A') {
            this.P10[j] = this.P10[j] || [];
            this.P10[j][i + 158] = value1;
          }
  
          const value2 = Number(data[i][(j - 24) * 5 + 2]);
          if (value2 !== 0 && value2 !== '#N/A') {
            this.P50[j] = this.P50[j] || [];
            this.P50[j][i + 158] = value2;
          }
  
          const value3 = Number(data[i][(j - 24) * 5 + 3]);
          if (value3 !== 0 && value3 !== '#N/A') {
            this.P90[j] = this.P90[j] || [];
            this.P90[j][i + 158] = value3;
          }
  
          const value4 = Number(data[i][(j - 24) * 5 + 4]);
          if (value4 !== 0 && value4 !== '#N/A') {
            this.P97[j] = this.P97[j] || [];
            this.P97[j][i + 158] = value4;
          }
        }
      }
    }
  }
  
/*
  // Usage example:
const ref_TG = new Ref_TG();
console.log(ref_TG.P97[29]);
  */