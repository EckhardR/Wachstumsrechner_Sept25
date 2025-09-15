import NLR from "./NLR_first21days.js";
import RefB_Voigt from "./refB_Voigt.js";
import RefG_Voigt from "./refG_Voigt.js";
// Assuming you have included the required files and defined the NLR, refB_Voigt, and refG_Voigt classes

export default class First21DaysOfLife {
    constructor(birthweight, gestationalAge_weeks, gestationalAge_days) {
        const gestationalAge = gestationalAge_weeks + (gestationalAge_days / 7);
        this.ageAtDay = [];
        this.ageAtDay[0] = gestationalAge;
        this.ageAtDay[1] = gestationalAge;
        for (let i = 2; i < 22; i++) {
            this.ageAtDay[i] = this.ageAtDay[i - 1] + (1 / 7);
        }

        this.weightAtDay = [
            birthweight,
            birthweight,
            -6.513982 + 0.9777993 * (birthweight) + 0.398823 * (gestationalAge),
            -125.844556 + 0.9408815 * (birthweight) + 4.829184 * (gestationalAge),
            -314.814155 + 0.9117244 * (birthweight) + 11.354897 * (gestationalAge),
            -447.179554 + 0.8854438 * (birthweight) + 16.754568 * gestationalAge,
            -527.776625 + 0.8684316 * (birthweight) + 20.423897 * (gestationalAge),
            -566.811102 + 0.8589796 * (birthweight) + 22.699854 * gestationalAge,
            -599.789604 + 0.856382 * birthweight + 24.576276 * gestationalAge,
            -640.403334 + 0.8502613 * (birthweight) + 26.873875 * (gestationalAge),
            -662.22804 + 0.8517152 * (birthweight) + 28.220906 * (gestationalAge),
            -681.157689 + 0.8547914 * birthweight + 29.364712 * gestationalAge,
            -711.011516 + 0.8565747 * (birthweight) + 31.009605 * (gestationalAge),
            -744.843731 + 0.8630838 * (birthweight) + 32.549322 * (gestationalAge),
            -784.669617 + 0.8674857 * (birthweight) + 34.446809 * (gestationalAge),
            -826.003519 + 0.8684727 * (birthweight) + 36.591251 * (gestationalAge),
            -885.104445 + 0.8703069 * (birthweight) + 39.304744 * (gestationalAge),
            -932.065732 + 0.8699077 * (birthweight) + 41.737307 * (gestationalAge),
            -979.025955 + 0.8744037 * (birthweight) + 43.983239 * (gestationalAge),
            -980.199587 + 0.8801636 * (birthweight) + 44.693989 * (gestationalAge),
            -1009.232221 + 0.8832283 * (birthweight) + 46.40176 * (gestationalAge),
            -1026.778471 + 0.8909545 * (birthweight) + 47.629093 * (gestationalAge)
        ];

        this.standardDeviationAtDay = [
            0,
            0,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 41.19463,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 56.68551,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 57.27456,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 61.28269,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 66.49867,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 71.21363,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 74.14996,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 76.23431,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * gestationalAge) * 78.94615,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 81.79598,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 84.83963,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 88.04881,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 92.9892,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 97.95181,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 103.02615,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 107.86303,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 111.07854,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 113.06069,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 115.92161,
            Math.sqrt(1.34379426893 + 0.00000001249646 * Math.pow(birthweight, 2) + 0.000529756421 * Math.pow(gestationalAge , 2) + 2 * 0.0000466185188 * (birthweight) + 2 * (-0.013238564916) * (gestationalAge) + 2 * (-0.000002137598) * (birthweight) * (gestationalAge)) * 119.8529
        ];

        this.weight_mhSD = [];
        this.weight_phSD = [];
        this.weight_mhSD[0] = birthweight;
        this.weight_mhSD[1] = birthweight;
        this.weight_phSD[0] = birthweight;
        this.weight_phSD[1] = birthweight;
        for (let i = 2; i < this.standardDeviationAtDay.length; i++) {
            this.weight_mhSD[i] = this.weightAtDay[i] - (this.standardDeviationAtDay[i] / 2);
            this.weight_phSD[i] = this.weightAtDay[i] + (this.standardDeviationAtDay[i] / 2);
        }
    }
}


// Usage
//const birthweight = 150 /* Your birthweight value */;
//const gestationalAge_weeks = 4/* Your gestationalAge_weeks value */;
//const gestationalAge_days = 2 /* Your gestationalAge_days value */;
//const sex = 'male' /* Your sex value ('male' or 'female') */;

//const f = new First21DaysOfLife(birthweight, gestationalAge_weeks, gestationalAge_days, sex);

//console.log(f)

