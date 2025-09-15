import { ChartInfosPreparation } from "./ChartInfosPreparation.js";
import { TrajectoryCalculator } from "./TrajectoryCalculator.js";
import calculateWeightWithFat from "./CalculateGewichtWithFett.js";

const getBorderColor = (percentile, borderColorArray) => {
  const colorObj = borderColorArray.find(
    (item) => item.percentile === percentile
  );
  return colorObj ? colorObj.color : "black";
};

export function calculateAgeOnSpecificDate(
  birthdate,
  gestationalWeek,
  gestationalDay,
  TaskDate
) {
  const birth = new Date(birthdate);
  const currentDate = new Date(TaskDate);
  //console.log('birth', birth, gestationalWeek, gestationalDay, currentDate);
  const gestationalDays = gestationalWeek * 7 + gestationalDay;
  //console.log('gestationalDays', gestationalDays);
  const adjustedBirth = new Date(
    birth.getTime() - gestationalDays * 24 * 60 * 60 * 1000
  );
  const current = new Date(currentDate);
  const ageInMilliseconds = current - adjustedBirth;
  //console.log('ageInMilliseconds', gestationalDays);
  const ageInDays = ageInMilliseconds / (24 * 60 * 60 * 1000);
  //console.log('age', ageInDays)
  return Math.floor(ageInDays);
}

export function getTargetWeight(childData, specificDate, dataArray) {
  const ageInDays = calculateAgeOnSpecificDate(
    childData?.Birthday,
    childData?.GestationalWeek,
    childData?.GestationalDay,
    specificDate
  );
  console.log("get target, age in days", ageInDays, "in weeks ", ageInDays / 7, "childData", childData, "specificDate", specificDate)

  let closestData = null;
  let minDifference = Infinity;

  for (const data of dataArray) {
    const difference = Math.abs(data.x - ageInDays / 7);

    if (data.y && difference < minDifference) {
      minDifference = difference;
      closestData = data;
    }
  }
  console.log("clos data", closestData)
  return closestData ? closestData.y : null;
}
export function sortAndIncrementX(arr, attr) {
  arr.sort((a, b) => a[attr] - b[attr]);
  return arr;
}

export function findLatestTask(array) {
  const today = new Date();
  let latestTask = null;
  let latestTaskDate = null;

  array.forEach((item) => {
    const taskDate = new Date(item.TaskDate);

    if (
      item.Weight != null &&
      item.Weight != undefined &&
      taskDate <= today &&
      (latestTaskDate === null || taskDate > latestTaskDate)
    ) {
      latestTask = item;
      latestTaskDate = taskDate;
    }
  });

  return latestTask;
}

