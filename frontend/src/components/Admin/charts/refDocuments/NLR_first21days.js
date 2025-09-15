import GaussNewtonRegression from "./GaussNewtonRegression.js";

class NLR1 extends GaussNewtonRegression {
    /**
     * Partial differential.
     *
     * @param {number} x Value of x.
     * @param {number} coefficientIndex Which coefficient to be used.
     * @param {number[]} coefficients Values of the coefficients.
     * @returns {number} The partial derivative.
     */
    partialDifferential(x, coefficientIndex, coefficients) {
        if (coefficientIndex < 3) {
            let result = 0;

            switch (coefficientIndex) {
                // Partial derivative with respect to first coefficient.
                case 0: {
                    result = Math.pow(coefficients[1], x) * Math.pow(x, coefficients[2]);
                    break;
                }

                // Partial derivative with respect to second coefficient.
                case 1: {
                    result = coefficients[0] * Math.pow(coefficients[1], x - 1) * Math.pow(x, coefficients[2] + 1);
                    break;
                }

                // Partial derivative with respect to third coefficient.
                case 2: {
                    result = coefficients[0] * Math.pow(coefficients[1], x) * Math.pow(x, coefficients[2]) * Math.log(x);
                    break;
                }

                // If this function is called with some other index, throw an error.
                default: {
                    throw new Error("Invalid coefficient index.");
                }
            }

            return result;
        } else {
            throw new Error("Coefficient index out of range.");
        }
    }

    /**
     * Number of coefficients.
     *
     * @returns {number} The number of coefficients for this equation.
     */
    getNumberOfCoefficients() {
        return 3;
    }

    /**
     * Evaluate function at x.
     *
     * @param {number} x Real value given to the equation.
     * @param {number[]} coefficients Coefficients used in calculation.
     * @returns {number} Value result of equation.
     */
    getFunction(x, coefficients) {
        return coefficients[0] * Math.pow(coefficients[1], x) * Math.pow(x, coefficients[2]);
    }
}

class NLR2 extends GaussNewtonRegression {
    /**
     * Partial differential.
     *
     * @param {number} x Value of x.
     * @param {number} coefficientIndex Which coefficient to be used.
     * @param {number[]} coefficients Values of the coefficients.
     * @returns {number} The partial derivative.
     */
    partialDifferential(x, coefficientIndex, coefficients) {
        if (coefficientIndex < 3) {
            let result = 0;

            switch (coefficientIndex) {
                // Partial derivative with respect to first coefficient.
                case 0: {
                    result = 1;
                    break;
                }

                // Partial derivative with respect to second coefficient.
                case 1: {
                    result = x;
                    break;
                }

                // Partial derivative with respect to third coefficient.
                case 2: {
                    result = 1 / Math.pow(x, 2);
                    break;
                }

                // If this function is called with some other index, throw an error.
                default: {
                    throw new Error("Invalid coefficient index.");
                }
            }

            return result;
        } else {
            throw new Error("Coefficient index out of range.");
        }
    }

    /**
     * Number of coefficients.
     *
     * @returns {number} The number of coefficients for this equation.
     */
    getNumberOfCoefficients() {
        return 3;
    }

    /**
     * Evaluate function at x.
     *
     * @param {number} x Real value given to the equation.
     * @param {number[]} coefficients Coefficients used in calculation.
     * @returns {number} Value result of equation.
     */
    getFunction(x, coefficients) {
        return coefficients[0] + (coefficients[1] * x) + (coefficients[2] / Math.pow(x, 2));
    }
}

class NLR3 extends GaussNewtonRegression {
    /**
     * Partial differential.
     *
     * @param {number} x Value of x.
     * @param {number} coefficientIndex Which coefficient to be used.
     * @param {number[]} coefficients Values of the coefficients.
     * @returns {number} The partial derivative.
     */
    partialDifferential(x, coefficientIndex, coefficients) {
        if (coefficientIndex < 3) {
            let result = 0;

            switch (coefficientIndex) {
                // Partial derivative with respect to first coefficient.
                case 0: {
                    result = Math.pow(x, coefficients[2]) * Math.exp(coefficients[0] + (coefficients[1] / x));
                    break;
                }

                // Partial derivative with respect to second coefficient.
                case 1: {
                    result = Math.pow(x, coefficients[2] - 1) * Math.exp(coefficients[0] + (coefficients[1] / x));
                    break;
                }

                // Partial derivative with respect to third coefficient.
                case 2: {
                    result = Math.pow(x, coefficients[2]) * Math.log(x) * Math.exp(coefficients[0] + (coefficients[1] / x));
                    break;
                }

                // If this function is called with some other index, throw an error.
                default: {
                    throw new Error("Invalid coefficient index.");
                }
            }

            return result;
        } else {
            throw new Error("Coefficient index out of range.");
        }
    }

