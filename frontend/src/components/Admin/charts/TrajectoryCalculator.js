import First21DaysOfLife from "./refDocuments/First21DaysOfLife.js";
import RefB_Fenton from "./refDocuments/refB_Fenton.js";
import RefB_Head_WHO from "./refDocuments/refB_Head_WHO.js";
import RefB_Len_WHO from "./refDocuments/refB_Len_WHO.js";
import RefB_WHO from "./refDocuments/refB_WHO.js";
import RefG_Fenton from "./refDocuments/refG_Fenton.js";
import RefG_Head_WHO from "./refDocuments/refG_Head_WHO.js";
import RefG_Len_WHO from "./refDocuments/refG_Len_WHO.js";
import RefG_WHO from "./refDocuments/refG_WHO.js";
import { cumnormdist, number_format } from "./refDocuments/utils.js";

class InfantHypotheticalCalculations {
    constructor(ref_Fenton, ref_WHO, ga21, wt21, wt21_mhSD, wt21_phSD, birthPercentile, zscore, xAxisMax) {
        this.weightAtDay = [];
        this.weight_mhSD = [];
        this.weight_phSD = [];
        this.WG = [];
        this.WG_cumulative = [];
        this.ga = ga21 - 20;

        this.weightAtDay[ga21] = wt21;
        this.weight_mhSD[ga21] = wt21_mhSD;
        this.weight_phSD[ga21] = wt21_phSD;

        this.WG[ga21] = ref_Fenton.WG[ga21];
        this.WG_cumulative[ga21] = this.WG[ga21];

        for (let i = ga21 + 1; i < 295; i++) {
            this.WG[i] = ref_Fenton.WG[i];
            this.WG_cumulative[i] = ref_Fenton.WG[i] * this.WG_cumulative[i - 1];
        }

        const ga42 = 294;
        const endweightgain_begin = this.WG_cumulative[293];
        const firstweight = endweightgain_begin * wt21;
        // const wt42 = Math.pow(1 + (ref_WHO.L[ga42] * ref_WHO.S[ga42] * zscore), (1 / ref_WHO.L[ga42])) * ref_WHO.M[ga42] * 1000;
        const wt42 = Math.pow(1 + (ref_WHO.L[ga42] * ref_WHO.S[ga42] * zscore), (1 / ref_WHO.L[ga42])) * ref_WHO.M[ga42];

        this.factor = Math.pow((wt42 / wt21 / endweightgain_begin), (1 / (ga42 - ga21)));
        console.log('Factoor', this.factor, wt42, wt21, ga21)
        for (let i = ga21 + 1; i < 295; i++) {
            this.weightAtDay[i] = this.weightAtDay[i - 1] * this.WG[i - 1] * this.factor;
            this.weight_mhSD[i] = this.weight_mhSD[i - 1] * this.WG[i - 1] * this.factor;
            this.weight_phSD[i] = this.weight_phSD[i - 1] * this.WG[i - 1] * this.factor;
        }
        /*
                const zscore_wt42 = ((Math.pow(this.weightAtDay[294] / 1000 / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
                    (ref_WHO.L[294] * ref_WHO.S[294]));
                const zscore_wt42_mSD = ((Math.pow(this.weight_mhSD[294] / 1000 / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
                    (ref_WHO.L[294] * ref_WHO.S[294]));
                const zscore_wt42_pSD = ((Math.pow(this.weight_phSD[294] / 1000 / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
                    (ref_WHO.L[294] * ref_WHO.S[294]));
        */
        const zscore_wt42 = ((Math.pow(this.weightAtDay[294] / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
            (ref_WHO.L[294] * ref_WHO.S[294]));
        const zscore_wt42_mSD = ((Math.pow(this.weight_mhSD[294] / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
            (ref_WHO.L[294] * ref_WHO.S[294]));
        const zscore_wt42_pSD = ((Math.pow(this.weight_phSD[294] / ref_WHO.M[294], ref_WHO.L[294]) - 1) /
            (ref_WHO.L[294] * ref_WHO.S[294]));

        for (let i = 295; i <= xAxisMax; i++) {
            //             this.weightAtDay[i] = Math.pow((1 + (ref_WHO.L[i] * ref_WHO.S[i] * zscore_wt42)), 1 / ref_WHO.L[i]) * ref_WHO.M[i] * 1000;

            this.weightAtDay[i] = Math.pow((1 + (ref_WHO.L[i] * ref_WHO.S[i] * zscore_wt42)), 1 / ref_WHO.L[i]) * ref_WHO.M[i];
            this.weight_mhSD[i] = Math.pow((1 + (ref_WHO.L[i] * ref_WHO.S[i] * zscore_wt42_mSD)), 1 / ref_WHO.L[i]) * ref_WHO.M[i];
            this.weight_phSD[i] = Math.pow((1 + (ref_WHO.L[i] * ref_WHO.S[i] * zscore_wt42_pSD)), 1 / ref_WHO.L[i]) * ref_WHO.M[i];
        }
    }
}



export class TrajectoryCalculator {
    constructor(birthweight, gestationalAge_weeks, gestationalAge_days, sex, xAxisMin, xAxisMax, yAxisMin, yAxisMax, dataTarget) {
        const totalDays = gestationalAge_weeks * 7 + gestationalAge_days;

        let [refB_Fenton, refB_WHO, refG_Fenton, refG_WHO] = [new RefB_Fenton(xAxisMax), new RefB_WHO(xAxisMax, yAxisMax), new RefG_Fenton(xAxisMax), new RefG_WHO(xAxisMax, yAxisMax)];
        // console.log('ssssssssssssss', refB_Fenton, refB_WHO, refG_Fenton, refG_WHO)
        let ga_index, l, m, s, zscore, zscore3, zscore10, zscore50, zscore90, zscore97, f, f3, f10, f50, f90, f97, ihc, ihc3, ihc10, ihc50, ihc90, ihc97;

        if (sex === 'male') {
            ga_index = totalDays;
            l = refB_Fenton.L[ga_index];
            m = refB_Fenton.M[ga_index];
            s = refB_Fenton.S[ga_index];
            zscore = (Math.pow(birthweight / m, l) - 1) / (l * s);
            zscore3 = (Math.pow(refB_Fenton.P3[totalDays] / m, l) - 1) / (l * s);
            zscore10 = (Math.pow(refB_Fenton.P10[totalDays] / m, l) - 1) / (l * s);
            zscore50 = (Math.pow(refB_Fenton.P50[totalDays] / m, l) - 1) / (l * s);
            zscore90 = (Math.pow(refB_Fenton.P90[totalDays] / m, l) - 1) / (l * s);
            zscore97 = (Math.pow(refB_Fenton.P97[totalDays] / m, l) - 1) / (l * s);
            f3 = new First21DaysOfLife(refB_Fenton.P3[totalDays], gestationalAge_weeks, gestationalAge_days);
            f10 = new First21DaysOfLife(refB_Fenton.P10[totalDays], gestationalAge_weeks, gestationalAge_days);
            f50 = new First21DaysOfLife(refB_Fenton.P50[totalDays], gestationalAge_weeks, gestationalAge_days);
            f90 = new First21DaysOfLife(refB_Fenton.P90[totalDays], gestationalAge_weeks, gestationalAge_days);
            f97 = new First21DaysOfLife(refB_Fenton.P97[totalDays], gestationalAge_weeks, gestationalAge_days);
        } else if (sex === 'female') {
            ga_index = totalDays;
            l = refG_Fenton.L[ga_index];
            m = refG_Fenton.M[ga_index];
            s = refG_Fenton.S[ga_index];
            zscore = (Math.pow(birthweight / m, l) - 1) / (l * s);
            zscore3 = (Math.pow(refG_Fenton.P3[totalDays] / m, l) - 1) / (l * s);
            zscore10 = (Math.pow(refG_Fenton.P10[totalDays] / m, l) - 1) / (l * s);
            zscore50 = (Math.pow(refG_Fenton.P50[totalDays] / m, l) - 1) / (l * s);
            zscore90 = (Math.pow(refG_Fenton.P90[totalDays] / m, l) - 1) / (l * s);
            zscore97 = (Math.pow(refG_Fenton.P97[totalDays] / m, l) - 1) / (l * s);
            f3 = new First21DaysOfLife(refG_Fenton.P3[totalDays], gestationalAge_weeks, gestationalAge_days);
            f10 = new First21DaysOfLife(refG_Fenton.P10[totalDays], gestationalAge_weeks, gestationalAge_days);
            f50 = new First21DaysOfLife(refG_Fenton.P50[totalDays], gestationalAge_weeks, gestationalAge_days);
            f90 = new First21DaysOfLife(refG_Fenton.P90[totalDays], gestationalAge_weeks, gestationalAge_days);
            f97 = new First21DaysOfLife(refG_Fenton.P97[totalDays], gestationalAge_weeks, gestationalAge_days);
        }
        console.log('First21DaysOfLife', f3, f10, f50, f90, f97)
        f = new First21DaysOfLife(birthweight, gestationalAge_weeks, gestationalAge_days);

        const birthPercentile = number_format(cumnormdist(zscore), 9);
        const birthPercentileRounded = number_format((birthPercentile * 100), 0);

        this.totalDays = totalDays;
        const nearestWeek = Math.floor(totalDays / 7) * 7;

        this.zscore = zscore;
        this.birthPercentile = birthPercentile;
        this.birthPercentileRounded = birthPercentileRounded;

        const ga21 = totalDays + 20;
        const wt21 = f.weightAtDay[21];

        const wt21_3 = f3.weightAtDay[21];
        const wt21_10 = f10.weightAtDay[21];
        const wt21_50 = f50.weightAtDay[21];
        const wt21_90 = f90.weightAtDay[21];
        const wt21_97 = f97.weightAtDay[21];

        this.ga21 = ga21;
        this.wt21 = wt21;

        const wt21_mhSD = f.weight_mhSD[21];
        const wt21_phSD = f.weight_phSD[21];

        const wt21_mhSD_3 = f3.weight_mhSD[21];
        const wt21_phSD_3 = f3.weight_phSD[21];
        const wt21_mhSD_10 = f10.weight_mhSD[21];
        const wt21_phSD_10 = f10.weight_phSD[21];
        const wt21_mhSD_50 = f50.weight_mhSD[21];
        const wt21_phSD_50 = f50.weight_phSD[21];
        const wt21_mhSD_90 = f90.weight_mhSD[21];
        const wt21_phSD_90 = f90.weight_phSD[21];
        const wt21_mhSD_97 = f97.weight_mhSD[21];
        const wt21_phSD_97 = f97.weight_phSD[21];

        const birthPercentile3 = number_format(cumnormdist(zscore3), 9);
        const birthPercentile10 = number_format(cumnormdist(zscore10), 9);
        const birthPercentile50 = number_format(cumnormdist(zscore50), 9);
        const birthPercentile90 = number_format(cumnormdist(zscore90), 9);
        const birthPercentile97 = number_format(cumnormdist(zscore97), 9);

        if (sex === 'male') {
            ihc = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21, wt21_mhSD, wt21_phSD, birthPercentile, zscore, xAxisMax);
            ihc3 = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21_3, wt21_mhSD_3, wt21_phSD_3, birthPercentile3, zscore3, xAxisMax);
            ihc10 = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21_10, wt21_mhSD_10, wt21_phSD_10, birthPercentile10, zscore10, xAxisMax);
            ihc50 = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21_50, wt21_mhSD_50, wt21_phSD_50, birthPercentile50, zscore50, xAxisMax);
            ihc90 = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21_90, wt21_mhSD_90, wt21_phSD_90, birthPercentile90, zscore90, xAxisMax);
            ihc97 = new InfantHypotheticalCalculations(refB_Fenton, refB_WHO, ga21, wt21_97, wt21_mhSD_97, wt21_phSD_97, birthPercentile97, zscore97, xAxisMax);
        } else if (sex === 'female') {
            ihc = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21, wt21_mhSD, wt21_phSD, birthPercentile, zscore, xAxisMax);
            ihc3 = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21_3, wt21_mhSD_3, wt21_phSD_3, birthPercentile3, zscore3, xAxisMax);
            ihc10 = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21_10, wt21_mhSD_10, wt21_phSD_10, birthPercentile10, zscore10, xAxisMax);
            ihc50 = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21_50, wt21_mhSD_50, wt21_phSD_50, birthPercentile50, zscore50, xAxisMax);
            ihc90 = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21_90, wt21_mhSD_90, wt21_phSD_90, birthPercentile90, zscore90, xAxisMax);
            ihc97 = new InfantHypotheticalCalculations(refG_Fenton, refG_WHO, ga21, wt21_97, wt21_mhSD_97, wt21_phSD_97, birthPercentile97, zscore97, xAxisMax);
        }

        const chartData = {
            Fenton: {
                P3: [],
                P10: [],
                P50: [],
                P90: [],
                P97: [],
            },
            WHO: {
                P3: [],
                P10: [],
                P50: [],
                P90: [],
                P97: [],
            },
            Trajectory: {
                P3: [],
                P10: [],
                P50: [],
                P90: [],
                P97: [],
            },
            InfantHypothetical: {
                weight: [],
                weight_mhSD: [],
                weight_phSD: [],
            },
        };

        if (sex === 'male') {
            for (let i = 158; i <= totalDays; i++) {
                chartData.Fenton.P3[i] = refB_Fenton.P3[i];
                chartData.Fenton.P10[i] = refB_Fenton.P10[i];
                chartData.Fenton.P50[i] = refB_Fenton.P50[i];
                chartData.Fenton.P90[i] = refB_Fenton.P90[i];
                chartData.Fenton.P97[i] = refB_Fenton.P97[i];
            }

            for (let i = 294; i <= xAxisMax; i++) {
                chartData.WHO.P3[i] = refB_WHO.P3[i];
                chartData.WHO.P10[i] = refB_WHO.P10[i];
                chartData.WHO.P50[i] = refB_WHO.P50[i];
                chartData.WHO.P90[i] = refB_WHO.P90[i];
                chartData.WHO.P97[i] = refB_WHO.P97[i];
            }
        } else if (sex === 'female') {
            for (let i = 158; i <= totalDays; i++) {
                chartData.Fenton.P3[i] = refG_Fenton.P3[i];
                chartData.Fenton.P10[i] = refG_Fenton.P10[i];
                chartData.Fenton.P50[i] = refG_Fenton.P50[i];
                chartData.Fenton.P90[i] = refG_Fenton.P90[i];
                chartData.Fenton.P97[i] = refG_Fenton.P97[i];
            }

            for (let i = 294; i <= xAxisMax; i++) {
                chartData.WHO.P3[i] = refG_WHO.P3[i];
                chartData.WHO.P10[i] = refG_WHO.P10[i];
                chartData.WHO.P50[i] = refG_WHO.P50[i];
                chartData.WHO.P90[i] = refG_WHO.P90[i];
                chartData.WHO.P97[i] = refG_WHO.P97[i];
            }
        }

        //console.log('totalDays', totalDays)
        for (let i = totalDays; i < ga21; i++) {
            // console.log('f.weightAtDay[i - totalDays + 1]', f.weightAtDay[i - totalDays + 1])
            chartData.InfantHypothetical.weight[i] = f.weightAtDay[i - totalDays + 1];
            chartData.InfantHypothetical.weight_mhSD[i] = f.weight_mhSD[i - totalDays + 1];
            chartData.InfantHypothetical.weight_phSD[i] = f.weight_phSD[i - totalDays + 1];
            chartData.Trajectory.P3[i] = f3.weightAtDay[i - totalDays + 1];
            chartData.Trajectory.P10[i] = f10.weightAtDay[i - totalDays + 1];
            chartData.Trajectory.P50[i] = f50.weightAtDay[i - totalDays + 1];
            chartData.Trajectory.P90[i] = f90.weightAtDay[i - totalDays + 1];
            chartData.Trajectory.P97[i] = f97.weightAtDay[i - totalDays + 1];
        }

        for (let i = ga21; i <= xAxisMax; i++) {
            chartData.InfantHypothetical.weight[i] = ihc.weightAtDay[i];
            chartData.InfantHypothetical.weight_mhSD[i] = ihc.weight_mhSD[i];
            chartData.InfantHypothetical.weight_phSD[i] = ihc.weight_phSD[i];
            chartData.Trajectory.P3[i] = ihc3.weightAtDay[i];
            chartData.Trajectory.P10[i] = ihc10.weightAtDay[i];
            chartData.Trajectory.P50[i] = ihc50.weightAtDay[i];
            chartData.Trajectory.P90[i] = ihc90.weightAtDay[i];
            chartData.Trajectory.P97[i] = ihc97.weightAtDay[i];
        }
        this.totalDays = totalDays;
        this.ga21 = ga21;
        this.wt21 = wt21;
        this.factor = ihc.factor;
        this.birthPercentile = birthPercentile;
        this.birthPercentileRounded = birthPercentileRounded;
        this.chartData = chartData;
    }
}

/*
// Example usage:
const calculator = new TrajectoryCalculator(2500, 40, 0, 'male');
console.log(calculator.chartData);
*/

/*
// Define your RefBFenton, RefGFenton, RefBWHO, RefGWHO, RefBVoigt, RefGVoigt, and First21DaysOfLife classes here

// Example usage:
const calculator = new TrajectoryCalculator(205, 10, 2, 'male');
console.log(calculator.chartData);
*/