import React from 'react'
import RefB_WHO from './refDocuments/refB_WHO.js';
import RefG_WHO from './refDocuments/refG_WHO.js';
import RefG_Len_WHO from './refDocuments/refG_Len_WHO.js';
import RefB_Len_WHO from './refDocuments/refB_Len_WHO.js';
import RefB_Head_WHO from './refDocuments/refB_Head_WHO.js';
import RefG_Head_WHO from './refDocuments/refG_Head_WHO.js';

const getTargetRef = (target, xAxisMax, gender) => {
    if (target === 'weight' || target === 'FatMas' || target === 'FatFreeMas' || target === 'ProzentFreeMas' ) {
        if (gender === 'male') {
            return new RefB_WHO(xAxisMax);
        } else if (gender === 'female') {
            return new RefG_WHO(xAxisMax);
        }
    } else if (target === 'length') {
        if (gender === 'male') {
            return new RefB_Len_WHO(xAxisMax);
        } else if (gender === 'female') {
            return new RefG_Len_WHO(xAxisMax);
        }
    } else if (target === 'headCirmunference') {
        if (gender === 'male') {
            return new RefB_Head_WHO(xAxisMax);
        } else if (gender === 'female') {
            return new RefG_Head_WHO(xAxisMax);
        }
    } else {
        return [];
    }
}

export class ChartInfosPreparation {
    constructor(Gender, xAxisMin, xAxisMax, GestationalWeek, GestationalDay, dataTarget) {
        const totalDays = GestationalWeek * 7 + GestationalDay;
        const xAxisTarget = xAxisMax*7;

        let ref_who = getTargetRef(dataTarget, xAxisTarget, Gender);


        const chartData = {
            WHO: {
                P3: [],
                P10: [],
                P50: [],
                P90: [],
                P97: [],
            },
        };

        for (let i = 164; i <= xAxisTarget; i++) {
            chartData.WHO.P3[i] = ref_who.P3[i];
            chartData.WHO.P10[i] = ref_who.P10[i];
            chartData.WHO.P50[i] = ref_who.P50[i];
            chartData.WHO.P90[i] = ref_who.P90[i];
            chartData.WHO.P97[i] = ref_who.P97[i];
        }

        this.totalDays = totalDays;
        this.chartData = chartData;
        console.log('chart f prepparatoion', chartData)
    }
}