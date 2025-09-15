import jsPDF from 'jspdf';
import { formatDate } from '../../../utils/table/table-tools.js';
import { calculateAge, daysToWeeksText } from '../../Admin/charts/growth-chart.js';
import { API } from '../../../services/Api.js';

import { getUserName } from '../../../services/services-tool.js';

export default function ExportPatientTasks(PatientID) { 
  // Generate PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();

  // Header
  pdf.setFontSize(10);
  const exportDate = new Date().toLocaleString();
  const headerText = `${exportDate} - Growth Calculator`;
  const sometext = "Exported By " + getUserName();
  const textOffset = 10;
  pdf.text(headerText, textOffset, 5);

  // Right-aligned text
  const sometextWidth = pdf.getStringUnitWidth(sometext) * pdf.internal.getFontSize();
  const sometextOffset = pdfWidth - sometextWidth;
  pdf.text(sometext, sometextOffset, 5);


  const loadData = async() => {
    const patient = await API.PatientV2.getWithId(PatientID.toString()).catch( (error) => {
      console.log(error);
      return;
    }).then((result) => result.data)

    const tasks = await API.TasksV2.todayPatientsTasks(PatientID.toString()).catch( (error) => {
      console.log(error);
      return;
    }).then((result) => result.data)

    Promise.all([patient, tasks]).then(results => {
      createPDF(results[0], results[1])
    }).catch(err => {
      console.log(err);
    });
  }

  loadData();

  const createPDF = (patient, tasks) => {
    const patientInfos = `Patient: ${patient.FirstName} ${patient.LastName}, ${formatDate(patient.Birthday)}, ${daysToWeeksText(patient?.GestationalWeek * 7 + patient?.GestationalDay)?.replace(" weeks", "")} SSW, ${patient?.BirthWeight}, ${calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay)} LT, ${daysToWeeksText(calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay))?.replace(" weeks", "")} SSW`; // , ${patient?.lastGewicht}g`;
    pdf.text(patientInfos, textOffset, 15);


    tasks.map((item) => {
      console.log(item)
    })



    // // Add the todo list table
    const todoListTableData = tasks.map((item) => [item.Title, item.Type, '']);
    pdf.autoTable({
      startY: 20,
      head: [['Title', 'Typ', 'Checkbox']],
      body: todoListTableData,
      theme: 'grid',
      tableWidth: pdfWidth - 20,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        lineWidth: 0.5,
        justifyContent: 'start'
      },
      headStyles: {
        fillColor: '#4152B3',
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [235, 235, 235],
      },
      columnStyles: {
        2: { cellWidth: 32 },
      },
    });


    

    // Save the PDF
    pdf.save(`Todo-list ${patient.FirstName}.pdf`);

    console.log("todoListTableData: ", todoListTableData)
  }
}
