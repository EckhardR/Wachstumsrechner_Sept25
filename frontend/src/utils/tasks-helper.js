const isBetweenGestationsalter = (patient, lowerValue, upperValue) => {
  // Calculate the total gestational age in days
  const gestationalAgeInDays = patient.GestationalWeek * 7 + patient.GestationalDay;

  // Check if the gestational age is within the specified range
  return gestationalAgeInDays >= lowerValue && gestationalAgeInDays <= upperValue;
};


const isBetweenBirthWeight = (patient, lowerValue, upperValue) => {
  return (patient.BirthWeight >= lowerValue && patient.BirthWeight <= upperValue)
}


const weNeedToProcessIt = (patient, task) => {
  // Extract relevant task parameters
  const {
      LowerWeekLimit,
      UpperWeekLimit,
      LowerBirthWeight,
      UpperBirthWeight,
  } = task;

  // Check if any of the conditions are true
  if (isBetweenGestationsalter(patient, LowerWeekLimit, UpperWeekLimit)) {
      return { "needToBeProcessed": true, "cause": `The patient's gestational age is between ${LowerWeekLimit} and ${UpperWeekLimit} weeks.` };
  }

  if (isBetweenBirthWeight(patient, LowerBirthWeight, UpperBirthWeight)) {
      return { "needToBeProcessed": true, "cause": `The patient's birth weight is between ${LowerBirthWeight} and ${UpperBirthWeight} grams.` };
  }

  // If none of the conditions are true, return a default message
  return { "needToBeProcessed": false, "cause": "No matching conditions found for the patient." };
}

const noValues = (task) => {
  return (task.TaskStartPostmenstrualAge === null || task.TaskStartPostmenstrualAge <=0 || task.DayOfLife === null || task.DayOfLife <= 0)
}

export const getProcessDate = (patient, task) => {
  const toDoNow = weNeedToProcessIt(patient, task);

  if (noValues() === true || toDoNow.needToBeProcessed === false) {
    const date = new Date();
    date.setDate(date.getDate() + 5100); // 720 days in the future
    return null; // date.toISOString().slice(0, 10);
  }

  if (task.TaskStartPostmenstrualAge) {
    // Gestational age in days * 7 + days
    // Example: 252 - gestational age (168)
    // Birth date + (252 - 168) -> Date when Processed
    const gestationalAgeInDays = patient.GestationalWeek * 7 + patient.GestationalDay;
    const postmenstrualAge = task.TaskStartPostmenstrualAge;
    const date = new Date(patient.BirthDate);
    date.setDate(date.getDate() + (postmenstrualAge - gestationalAgeInDays));
    return date.toISOString().slice(0, 10);

  } else if (task.DayOfLife) {
    // Birthday + DayOfLife - 1
    const date = new Date(patient.BirthDate);
    date.setDate(date.getDate() + task.DayOfLife - 1);
    return date.toISOString().slice(0, 10);
  }
}