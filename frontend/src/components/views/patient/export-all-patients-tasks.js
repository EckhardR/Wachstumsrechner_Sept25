import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { formatDate, returnIfNotNullOrUndefined } from '../../../utils/table/table-tools.js';
import { calculateAge, daysToWeeksText } from '../../Admin/charts/growth-chart.js';
import { getUserName } from '../../../services/services-tool.js';
import { ButtonSecond } from '../../../utils/global-variables.js';
import { API } from '../../../services/Api.js';

export default function ExportAllPatientsTasks(patients, selectedToExport, setSelectedToExport) {

  
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


  const loadData = async() => {

    console.log('selectedToExport: ', selectedToExport)

  try {
    const result = await API.TasksV2.todayMultiplePatientsTasks(selectedToExport);

    if (result && result.data) {
      printPDF(filterToPrint(patients, result.data))      
    }

    } catch (err) {
      console.log(err.message);
    }
  }

  loadData();

  const filterToPrint = (patients, data) =>{
    const obj = {}
    patients.forEach((item, index) => {
      if(!obj[item.ID]) {
        obj[item.ID] = {
          patient: item,
          tasks: []
        }
      }

      data.forEach((element) => {    
        if (element.PatientID === item.ID) {
          obj[item.ID].tasks.push(element)
        }
      })      
    })


    const arr = []

   

    for (const [key, line] of Object.entries(obj)) {
      console.log('line: ', line)
      if(line.tasks.length > 0){
        arr.push(line);
      }
    }
    console.log('obj: ', arr)
    return arr;
  }


  const printPDF = (all) => {

    // Loop through selected patients

    console.log('all: ', all)

    all.forEach((line) => {

      const patient = line?.patient;
      const tasks = line.tasks;

      // Skip if the patient is not found
      if (!tasks || tasks.length === 0) {
        console.error(`No Tasks for Patient ID ${patient}.`, patient.FirstName);
      }

      const patientInfos = `Patient: ${patient.FirstName} ${patient.LastName}, ${formatDate(patient.Birthday)}, ${daysToWeeksText(patient?.GestationalWeek * 7 + patient?.GestationalDay)?.replace(" weeks", "")} SSW, ${patient?.BirthWeight}, ${calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay)} LT, ${daysToWeeksText(calculateAge(patient?.Birthday, patient?.GestationalWeek, patient?.GestationalDay))?.replace(" weeks", "")} SSW`;
      pdf.text(patientInfos, textOffset, currentY + 10);

      // Add the todo list table
      const todoListTableData = tasks.map((item) => [item.Title, item.Type, '']);
      pdf.autoTable({
        startY: currentY + 15,
        head: [['Title', 'Type', 'Checkbox']],
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

    setSelectedToExport([])
  }

}

export const ExportMultiplTasksDialog = (props) => {

  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (patientID) => {
    const isSelected = props.selectedToExport.includes(patientID);
    props.setSelectedToExport(isSelected
      ? props.selectedToExport.filter(id => id !== patientID)
      : [...props.selectedToExport, patientID]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll && props.rows.map) {
      props.setSelectedToExport(props.rows.map(elementPatient => elementPatient.ID));
    } else {
      props.setSelectedToExport([]);
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
        {
          selectAll ? 'Unselect All' : 'Select All'
        }
      </button>

      { props.selectedToExport && props?.rows && props.rows.length >0 && props?.rows?.map((elementPatient, index) => (        
        <div className='border p-2' key={index + elementPatient?.FirstName}>
        
          <label className='d-flex justify-content-between align-items-center'
          onClick={(e) => {
            e.stopPropagation();
            handleCheckboxChange(elementPatient?.ID);
          }}>
            Patient ID: {returnIfNotNullOrUndefined(elementPatient?.ID)} - {returnIfNotNullOrUndefined(elementPatient?.FirstName)}, {returnIfNotNullOrUndefined(elementPatient?.LastName)}
            <input
              type="checkbox"
              style={{ marginLeft: "15px", marginRight: "10px", height:"30px", width:"30px", transform:"scales(1.5)"}}
              checked={props.selectedToExport.includes(elementPatient?.ID)}
              onChange={(e) => {
                e.stopPropagation();
                handleCheckboxChange(elementPatient?.ID);
              }}
            />
          </label>
        
        </div>
          
       ))
      }
    </div>
    
  );
  
}