export function getSpecificChartInfos(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  console.log('######', dataTarget)
  switch (dataTarget) {
    case "Traject":
      return getTrajectoryChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "Deviation":
      return getDeviationChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "weight":
      return getWHOChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "length":
      return getWHOChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "headCirmunference":
      return getWHOChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "FatMas":
      return getProzentMasChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "FatFreeMas":
      return getProzentMasChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "ProzentFreeMas":
      return getProzentMasChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "DevFatAdjIwt":
      return getDevFatAdjIwt(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
    case "FatAdjIwt":
      return getTrajectoryFatMasChartData(
        childData,
        growthData,
        xAxisStep,
        xAxisMin,
        xAxisMax,
        yAxisStep,
        yAxisMin,
        yAxisMax,
        dataTarget
      );
      
    default:
      return [[], []];
  }
}

export function getDeviationChartData(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  console.log(
    "childData",
    childData,
    xAxisMax,
    xAxisMin,
    xAxisStep,
    yAxisMax,
    yAxisMin,
    yAxisStep,
    dataTarget
  );
  // Replace this with the actual implementation of the TrajectoryCalculator class in JavaScript
  const {
    BirthLength,
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    HeadCircumference,
  } = childData;
  let otherInfos = [];
  //console.log('Bir', BirthLength, BirthWeight, GestationalDay, GestationalWeek)
  const trajectoryCalculator = new TrajectoryCalculator(
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    xAxisMin,
    xAxisMax * 7,
    yAxisMin,
    yAxisMax,
    dataTarget
  );
  console.log("trajectoryCalculator", trajectoryCalculator);
  const transformData = (data, min, max, step) => {
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data?.chartData) {
      let {
        birthPercentile,
        birthPercentileRounded,
        chartData,
        factor,
        ga21,
        totalDays,
        wt21,
      } = data;
      let { Weight, weight_mhSD, weight_phSD } =
        data?.chartData?.InfantHypothetical;
      //console.log('trajectoryCalculator', data?.chartData)

      const datasets = [];
      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }
      const gestaltDay =
        childData?.GestationalWeek * 7 + childData.GestationalDay;
      const InfantHypothenticalKeyes = ["weight"];
      const InfantHypothenticalLines = {};
      for (const key of InfantHypothenticalKeyes) {
        InfantHypothenticalLines[key] = [];
        InfantHypothenticalLines[key][gestaltDay] =
          data?.chartData?.InfantHypothetical[key][gestaltDay];

        for (let i = gestaltDay + 1; i <= xAxisMax * 7; i++) {
          let value = data?.chartData?.InfantHypothetical[key][i];
          InfantHypothenticalLines[key].push(value);
        }
      }
      //console.log('InfantHypothenticalLines', InfantHypothenticalLines)

      const InfantHypothenticalDatasets = ["weight"].map((percentile) => {
        const isDashed = percentile !== "weight";

        return {
          label: "Target Weight",
          data: InfantHypothenticalLines[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null), // Filter out null values
          fill: false,
          backgroundColor: "rgb(53, 162, 235)",
          borderWidth: 0.2,
          pointRadius: 0, // Set a smaller point radius
          borderDash: [], // Set borderDash for dashed lines
        };
      });
      //console.log('InfantHypothenticalDatasets', InfantHypothenticalDatasets)

      const clientsWeights = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Weight,
        }))
        .filter((item) => item !== null && item.x >= 18)
        .sort((a, b) => a.x - b.x); // Filter out null values

      const deviationWeights = InfantHypothenticalDatasets[0].data
        .map((infantData, index) => {
          const clientData = clientsWeights.find(
            (clientData) => clientData.x === infantData.x
          );
          const deviation = clientData ? clientData.y - infantData.y : 0;
          return {
            x: infantData.x,
            y: deviation,
          };
        })
        .filter((item) => item !== null && item.x >= 18 && item.y !== 0)
        .sort((a, b) => a.x - b.x);

      // Now deviationWeights contains x values and deviation weights for each data point
      // You can use this data for your bar chart to visualize deviation weights.

      // const childDataset = {
      //   label: "deviation Weight",
      //   data: deviationWeights,
      //   fill: false,
      //   borderWidth: 0.2,
      //   backgroundColor: deviationWeights.map((item) =>
      //     item.y >= 0 ? "rgba(6, 147, 227, 0.5)" : "rgba(208, 2, 27, 0.7)"
      //   ),
      //   pointRadius: 1.9, // Set a smaller point radius
      // };

      const highestAndLowestPoints = deviationWeights.reduce((acc, item) => {
        const existing = acc.find((existingItem) => existingItem.x === item.x);

        if (!existing) {
          acc.push({ x: item.x, highest: item.y, lowest: item.y });
        } else {
          if (item.y > 0 && item.y > existing.highest) {
            existing.highest = item.y;
          } else if (item.y < 0 && item.y < existing.lowest) {
            existing.lowest = item.y;
          }
        }

        return acc;
      }, []);

      const lineDataset = {
        label: "Deviation Points",
        data: highestAndLowestPoints
          .map((item) => ({
            x: item.x,
            y: item.y > 0 ? item.highest : item.lowest,
          }))
          .filter((item) => item !== null && item.x >= 18 && item.y !== 0)
          .sort((a, b) => a.x - b.x),
        type: "line",
        backgroundColor: deviationWeights.map((item) =>
          item.y >= 0 ? "rgba(6, 147, 227, 0.5)" : "rgba(208, 2, 27, 0.7)"
        ),
        //borderColor: deviationWeights.map(item => (item.y >= 0 ? 'rgba(6, 147, 227, 0.5)' : 'rgba(208, 2, 27, 0.7)')),
        fill: false,
        borderWidth: 2.5,
        pointRadius: 3.8, // Set a smaller point radius
      };

      //datasets.push(childDataset)
      datasets.push(lineDataset);
      //InfantHypothenticalDatasets?.map((data) => datasets.push(data));

      console.log("last Task", lastTask)
      const targetWeight = getTargetWeight(
        childData,
        lastTask?.TaskDate,
        InfantHypothenticalDatasets[0]?.data
      );

      //console.log('Deviation Weights:', deviationWeights);
      //console.log('childDataset Weights:', childDataset);
      //console.log('targetWeight data ala3wd', targetWeight)
      otherInfos = {
        percentile: trajectoryCalculator?.birthPercentile,
        percentileRounded: trajectoryCalculator?.birthPercentileRounded,
        ga21: trajectoryCalculator?.ga21,
        factor: trajectoryCalculator?.factor,
        totalDays: trajectoryCalculator?.totalDays,
        wt21: trajectoryCalculator?.wt21,
        currentWeight: lastTask?.Weight,
        targetWeight: targetWeight,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(trajectoryCalculator, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}


export function getTrajectoryChartData(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  console.log(
    "childData",
    childData,
    xAxisMax,
    xAxisMin,
    xAxisStep,
    yAxisMax,
    yAxisMin,
    yAxisStep,
    dataTarget
  );
  // Replace this with the actual implementation of the TrajectoryCalculator class in JavaScript
  const {
    BirthLength,
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    HeadCircumference,
  } = childData;
  let otherInfos = [];
  //console.log('Bir', BirthLength, BirthWeight, GestationalDay, GestationalWeek)
  const trajectoryCalculator = new TrajectoryCalculator(
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    xAxisMin,
    xAxisMax * 7,
    yAxisMin,
    yAxisMax,
    dataTarget
  );
  console.log("trajectoryCalculator", trajectoryCalculator);
  const getsaltDays =
    childData?.GestationalWeek * 7 + childData?.GestationalDay;
  const transformData = (data, min, max, step) => {
    const borderColorArray = [
      { percentile: "P3", color: "#4D4D4D" },
      { percentile: "P10", color: "#4D4D4D" },
      { percentile: "P50", color: "#4D4D4D" },
      { percentile: "P90", color: "#4D4D4D" },
      { percentile: "P97", color: "#4D4D4D" },
      { percentile: "weight", color: "#00D084" },
      { percentile: "weight_mhSD", color: "#00D084" },
      { percentile: "weight_phSD", color: "#00D084" },
    ];
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data?.chartData) {
      let {
        birthPercentile,
        birthPercentileRounded,
        chartData,
        factor,
        ga21,
        totalDays,
        wt21,
      } = data;
      let { Weight, weight_mhSD, weight_phSD } =
        data?.chartData?.InfantHypothetical;
      //console.log('trajectoryCalculator', data?.chartData)

      const keys = ["P3", "P10", "P50", "P90", "P97"];
      const WHOLines = {};
      for (const key of keys) {
        WHOLines[key] = [];
        WHOLines[key][158] = chartData.Fenton[key][158];

        for (let i = 159; i <= xAxisMax * 7; i++) {
          let value =
            chartData.Fenton[key][i] ||
            chartData.Trajectory[key][i] ||
            chartData.WHO[key][i];
          WHOLines[key].push(value);
        }
      }
      //console.log('results of fetch function', chartData)

      //console.log('growthData of fetch function', growthData)
      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }
      const datasets = ["P3", "P10", "P50", "P90", "P97"]?.map(
        (percentile) => ({
          label: percentile,
          data: WHOLines[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null), // Filter out null values
          fill: false,
          borderColor: getBorderColor(percentile, borderColorArray),
          backgroundColor: getBorderColor(percentile, borderColorArray),
          borderWidth: 1.5,
          pointRadius: 0, // Set a smaller point radius
        })
      );
      const InfantHypothenticalKeyes = ["weight", "weight_mhSD", "weight_phSD"];
      const InfantHypothenticalLines = {};
      for (const key of InfantHypothenticalKeyes) {
        InfantHypothenticalLines[key] = [];
        InfantHypothenticalLines[key][getsaltDays] =
          data?.chartData?.InfantHypothetical[key][getsaltDays];

        for (let i = getsaltDays + 1; i <= xAxisMax * 7; i++) {
          let value = data?.chartData?.InfantHypothetical[key][i];
          InfantHypothenticalLines[key].push(value);
        }
      }
      //console.log('InfantHypothenticalLines', InfantHypothenticalLines)

      const InfantHypothenticalDatasets = [
        "weight",
        "weight_mhSD",
        "weight_phSD",
      ].map((percentile) => {
        const isDashed = percentile !== "weight";

        return {
          label: percentile == "weight" ? "Target Weight" : percentile,
          data: InfantHypothenticalLines[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null), // Filter out null values
          fill: false,
          borderColor: getBorderColor(percentile, borderColorArray),
          backgroundColor: "#00D084",
          borderWidth: !isDashed ? 1.9 : 1.3,
          pointRadius: 0, // Set a smaller point radius
          borderDash: isDashed ? [5, 5] : [], // Set borderDash for dashed lines
        };
      });
      //console.log('InfantHypothenticalDatasets', InfantHypothenticalDatasets)

      const clientsWeights = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Weight,
        }))
        .filter((item) => item !== null && item.x >= 18)
        .sort((a, b) => a.x - b.x); // Filter out null values

      const childDataset = {
        label: "Patient Weight",
        data: clientsWeights,
        fill: false,
        borderColor: "#0D47A1",
        backgroundColor: "#EB144C",
        borderWidth: 1.2,
        pointRadius: 2.9, // Set a smaller point radius
      };
      //console.log('childDataset', childDataset)
      //console.log('datasets', datasets)
      //console.log('labels', labels)
      datasets.push(childDataset);
      InfantHypothenticalDatasets?.map((data) => datasets.push(data));
      //console.log('InfantHypothenticalDatasets data ala3wd', InfantHypothenticalDatasets)

      console.log("last Task", lastTask)
      const targetWeight = getTargetWeight(
        childData,
        lastTask?.TaskDate,
        InfantHypothenticalDatasets[0]?.data
      );

      //console.log('targetWeight data ala3wd', targetWeight)
      otherInfos = {
        percentile: trajectoryCalculator?.birthPercentile,
        percentileRounded: trajectoryCalculator?.birthPercentileRounded,
        ga21: trajectoryCalculator?.ga21,
        factor: trajectoryCalculator?.factor,
        totalDays: trajectoryCalculator?.totalDays,
        wt21: trajectoryCalculator?.wt21,
        currentWeight: lastTask?.Weight,
        targetWeight: targetWeight,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(trajectoryCalculator, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}

export function getWHOChartData(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  //console.log('childData', childData, xAxisMax, xAxisMin, xAxisStep, yAxisMax, yAxisMin, yAxisStep, dataTarget)
  // Replace this with the actual implementation of the TrajectoryCalculator class in JavaScript
  const {
    BirthLength,
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    HeadCircumference,
  } = childData;
  let otherInfos = [];
  //console.log('Bir', BirthLength, BirthWeight, GestationalDay, GestationalWeek)
  const chartInfosPreparation = new ChartInfosPreparation(
    Gender,
    xAxisMin,
    xAxisMax,
    GestationalWeek,
    GestationalDay,
    dataTarget
  );
  console.log("trajectoryCalculator", chartInfosPreparation);
  const transformData = (data, min, max, step) => {
    const borderColorArray = [
      { percentile: "P3", color: "#4D4D4D" },
      { percentile: "P10", color: "#4D4D4D" },
      { percentile: "P50", color: "#4D4D4D" },
      { percentile: "P90", color: "#4D4D4D" },
      { percentile: "P97", color: "#4D4D4D" },
    ];
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data?.chartData) {
      let { chartData, totalDays } = data;
      //console.log('trajectoryCalculator', data?.chartData)

      const keys = ["P3", "P10", "P50", "P90", "P97"];
      const WHOLines = {};
      for (const key of keys) {
        WHOLines[key] = [];
        WHOLines[key][158] = chartData.WHO[key][158];

        for (let i = 159; i <= xAxisMax * 7; i++) {
          let value = chartData.WHO[key][i];
          WHOLines[key].push(value);
        }
      }
      //console.log('results of fetch function', chartData)

      console.log("growthData of fetch function", growthData);
      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }
      const datasets = ["P3", "P10", "P50", "P90", "P97"]?.map(
        (percentile) => ({
          label: percentile,
          data: WHOLines[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter(
              (item) => item !== null && item.y !== undefined && item.y !== null
            ), // Filter out null values
          fill: false,
          borderColor: getBorderColor(percentile, borderColorArray),
          backgroundColor: getBorderColor(percentile, borderColorArray),
          borderWidth: 1.5,
          pointRadius: 0, // Set a smaller point radius
        })
      );

      const clients_Length = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Length,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x); // Filter out null values

      const clients_Weights = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Weight,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x); // Filter out null values

      const clients_HeadCircum = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.HeadCircumference,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x);

      const childDataset = {
        label:
          dataTarget === "headCirmunference"
            ? "Patient Head Circumference"
            : dataTarget === "length"
            ? "Patient Length"
            : "Patient Weight",
        data:
          dataTarget === "headCirmunference"
            ? clients_HeadCircum
            : dataTarget === "length"
            ? clients_Length
            : clients_Weights,
        fill: false,
        borderColor: "#0D47A1",
        backgroundColor: "#EB144C",
        borderWidth: 1.2,
        pointRadius: 2.9, // Set a smaller point radius
      };
      console.log("childDataset", childDataset);
      //console.log('datasets', datasets)
      //console.log('labels', labels)
      datasets.push(childDataset);
      //console.log('InfantHypothenticalDatasets data ala3wd', InfantHypothenticalDatasets)

      //const targetWeight = getTargetWeight(childData, lastTask?.TaskDate, InfantHypothenticalDatasets[0]?.data)

      //console.log('targetWeight data ala3wd', targetWeight)
      otherInfos = {
        percentile: null,
        percentileRounded: null,
        ga21: null,
        factor: null,
        totalDays: null,
        wt21: null,
        currentWeight: lastTask?.Weight,
        targetWeight: null,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(chartInfosPreparation, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}

export function getProzentMasChartData(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  let otherInfos = [];
  const transformData = (data, min, max, step) => {
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data) {
      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }

      const clients_Percent_fat_mass = data
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.PercentFatFreeMass,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x);

      const clients_Fatfreemass = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.FatFreeMass,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x);

      const clients_Fatmass = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.FatMass,
        }))
        .filter(
          (item) =>
            item !== null &&
            item.x >= 18 &&
            item.y !== undefined &&
            item.y !== null
        )
        .sort((a, b) => a.x - b.x);

      const childDataset = {
        label:
          dataTarget === "ProzentFreeMas"
            ? "Percent fat mass (%)"
            : dataTarget === "FatMas (g)"
            ? "Fat mass"
            : "Fat-free mass (g)",
        data:
          dataTarget === "ProzentFreeMas"
            ? clients_Percent_fat_mass
            : dataTarget === "FatMas"
            ? clients_Fatmass
            : clients_Fatfreemass,
        fill: false,
        borderColor: "#0D47A1",
        backgroundColor: "#BBDEFB",
        borderWidth: 1.2,
        pointRadius: 2.9, // Set a smaller point radius
      };
      const datasets = [];
      datasets.push(childDataset);

      otherInfos = {
        percentile: null,
        percentileRounded: null,
        ga21: null,
        factor: null,
        totalDays: null,
        wt21: null,
        currentWeight: lastTask?.Weight,
        targetWeight: null,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(growthData, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}

export function getTrajectoryFatMasChartData(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  console.log(
    "childData",
    childData,
    xAxisMax,
    xAxisMin,
    xAxisStep,
    yAxisMax,
    yAxisMin,
    yAxisStep,
    dataTarget
  );
  // Replace this with the actual implementation of the TrajectoryCalculator class in JavaScript
  const {
    BirthLength,
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    HeadCircumference,
  } = childData;
  let otherInfos = [];
  //console.log('Bir', BirthLength, BirthWeight, GestationalDay, GestationalWeek)
  const trajectoryCalculator = new TrajectoryCalculator(
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    xAxisMin,
    xAxisMax * 7,
    yAxisMin,
    yAxisMax,
    dataTarget
  );
  //console.log('trajectoryCalculator', trajectoryCalculator)
  const getsaltDays =
    childData?.GestationalWeek * 7 + childData?.GestationalDay;
  const transformData = (data, min, max, step) => {
    const borderColorArray = [
      { percentile: "P3", color: "#4D4D4D" },
      { percentile: "P10", color: "#4D4D4D" },
      { percentile: "P50", color: "#4D4D4D" },
      { percentile: "P90", color: "#4D4D4D" },
      { percentile: "P97", color: "#4D4D4D" },
      { percentile: "weight", color: "#ff8300" },
      { percentile: "weight_mhSD", color: "#ff8300" },
      { percentile: "weight_phSD", color: "#ff8300" },
    ];
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data?.chartData) {
      let {
        birthPercentile,
        birthPercentileRounded,
        chartData,
        factor,
        ga21,
        totalDays,
        wt21,
      } = data;
      let { Weight, weight_mhSD, weight_phSD } =
        data?.chartData?.InfantHypothetical;
      //console.log('trajectoryCalculator', data?.chartData)

      const keys = ["P3", "P10", "P50", "P90", "P97"];
      const WHOLines = {};
      for (const key of keys) {
        WHOLines[key] = [];
        WHOLines[key][158] = chartData.Fenton[key][158];

        for (let i = 159; i <= xAxisMax * 7; i++) {
          let value =
            chartData.Fenton[key][i]
            // chartData.Trajectory[key][i] ||
            // chartData.WHO[key][i];

          WHOLines[key].push(value);
        }
      }

      /// NEW
      const who2 = {}
      for (const key of keys) {
        who2[key] = [];
        for (let i = 159; i <= xAxisMax * 7; i++) {
          let value =
            // chartData.Fenton[key][i]
            chartData.Trajectory[key][i] ||
            chartData.WHO[key][i];
            
          who2[key].push(value);
        }
      }

      const gestaltDay =
        childData?.GestationalWeek * 7 + childData.GestationalDay;

      const who3 = {}
      for (let key in who2) {
        who3[key] = calculateWeightWithFat(
          who2[key],
          gestaltDay,
          false
        );
      }

       for (let key in who3) {
          for(let i = 158; i < who3[key].length - 1; i++){
            if(isNaN(who3[key][i]) || who3[key][i] === undefined) {
              who3[key][i] = WHOLines[key][i]
            }
          }

       }
      
      //console.log('results of fetch CalculateGewichtWithFett', chartData.Fenton['P3'])

      //console.log('InfantHypothenticalDatasets', InfantHypothenticalDatasets)

      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }
      
      const AdaptedWHoLines = {};
      for (let key in WHOLines) {
        AdaptedWHoLines[key] = calculateWeightWithFat(
          WHOLines[key],
          gestaltDay,
          true
        );
      }
      const datasets = ["P3", "P10", "P50", "P90", "P97"]?.map(
        (percentile) => ({
          label: percentile,
          data: who3[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null), // Filter out null values
          fill: false,
          borderColor: getBorderColor(percentile, borderColorArray),
          backgroundColor: getBorderColor(percentile, borderColorArray),
          borderWidth: 1.5,
          pointRadius: 0, // Set a smaller point radius
        })
      );
      const InfantHypothenticalKeyes = ["weight", "weight_mhSD", "weight_phSD"];
      const InfantHypothenticalLines = {};
      for (const key of InfantHypothenticalKeyes) {
        InfantHypothenticalLines[key] = [];
        InfantHypothenticalLines[key][getsaltDays] =
          data?.chartData?.InfantHypothetical[key][getsaltDays];

        for (let i = getsaltDays + 1; i <= xAxisMax * 7; i++) {
          let value = data?.chartData?.InfantHypothetical[key][i];
          InfantHypothenticalLines[key].push(value);
        }
      }
      const AdaptedInfantHypothenticalLines = {};
      for (let key in InfantHypothenticalLines) {
        AdaptedInfantHypothenticalLines[key] = calculateWeightWithFat(
          InfantHypothenticalLines[key],
          gestaltDay,
          false
        );
      }

      const InfantHypothenticalDatasets = [
        "weight",
        "weight_mhSD",
        "weight_phSD",
      ].map((percentile) => {
        const isDashed = percentile !== "weight";

        return {
          label: percentile == "weight" ? "Target Weight" : percentile,
          data: AdaptedInfantHypothenticalLines[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null), // Filter out null values
          fill: false,
          borderColor: getBorderColor(percentile, borderColorArray),
          backgroundColor: "#00D084",
          borderWidth: !isDashed ? 1.9 : 1.3,
          pointRadius: 0, // Set a smaller point radius
          borderDash: isDashed ? [5, 5] : [], // Set borderDash for dashed lines
        };
      });

      const clientsWeights = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Weight,
        }))
        .filter((item) => item !== null && item.x >= 18)
        .sort((a, b) => a.x - b.x); // Filter out null values

      const childDataset = {
        label: "Patient Weight",
        data: clientsWeights,
        fill: false,
        borderColor: "#0D47A1",
        backgroundColor: "#EB144C",
        borderWidth: 1.2,
        pointRadius: 2.9,
      };
      datasets.push(childDataset);
      InfantHypothenticalDatasets?.map((data) => datasets.push(data));
      console.log("last Task", lastTask)
      const targetWeight = getTargetWeight(
        childData,
        lastTask?.TaskDate,
        InfantHypothenticalDatasets[0]?.data
      );

      otherInfos = {
        percentile: trajectoryCalculator?.birthPercentile,
        percentileRounded: trajectoryCalculator?.birthPercentileRounded,
        ga21: trajectoryCalculator?.ga21,
        factor: trajectoryCalculator?.factor,
        totalDays: trajectoryCalculator?.totalDays,
        wt21: trajectoryCalculator?.wt21,
        currentWeight: lastTask?.Weight,
        targetWeight: targetWeight,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(trajectoryCalculator, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}

export function getDevFatAdjIwt(
  childData,
  growthData,
  xAxisStep,
  xAxisMin,
  xAxisMax,
  yAxisStep,
  yAxisMin,
  yAxisMax,
  dataTarget
) {
  const lastTask = findLatestTask(growthData);
  //console.log('childData', childData, xAxisMax, xAxisMin, xAxisStep, yAxisMax, yAxisMin, yAxisStep, dataTarget)
  // Replace this with the actual implementation of the TrajectoryCalculator class in JavaScript
  const {
    BirthLength,
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    HeadCircumference,
  } = childData;
  let otherInfos = [];
  //console.log('Bir', BirthLength, BirthWeight, GestationalDay, GestationalWeek)
  const trajectoryCalculator = new TrajectoryCalculator(
    BirthWeight,
    GestationalWeek,
    GestationalDay,
    Gender,
    xAxisMin,
    xAxisMax * 7,
    yAxisMin,
    yAxisMax,
    dataTarget
  );
  //console.log('trajectoryCalculator', trajectoryCalculator)
  const gestaltDay = childData?.GestationalWeek * 7 + childData.GestationalDay;
  const transformData = (data, min, max, step) => {
    const labels = [];
    //console.log('dat, dataa',  data)
    if (data?.chartData) {
      const datasets = [];
      for (let i = min; i <= max; i += step) {
        labels.push(i); // Divide by 7 to convert days to weeks
      }
      const InfantHypothenticalKeyes = ["weight"];
      const InfantHypothenticalLines = {};
      for (const key of InfantHypothenticalKeyes) {
        InfantHypothenticalLines[key] = [];
        InfantHypothenticalLines[key][gestaltDay] =
          data?.chartData?.InfantHypothetical[key][gestaltDay];

        for (let i = gestaltDay + 1; i <= xAxisMax * 7; i++) {
          let value = data?.chartData?.InfantHypothetical[key][i];
          InfantHypothenticalLines[key].push(value);
        }
      }
      const AdaptedInfantHypothenticalLines = {};
      for (let key in InfantHypothenticalLines) {
        AdaptedInfantHypothenticalLines[key] = calculateWeightWithFat(
          InfantHypothenticalLines[key],
          gestaltDay,
          true
        );
      }
      //console.log('InfantHypothenticalLines', InfantHypothenticalLines)


      /// ******

      console.log("data.chartData", data.chartData)

       /// NEW
       const keys = ["weight"];
      const who2 = {}
      for (const key of keys) {
        who2[key] = [];
        for (let i = 185; i <= xAxisMax * 7; i++) {
          let value =
            // chartData.Fenton[key][i]
            data.chartData.InfantHypothetical['weight'][i]
          who2[key].push(value);
        }
      }


      const who3 = {}
      for (let key in who2) {
        who3[key] = calculateWeightWithFat(
          who2[key],
          gestaltDay,
          false
        );
      }


      console.log('who3: ', who3)

      //// ******

      const InfantHypothenticalDatasets = ["weight"].map((percentile) => {
        const isDashed = percentile !== "weight";

        return {
          label: "Target Weight",
          data: who3[percentile]
            .map((item, index) => ({
              x: index / 7, // Assuming the x value starts from 160
              y: item,
            }))
            .filter((item) => item !== null)
            .sort((a, b) => a.x - b.x), // Filter out null values
          fill: false,
          backgroundColor: "rgb(53, 162, 235)",
          borderWidth: 0.2,
          pointRadius: 0, // Set a smaller point radius
          borderDash: [], // Set borderDash for dashed lines
        };
      });
      //console.log('InfantHypothenticalDatasets', InfantHypothenticalDatasets)
      

      const clientsWeights = growthData
        .map((item, index) => ({
          x:
            calculateAgeOnSpecificDate(
              childData?.Birthday,
              childData?.GestationalWeek,
              childData?.GestationalDay,
              item?.TaskDate
            ) / 7,
          y: item?.Weight,
        }))
        .filter((item) => item !== null && item.x >= 18)
        .sort((a, b) => a.x - b.x); // Filter out null values

      const deviationWeights = InfantHypothenticalDatasets[0].data
        .map((infantData, index) => {
          const clientData = clientsWeights.find(
            (clientData) => clientData.x === infantData.x
          );
          const deviation = clientData ? clientData.y - infantData.y : 0;
          return {
            x: infantData.x,
            y: deviation,
          };
        })
        .filter((item) => item !== null && item.x >= 18 && item.y !== 0)
        .sort((a, b) => a.x - b.x);

      // Now deviationWeights contains x values and deviation weights for each data point
      // You can use this data for your bar chart to visualize deviation weights.

      const childDataset = {
        label: "deviation Weight",
        data: deviationWeights,
        fill: false,
        borderWidth: 0.2,
        backgroundColor: deviationWeights.map((item) =>
          item.y >= 0 ? "rgba(6, 147, 227, 0.5)" : "rgba(208, 2, 27, 0.7)"
        ),
        pointRadius: 1.9, // Set a smaller point radius
      };

      const highestAndLowestPoints = deviationWeights.reduce((acc, item) => {
        const existing = acc.find((existingItem) => existingItem.x === item.x);

        if (!existing) {
          acc.push({ x: item.x, highest: item.y, lowest: item.y });
        } else {
          if (item.y > 0 && item.y > existing.highest) {
            existing.highest = item.y;
          } else if (item.y < 0 && item.y < existing.lowest) {
            existing.lowest = item.y;
          }
        }

        return acc;
      }, []);

      const lineDataset = {
        label: "Deviation Points",
        data: highestAndLowestPoints
          .map((item) => ({
            x: item.x,
            y: item.y > 0 ? item.highest : item.lowest,
          }))
          .filter((item) => item !== null && item.x >= 18 && item.y !== 0)
          .sort((a, b) => a.x - b.x),
        type: "line",
        backgroundColor: deviationWeights.map((item) =>
          item.y >= 0 ? "rgba(6, 147, 227, 0.5)" : "rgba(208, 2, 27, 0.7)"
        ),
        //borderColor: deviationWeights.map(item => (item.y >= 0 ? 'rgba(6, 147, 227, 0.5)' : 'rgba(208, 2, 27, 0.7)')),
        fill: true,
        borderWidth: 2.5,
        pointRadius: 3.8, // Set a smaller point radius
      };

      console.log("lineDataset", lineDataset)
      //datasets.push(childDataset)
      datasets.push(lineDataset);
      //InfantHypothenticalDatasets?.map((data) => datasets.push(data));
      console.log("last Task", lastTask)
      const targetWeight = getTargetWeight(
        childData,
        lastTask?.TaskDate,
        InfantHypothenticalDatasets[0]?.data
      );

      //console.log('Deviation Weights:', deviationWeights);
      //console.log('childDataset Weights:', childDataset);
      //console.log('targetWeight data ala3wd', targetWeight)
      otherInfos = {
        percentile: trajectoryCalculator?.birthPercentile,
        percentileRounded: trajectoryCalculator?.birthPercentileRounded,
        ga21: trajectoryCalculator?.ga21,
        factor: trajectoryCalculator?.factor,
        totalDays: trajectoryCalculator?.totalDays,
        wt21: trajectoryCalculator?.wt21,
        currentWeight: lastTask?.Weight,
        targetWeight: targetWeight,
      };

      return {
        labels,
        datasets,
      };
    } else return null;
  };

  return {
    data: transformData(trajectoryCalculator, xAxisMin, xAxisMax, xAxisStep),
    otherInfos: otherInfos,
  };
}
