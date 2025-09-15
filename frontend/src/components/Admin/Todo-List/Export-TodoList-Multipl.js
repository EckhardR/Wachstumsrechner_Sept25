import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { formatDate, returnIfNotNullOrUndefined } from '../../../utils/table/table-tools.js';
import { calculateAge, daysToWeeksText } from '../charts/growth-chart.js';
import { getUserName } from '../../../services/services-tool.js';
import { ButtonSecond } from '../../../utils/global-variables.js';

export default function ExportMultipleTodoList(patients, selectedToExport) {
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
  let currentY = 5; // Initial Y position


  console.log("patients: ", patients)

  // Loop through selected patients
  selectedToExport.forEach(patientId => {
    const patientSelected = patients.find(p => p.ID === patientId);
    // Skip if the patient is not found
    if (!patientSelected) {
      console.error(`Patient with ID ${patientId} not found.`);
      return;
    }

    const patient = patientSelected?.patient;
    const tasks = patientSelected.tasks;

    const patientInfos = `Patient: ${patient.FirstName} ${patient.LastName}, ${formatDate(patient.Birthday)}, ${daysToWeeksText(patient?.GestationalWeek * 7 + patient?.GestationalDay)?.replace(" weeks", "")} SSW, ${patient?.BirthWeight}, ${calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay)} LT, ${daysToWeeksText(calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay))?.replace(" weeks", "")} SSW, ${patient?.lastGewicht}g`;
    pdf.text(patientInfos, textOffset, currentY + 10);



    // Add the todo list table
    const todoListTableData = tasks.map((item) => [item.task.Title, item.task.art, '']);
    pdf.autoTable({
      startY: currentY + 15,
      head: [['Title', 'Art', 'Checkbox']],
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
    // Increment Y position for the next patient
    currentY = pdf.autoTable.previous.finalY + 6;
  });

  // Save the PDF
  pdf.save(`Multiple Todo-list ${new Date()}.pdf`);

}

export const ExportMultiplTasksDialog = (rows, selectedToExport, setSelectedToExport) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (patientID) => {
    const isSelected = selectedToExport.includes(patientID);
    setSelectedToExport(isSelected
      ? selectedToExport.filter(id => id !== patientID)
      : [...selectedToExport, patientID]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedToExport(rows.map(elementPatient => elementPatient?.patient.ID));
    } else {
      setSelectedToExport([]);
    }
  };


  return (     
    <div className='d-flex justify-content-end flex-column'>
      <button onClick={handleSelectAll}
        style={{
          backgroundColor: ButtonSecond,
          padding: 5
        }}
      >
        {selectAll ? 'Unselect All' : 'Select All'}
      </button>
      {
      rows?.map((elementPatient, index) => (
        <div className='border p-2' key={index + elementPatient?.patient.FirstName}>
        <label className='d-flex justify-content-between align-items-center'
        onClick={(e) => {
          e.stopPropagation();
          handleCheckboxChange(elementPatient?.patient.ID);
        }}>
          Patient ID: {returnIfNotNullOrUndefined(elementPatient?.patient.PatientID)} - {returnIfNotNullOrUndefined(elementPatient?.patient.FirstName)}, {returnIfNotNullOrUndefined(elementPatient?.patient.LastName)}
          <input
            type="checkbox"
            style={{ marginLeft: "15px", marginRight: "10px", height:"30px", width:"30px", transform:"scales(1.5)"}}
            checked={selectedToExport.includes(elementPatient?.patient.ID)}
            onChange={(e) => {
              e.stopPropagation();
              handleCheckboxChange(elementPatient?.patient.ID);
            }}
          />
        </label>
      </div>
      
      ))}
    </div>
  );
}