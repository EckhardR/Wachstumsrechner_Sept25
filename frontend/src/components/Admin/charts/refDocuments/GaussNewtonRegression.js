export default class GaussNewtonRegression {
  constructor() {
      if (new.target === GaussNewtonRegression) {
          throw new Error("Cannot instantiate abstract class GaussNewtonRegression.");
      }
  }

  /**
   * Compute partial differential of x.
   *
   * Compute the partial differential with respect to a given coefficient for
   * a given value of x.
   *
   * @param {number} x Value of x to supply to partial differential function.
   * @param {number} coefficientIndex Which coefficient to be used in the
   * partial differential function.
   * @param {number[]} coefficients Values of the coefficients to be used.
   * @returns {number} p(x) for the supplied input.
   */
  partialDifferential(x, coefficientIndex, coefficients) {
      throw new Error("Method partialDifferential must be implemented in derived classes.");
  }

  /**
   * Number of coefficients.
   *
   * @returns {number} The number of coefficients for the equation being used.
   * @abstract
   */
  getNumberOfCoefficients() {
      throw new Error("Method getNumberOfCoefficients must be implemented in derived classes.");
  }

  /**
   * Evaluate function at x.
   *
   * Return f(x) for a given set of coefficients.
   *
   * @param {number} x Real value given to the equation.
   * @param {number[]} coefficients Coefficients used in calculation.
   * @returns {number} Value result of equation.
   * @abstract
   */
  getFunction(x, coefficients) {
      throw new Error("Method getFunction must be implemented in derived classes.");
  }

  /**
   * Return the transpose of a matrix.
   *
   * @param {number[][]} matrix Any matrix.
   * @returns {number[][]} A matrix representing transpose.
   */
  transpose(matrix) {
      const result = [];
      for (let row = 0; row < matrix[0].length; ++row) {
          result[row] = [];
          for (let column = 0; column < matrix.length; ++column) {
              result[row][column] = matrix[column][row];
          }
      }
      return result;
  }

  /**
   * Multiply two matrices.
   *
   * @param {number[][]} matrix Matrix B.
   * @param {number[][]} multiplicand Matrix C.
   * @returns {number[][]} Matrix C.
   */
  multiply(matrix, multiplicand) {
      const result = [];
      for (let row = 0; row < matrix.length; ++row) {
          result[row] = [];
          for (let column = 0; column < multiplicand[0].length; ++column) {
              result[row][column] = 0;
              for (let index = 0; index < matrix[row].length; ++index) {
                  result[row][column] += matrix[row][index] * multiplicand[index][column];
              }
          }
      }
      return result;
  }

  /**
   * Get a matrix of how much error is between the calculated value, and the
   * true value.
   *
   * @param {number[]} x Array of x-coordinates.
   * @param {number[]} y Array of known y-coordinates that correspond to x.
   * @param {number[]} coefficients Current coefficients to check for error.
   * @returns {number[][]} Matrix of error at each point.
   */
  getErrorMatrix(x, y, coefficients) {
      if (x.length !== y.length) {
          throw new Error("x and y arrays must have the same length.");
      }

      const result = [];
      for (let row = 0; row < x.length; ++row) {
          result[row] = [y[row] - this.getFunction(x[row], coefficients)];
      }
      return result;
  }

  /**
   * Solve a system of equations in matrix form.
   *
   * @param {number[][]} matrix Square matrix M.
   * @param {number[][]} answers Single column matrix A.
   * @returns {number[][]} Single column matrix C.
   */
  solve(matrix, answers) {
      const degree = matrix.length;
      const order = [];

      for (let row = 0; row < degree; ++row) {
          matrix[row][degree] = answers[row][0];
      }

      const isDone = Array(degree).fill(false);

      for (let column = 0; column < degree; ++column) {
          let activeRow = 0;
          while (activeRow < degree && (matrix[activeRow][column] === 0 || isDone[activeRow])) {
              ++activeRow;
          }

          if (activeRow < degree) {
              order[column] = activeRow;

              const firstTerm = matrix[activeRow][column];
              for (let subColumn = column; subColumn <= degree; ++subColumn) {
                  matrix[activeRow][subColumn] /= firstTerm;
              }

              isDone[activeRow] = true;

              for (let row = 0; row < degree; ++row) {
                  if (!isDone[row] && matrix[row][column] !== 0) {
                      const firstTerm = matrix[row][column];
                      for (let subColumn = column; subColumn <= degree; ++subColumn) {
                          matrix[row][subColumn] -= firstTerm * matrix[activeRow][subColumn];
                      }
                  }
              }
          }
      }

      for (let row = 0; row < degree; ++row) {
          isDone[row] = false;
      }

      const coefficients = [];

      for (let column = degree - 1; column >= 0; --column) {
          const activeRow = order[column];
          isDone[activeRow] = true;

          for (let row = 0; row < degree; ++row) {
              if (!isDone[row]) {
                  const firstTerm = matrix[row][column];
                  for (let subColumn = column; subColumn <= degree; ++subColumn) {
                      matrix[row][subColumn] -= firstTerm * matrix[activeRow][subColumn];
                  }
              }
          }

          coefficients[column] = [matrix[activeRow][degree]];
      }

      return coefficients;
  }

  /**
   * Refine coefficients one round.
   *
   * @param {number[]} x Array of x data points.
   * @param {number[]} y Array of y data points that correspond to x.
   * @param {number[]} coefficients Initial or previous guess at coefficients.
   * @returns {number[]} An array that is the new guess at coefficients.
   */
  refineCoefficients(x, y, coefficients) {
      const numberOfCoefficients = this.getNumberOfCoefficients();
      const jacobianMatrix = [];

      for (let row = 0; row < x.length; ++row) {
          jacobianMatrix[row] = [];
          for (let column = 0; column < numberOfCoefficients; ++column) {
              jacobianMatrix[row][column] = this.partialDifferential(x[row], column, coefficients);
          }
      }

      const jacobianTranspose = this.transpose(jacobianMatrix);
      const jacobianIntermediate = this.multiply(jacobianTranspose, jacobianMatrix);
      const errorMatrix = this.getErrorMatrix(x, y, coefficients);
      const errorIntermediate = this.multiply(jacobianTranspose, errorMatrix);
      const coefficientsDelta = this.solve(jacobianIntermediate, errorIntermediate);

      for (let index = 0; index < numberOfCoefficients; ++index) {
          coefficients[index] += coefficientsDelta[index][0];
      }

      return coefficients;
  }

  /**
   * Compute R-Squared.
   *
   * Compute Coefficient of determination (R squared) for a set of
   * coefficients.
   *
   * @param {number[]} x Array of x data points.
   * @param {number[]} y Array of y data points that correspond to x.
   * @param {number[]} coefficients Current coefficients to compare against.
   * @returns {number} Real value between 0 and 1.
   */
  getR_Squared(x, y, coefficients) {
      const errorMatrix = this.getErrorMatrix(x, y, coefficients);
      const average = y.reduce((sum, value) => sum + value, 0) / y.length;
      let totalSumOfSquares = 0;
      let residualSumOfSquares = 0;

      for (let index = 0; index < errorMatrix.length; ++index) {
          const error = errorMatrix[index][0];
          totalSumOfSquares += Math.pow(y[index] - average, 2);
          residualSumOfSquares += Math.pow(error, 2);
      }

      return 1 - (residualSumOfSquares / totalSumOfSquares);
  }
}
