import fs from 'fs';

export default class Ref_TB {
    constructor() {
        const myArr = fs.readFileSync('ref_TB_exact.txt', 'utf8').split('\n');

        this.P3 = {};
        this.P10 = {};
        this.P50 = {};
        this.P90 = {};
        this.P97 = {};

        for (let i = 0; i < myArr.length; i++) {
            const data = myArr[i].split('\t');
            for (let j = 24; j <= 34; j++) {
                const index = j - 24;
                const value1 = parseFloat(data[index * 5]);
                const value2 = parseFloat(data[index * 5 + 1]);
                const value3 = parseFloat(data[index * 5 + 2]);
                const value4 = parseFloat(data[index * 5 + 3]);
                const value5 = parseFloat(data[index * 5 + 4]);

                if (!isNaN(value1) && value1 !== 0) {
                    this.P3[j] = this.P3[j] || {};
                    this.P3[j][i + 158] = value1;
                }

                if (!isNaN(value2) && value2 !== 0) {
                    this.P10[j] = this.P10[j] || {};
                    this.P10[j][i + 158] = value2;
                }

                if (!isNaN(value3) && value3 !== 0) {
                    this.P50[j] = this.P50[j] || {};
                    this.P50[j][i + 158] = value3;
                }

                if (!isNaN(value4) && value4 !== 0) {
                    this.P90[j] = this.P90[j] || {};
                    this.P90[j][i + 158] = value4;
                }

                if (!isNaN(value5) && value5 !== 0) {
                    this.P97[j] = this.P97[j] || {};
                    this.P97[j][i + 158] = value5;
                }
            }
        }
    }
}

// Usage
const ref_TB = new Ref_TB();
console.log(ref_TB.P3[29]); // Print a specific value, adjust index as needed