    /**
     * Number of coefficients.
     *
     * @returns {number} The number of coefficients for this equation.
     */
    getNumberOfCoefficients() {
        return 3;
    }

    /**
     * Evaluate function at x.
     *
     * @param {number} x Real value given to the equation.
     * @param {number[]} coefficients Coefficients used in calculation.
     * @returns {number} Value result of equation.
     */
    getFunction(x, coefficients) {
        return Math.exp(coefficients[0] + (coefficients[1] / x) + coefficients[2] * Math.log(x));
    }
}

class NLR4 extends GaussNewtonRegression {
    /**
     * Partial differential.
     *
     * @param {number} x Value of x.
     * @param {number} coefficientIndex Which coefficient to be used.
     * @param {number[]} coefficients Values of the coefficients.
     * @returns {number} The partial derivative.
     */
    partialDifferential(x, coefficientIndex, coefficients) {
        if (coefficientIndex < 3) {
            switch (coefficientIndex) {
                // Partial derivative with respect to first coefficient.
                case 0: {
                    const denominator = Math.pow(
                        coefficients[0] + coefficients[1] * Math.log(x) + coefficients[2] * Math.pow(Math.log(x), 3),
                        2
                    );
                    return -1 / denominator;
                }

                // Partial derivative with respect to second coefficient.
                case 1: {
                    const denominator = Math.pow(
                        coefficients[0] + coefficients[1] * Math.log(x) + coefficients[2] * Math.pow(Math.log(x), 3),
                        2
                    );
                    return -Math.log(x) / denominator;
                }

                // Partial derivative with respect to third coefficient.
                case 2: {
                    const denominator = Math.pow(
                        coefficients[0] + coefficients[1] * Math.log(x) + coefficients[2] * Math.pow(Math.log(x), 3),
                        2
                    );
                    return -Math.pow(Math.log(x), 3) / denominator;
                }

                // If this function is called with some other index, throw an error.
                default: {
                    throw new Error("Invalid coefficient index.");
                }
            }
        } else {
            throw new Error("Coefficient index out of range.");
        }
    }

    /**
     * Number of coefficients.
     *
     * @returns {number} The number of coefficients for this equation.
     */
    getNumberOfCoefficients() {
        return 3;
    }

    /**
     * Evaluate function at x.
     *
     * @param {number} x Real value given to the equation.
     * @param {number[]} coefficients Coefficients used in calculation.
     * @returns {number} Value result of the equation.
     */
    getFunction(x, coefficients) {
        return 1 / (coefficients[0] + coefficients[1] * Math.log(x) + coefficients[2] * Math.pow(Math.log(x), 3));
    }
}

export default class NLR {
    constructor(weights) {
        this.data = [
            [4, weights[0]],
            [5, weights[1]],
            [14, weights[2]],
            [21, weights[3]]
        ];

        this.nlr = [
            new NLR1(),
            new NLR2(),
            new NLR3(),
            new NLR4()
        ];

        this.nlr_initial_coeff = [
            [660, 1.02, -0.08],
            [542, 12, 844],
            [5, 2, 0.4],
            [0.00142571, 0.000135116, -0.0000212]
        ];

        this.nlr_coeff = [];
        this.nlr_error = [];

        for (let i = 0; i < 4; i++) {
            this.nlr_coeff[i] = this.solveRegression(this.nlr[i], this.nlr_initial_coeff[i]);
            this.nlr_error[i] =
                Math.pow(weights[1] - this.nlr[i].getFunction(5, this.nlr_coeff[i]), 2) +
                Math.pow(weights[2] - this.nlr[i].getFunction(14, this.nlr_coeff[i]), 2) +
                Math.pow(weights[3] - this.nlr[i].getFunction(21, this.nlr_coeff[i]), 2);
        }

        this.chosen_nlr_index = this.nlr_error.indexOf(Math.min(...this.nlr_error));
    }

    solveRegression(regression, initialCoefficients) {
        const MAX_ITERATIONS = 50;
        let lastCoefficients = [0, 0, 0];
        let coefficients = initialCoefficients;
        let iteration = 0;

        while (
            JSON.stringify(coefficients) !== JSON.stringify(lastCoefficients) &&
            iteration < MAX_ITERATIONS
        ) {
            lastCoefficients = coefficients;

            coefficients = regression.refineCoefficients(
                this.data.map((item) => item[0]),
                this.data.map((item) => item[1]),
                coefficients
            );

            iteration++;
        }

        return coefficients;
    }
}

/*
  // Usage example:
const n = new NLR([643.7435, 641.4173, 718.8250, 806.9245]);
console.log(n);
const refinedCoefficients = n.nlr_coeff[n.chosen_nlr_index];
console.log("Refined coefficients:", refinedCoefficients);


*/