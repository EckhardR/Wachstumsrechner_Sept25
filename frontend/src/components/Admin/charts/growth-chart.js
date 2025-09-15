import React, { useEffect, useRef, useState, useReducer } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
    Chart,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Legend,
    LineController,
    Tooltip,
    BarElement,
} from "chart.js";
import {
    Box,
    Button,
    ButtonGroup,
    FormLabel,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { ButtonFirst, ButtonSecond, TextFirst } from "../../../utils/global-variables.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import {
    DevFatAdjIwtIcon,
    DeviationIcon,
    DifferenceIcon,
    FatAdjIwtIcon,
    HeadCircumferenceIcon,
    LengthIcon,
    WeightIcon,
    downloadIcon,
    fatFreeMass,
    fatMassIcon,
} from "../../../utils/global-icons.js";
import GrowthDataShower from "./growth-Data-shower.js";
import { useLocation } from "react-router-dom";
import { getSpecificChartInfos } from "./get-chart-data.js";
import { formatDate } from "../../../utils/table/table-tools.js";
import { getUserName } from "../../../services/services-tool.js";
import { useTranslation } from "react-i18next";

Chart.register(
    LinearScale,
    BarElement,
    CategoryScale,
    PointElement,
    Legend,
    LineElement,
    LineController,
    Tooltip
);

export function daysToWeeksText(days) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return `${weeks?.toFixed(0)} + ${remainingDays?.toFixed(0)}/7 weeks`;
}

export function calculateAge(birthdate, gestationalWeek, gestationalDay) {
    const birth = new Date(birthdate);
    const currentDate = new Date();
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

const GrowthChart = ({ childData, growthData, forceUpdate, updateState }) => {
    const location = useLocation();
    const { t } = useTranslation();
    const [dataTarget, setDataTarget] = useState("weight");
    const [chartData, setChartData] = useState(
        location.state?.chartData || {
            labels: [],
            datasets: [],
        }
    );
    const [otherInfo, setOtherInfo] = useState(location.state?.otherInfo || []);
    const [xAxisMin, setXAxisMin] = useState(23);
    const [xAxisMax, setXAxisMax] = useState(44);
    const [yAxisMin, setYAxisMin] = useState(0);
    const [yAxisMax, setYAxisMax] = useState(5500);
    const [xAxisStep, setXAxisStep] = useState(2);
    const [yAxisStep, setYAxisStep] = useState(500);
    const [yTitle, setYTitle] = useState("Weight (g)");

    // Inside the GrowthChart component
    const growthDataShowerRef = useRef();

    function exportChartAsPDF() {
        const tableData = [
            ["ID", childData.ID],
            ["First Name", childData.FirstName],
            ["Last Name", childData.LastName],
            ["Gender", childData.Gender],
            ["Birth Weight", childData.BirthWeight],
            ["Birth Day", formatDate(childData.Birthday)],
            ["Time of birth",
                daysToWeeksText(
                    childData?.GestationalWeek * 7 + childData?.GestationalDay
                ),
            ],
            ["Current Weight", otherInfo?.currentWeight],
            ["Target Weight", otherInfo?.targetWeight?.toFixed(0)],
            ["Percentile", (otherInfo?.percentile * 100)?.toFixed(0)],
            ["Deviation", formattedDifference],
        ];

        const additionalInofs = [
            ["Birth Length", childData.BirthLength],
            ["Head Circumference", childData.HeadCircumference],
            ["Gestational Week", childData.GestationalWeek],
            ["Gestational Day", childData.GestationalDay],
            ["Mother Age", childData.MotherAge],
            ["Mother after Pregnancy Weight", childData.MotherafterPregnancyWeight],
            ["Mother after Pregnancy Weight", childData.MotherafterPregnancyWeight],
            ["Mother Height", childData.MotherHeight],
            ["Father Age", childData.FatherAge],
            ["Father Weight", childData.FatherWeight],
            ["Father Height", childData.FatherHeight],
        ];

        const chartContainer = document.getElementById("chart-container");

        html2canvas(chartContainer, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth * 1.0) / imgProps.width; // Header
            const exportDate = new Date().toLocaleString();
            const headerText = `${exportDate} - Growth Calculator`;
            const sometext = "Exported By " + getUserName();
            const textOffset = 10;
            // Set the font size for the header text
            pdf.setFontSize(10);
            pdf.text(headerText, textOffset, 5);

            // Right-aligned text
            const sometextWidth =
                pdf.getStringUnitWidth(sometext) * pdf.internal.getFontSize();
            const sometextOffset = pdfWidth - sometextWidth;
            pdf.text(sometext, sometextOffset, 5);

            // Add the table with client data
            pdf.autoTable({
                startY: 10,
                body: tableData,
                theme: "grid", // Use the 'grid' theme for a more polished look
                tableWidth: pdfWidth / 2 - 20, // Set the table width to half of the page width minus a margin
                styles: {
                    fontSize: 11,
                    cellPadding: 0.1, // Add padding to cells
                    lineWidth: 0.2, // Set the line width for borders
                    justifyContent: "start",
                },
                headStyles: {
                    fillColor: "#4152B3", // Set the header background color to black
                    textColor: 255, // Set the header text color to white
                    fontStyle: "bold", // Set the header text to bold
                },
                alternateRowStyles: {
                    fillColor: [235, 235, 235], // Set the background color for alternate rows
                },
                columnStyles: {
                    0: {
                        cellWidth: 60, // Set the width of the first column
                        halign: "left", // Align text in the center
                        fontStyle: "bold", // Set the font style of the first column
                    },
                    1: {
                        halign: "center", // Align text in the center
                    },
                },
            });

            // Add the table with additional information
            pdf.autoTable({
                startY: 10,
                body: additionalInofs,
                theme: "grid",
                tableWidth: pdfWidth / 2 - 20, // Set the table width to half of the page width minus a margin
                styles: {
                    fontSize: 11,
                    cellPadding: 0.1, // Add padding to cells
                    lineWidth: 0.2, // Set the line width for borders
                    justifyContent: "start",
                },
                headStyles: {
                    fillColor: "#4152B3",
                    textColor: 255,
                    fontStyle: "bold",
                },
                alternateRowStyles: {
                    fillColor: [235, 235, 235],
                },
                margin: { left: pdfWidth / 2 - 10 }, // Set the left margin to half of the page width to position the table on the right side
                columnStyles: {
                    0: {
                        cellWidth: 60, // Set the width of the first column
                        halign: "left", // Align text in the center
                        fontStyle: "bold", // Set the font style of the first column
                    },
                    1: {
                        halign: "center", // Align text in the center
                    },
                },
            });
            // Get the Y-coordinate after the table
            const finalY = pdf.lastAutoTable.finalY;
            const marginLeft = 10; // Set the left margin
            const marginTop = 6; // Set the top margin
            // Image
            pdf.addImage(
                imgData,
                "PNG",
                marginLeft,
                finalY + marginTop,
                pdfWidth - 2 * marginLeft,
                pdfHeight - 20
            );
            // Add a new page to the PDF
            pdf.save("chart.pdf");
        });
    }
    const fetchData = () => {
        try {
            let { data, otherInfos } = getSpecificChartInfos(
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
            setChartData(data);
            setOtherInfo(otherInfos);
        } catch (error) {
            // Handle the exception here
            console.error("Error fetching data:", error);

            // You can also set a state variable to indicate an error to the user if needed
            // setErrorState(true);
        }
    };


    useEffect(() => {
        fetchData();
    }, [
        childData,
        growthData,
        dataTarget,
        xAxisMin,
        xAxisMax,
        yAxisMin,
        yAxisMax,
        xAxisStep,
        yAxisStep,
        updateState
    ]);

    const chartOptions = {
        type: dataTarget === "Deviation"  || dataTarget === "DevFatAdjIwt" ? "bar" : "line",
        maintainAspectRatio: false,
        scales:
            dataTarget === "Deviation" || dataTarget === "DevFatAdjIwt"
                ? {
                    y: {
                        type: 'linear',                
                        max: yAxisMax,
                        min: -yAxisMax,
                        ticks: {
                            stepSize: yAxisStep,
                        },
                        beginAtZero: true, // Ensure the y-axis starts at zero
                        grid: {
                            color: (context) => {
                                if (context.tick.value === 0) {
                                    return "rgba(192, 192 , 192, 1)";
                                }
                                return "rgba(0, 0, 0, 0.1)";
                            },
                            lineWidth: (context) => {
                                if (context.tick.value === 0) {
                                    return 2.5;
                                }
                                return 1;
                            },
                        },
                    },
                    x: {
                        type: 'linear',                
                        min: xAxisMin,
                        max: xAxisMax,
                        ticks: {
                            stepSize: xAxisStep,
                        },
                        beginAtZero: true, // Ensure the x-axis starts at zero
                        Title: {
                            display: true,
                            text: "Gestational Age (weeks)",
                        },
                    },
                }
                : {
                    x: {
                        min: xAxisMin,
                        max: xAxisMax,
                        ticks: {
                            stepSize: xAxisStep,
                        },
                        type: "linear",
                        Title: {
                            display: true,
                            text: "Gestational Age (weeks)",
                        },
                    },
                    y: {
                        min: yAxisMin,
                        max: yAxisMax,
                        ticks: {
                            stepSize: yAxisStep,
                        },
                        type: "linear",
                        Title: {
                            display: true,
                            text: yTitle,
                        },
                    },
                },
        plugins:
            dataTarget === "Deviation" || dataTarget === "DevFatAdjIwt"
                ? {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            Title: (tooltipItems) => {
                                const xValue = tooltipItems[0].label;
                                console.log("Tooll tips item", tooltipItems[0])
                                return `Gestational Age: ${daysToWeeksText(xValue * 7)}`;
                            },
                            label: (context) => {
                                const dataset = context.dataset;
                                const label = dataset.label || "";
                                const value = context.parsed.y?.toFixed(1);
                                return `${label}: ${value}`;

                        },
                        },
                    },
                }
                : {
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        position: 'nearest',
                        callbacks: {
                            Title: (tooltipItems) => {
                                const xValue = tooltipItems[0].parsed.x;
                                return `Gestational Age: ${daysToWeeksText(xValue * 7)}`;
                            },
                            label: (context) => {
                              const dataset = context.dataset;
                              const label = dataset.label || '';
                              const value = context.parsed.y?.toFixed(1);
                              return `${label}: ${value}`;
                            },
                        },
                    },
                },
        interaction: {
            mode: "nearest",
            axis: "x",
            intersect: false,
        },
        elements:
            dataTarget !== "Deviation" || dataTarget !== "DevFatAdjIwt"
                ? {
                    line: {
                        borderWidth: 1,
                        borderColor: "black",
                    },
                    point: {
                        radius: 30,
                        backgroundColor: "#4152B3",
                    },
                }
                : {},
    };

    //console.log('otherInfos, otherInfo, childData, new Date()', chartData)
    const difference = (
        otherInfo?.currentWeight - otherInfo?.targetWeight
    )?.toFixed(0);
    const formattedDifference = difference > 0 ? `+${difference}` : difference;

    return (
        <div>
            <Box className="d-flex justify-content-Left mb-2">
                <Typography sx={{ justifyContent: "Left" }}>
                    <div className="d-flex justify-content-center">
                        <span className="fw-bold" style={{ marginRight: "5px" }}>
                           {t("Time_of_birth")}:{" "}
                        </span>
                        {daysToWeeksText(
                            childData?.GestationalWeek * 7 + childData?.GestationalDay
                        )}{" "}
                        -{" "}
                        <span
                            className="fw-bold"
                            style={{ marginRight: "5px", marginLeft: "5px" }}
                        >
                            {" "}{t("Birth_Weight")}:{" "}
                        </span>{" "}
                        {childData?.BirthWeight} (g) -{" "}
                        <span
                            className="fw-bold"
                            style={{ marginRight: "5px", marginLeft: "5px" }}
                        >
                            {" "}{t("Percentile")}:{" "}
                        </span>{" "}
                        {(otherInfo?.percentile * 100)?.toFixed(0)}% {" "}
                    </div>
                    {   dataTarget === "Traject" ||
                        dataTarget === "Deviation" ||
                        dataTarget === "DevFatAdjIwt"||
                        dataTarget === "FatAdjIwt"||
                        dataTarget === "DevFatAdjIwt" ||
                        dataTarget === "TrajectFenton" ||
                        dataTarget === "FatAdjIwtFenton"
                        ? (
                        <>
                            <div className="d-flex justify-content-center">
                                <span className="fw-bold" style={{ marginRight: "5px", marginLeft: "5px" }}>
                                - {t("Current_Weight")}:{" "}
                                </span>
                                {otherInfo?.currentWeight} (g) {t("at")}{" "}
                                {daysToWeeksText(
                                    calculateAge(
                                        childData?.Birthday,
                                        childData?.GestationalWeek,
                                        childData?.GestationalDay
                                    )
                                )}
                            </div>
                            <div className="d-flex justify-content-center">
                                <span className="fw-bold" style={{ marginRight: "5px", marginLeft: "5px" }}>
                                  -  {t("Target_Weight")}:{" "}
                                </span>
                                {otherInfo?.targetWeight?.toFixed(0) || null} (g) -{" "}
                                <span className="fw-bold">{t("Deviation")}: </span>{" "}
                                <span
                                    style={{
                                        color: formattedDifference > 0 ? "#00D084" : "#FF0002",
                                        marginLeft: "5px",
                                    }}
                                >
                                    {formattedDifference} (g)
                                </span>
                            </div>
                        </>
                    ) : null}
                </Typography>
            </Box>
            <Grid container sx={{ height: "100%", p: 0.1 }}>
                <Grid xs={12} md={8} lg={9} item>
                    <div
                        style={{ width: "100%", height: "500px" }}
                        id="chart-container"
                        className="border border-dark p-2"
                    >
                        {chartData ? (
                            dataTarget === "Deviation" || dataTarget === "DevFatAdjIwt" ? (
                                <Bar
                                    id="myChart"
                                    style={{ height: "100%" }}
                                    options={chartOptions}
                                    data={chartData}
                                />
                            ) : (
                                <Line
                                    id="myChart"
                                    style={{ height: "100%" }}
                                    data={chartData}
                                    options={chartOptions}
                                />
                            )
                        ) : (
                            <p>Loading chart data...</p>
                        )}
                    </div>
                </Grid>
                <Grid xs={12} md={4} lg={3} item sx={{ p: 0.5 }}>
                    <ButtonGroup
                        orientation="vertical"
                        fullWidth
                        variant="contained"
                        sx={{ justifyContent: "start" }}
                    >
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "Traject" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={DifferenceIcon}
                            onClick={() => {
                                setDataTarget("Traject");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(5500);
                                setYAxisStep(500);
                                setYTitle(t("Ind_weight_Traj"));
                            }}
                        >{t("Ind_weight_Traj")}
                        </Button>

                        
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "Deviation" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={DeviationIcon}
                            onClick={() => {
                                setDataTarget("Deviation");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(1500);
                                setYAxisStep(250);
                                setYTitle(t("Dev_Ind_Traject"));
                            }}
                        >
                        {t("Dev_Ind_Traject")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "FatAdjIwt" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={FatAdjIwtIcon}
                            onClick={() => {
                                setDataTarget("FatAdjIwt");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(5500);
                                setYAxisStep(500);
                                setYTitle(t("Fat_adj_IWT"));
                            }}
                        >{t("Fat_adj_IWT")} 
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "DevFatAdjIwt" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={DevFatAdjIwtIcon}
                            onClick={() => {
                                setDataTarget("DevFatAdjIwt");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(1500);
                                setYAxisStep(250);
                                setYTitle(t("Dev_Fat_adj_IWT"));
                            }}
                        >{t("Dev_Fat_adj_IWT")}
                        </Button>

                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "weight" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={WeightIcon}
                            onClick={() => {
                                setDataTarget("weight");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(5500);
                                setYAxisStep(500);
                                setYTitle(t("Weight") + "(g)");
                            }}
                        >{t("Weight")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "length" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={LengthIcon}
                            onClick={() => {
                                setDataTarget("length");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(70);
                                setYAxisStep(10);
                                setYTitle(t("Length") + "(cm)");
                            }}
                        >
                        {t("Length")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "headCirmunference" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={HeadCircumferenceIcon}
                            onClick={() => {
                                setDataTarget("headCirmunference");
                                setXAxisMax(45);
                                setYAxisMin(10);
                                setYAxisMax(50);
                                setYAxisStep(1);
                                setYTitle(t("HeadCircumference") + "(cm)");
                            }}
                        >{t("HeadCircumference")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "ProzentFreeMas" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={fatFreeMass}
                            onClick={() => {
                                setDataTarget("ProzentFreeMas");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(100);
                                setYAxisStep(5);
                                setYTitle(t("Percent_Fat_Mass") + "(%)");
                            }}
                        >{t("Percent_Fat_Mass")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "FatMas" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={fatMassIcon}
                            onClick={() => {
                                setDataTarget("FatMas");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(3000);
                                setYAxisStep(100);
                                setYTitle(t("Fat_mas") + "(g)");
                            }}
                        >{t("Fat_mas")}
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: dataTarget === "FatFreeMas" ? ButtonSecond : ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={fatFreeMass}
                            onClick={() => {
                                setDataTarget("FatFreeMas");
                                setXAxisMax(45);
                                setYAxisMin(0);
                                setYAxisMax(3000);
                                setYAxisStep(100);
                                setYTitle(t("Fat_Free_mass") + "(g)");
                            }}
                        >{t("Fat_Free_mass")}
                        </Button>
                        <Button
                            style={{
                                fontSize: "1.8vh",
                                padding: 0,
                                backgroundColor: ButtonFirst,
                                color: TextFirst,
                            }}
                            endIcon={downloadIcon}
                            onClick={() => exportChartAsPDF()}
                        >{t("download")}
                        </Button>
                        <Grid container spacing={0.3} sx={{padding: '4px'}}>
                            <Grid item xs={12}>
                                <label className="d-flex justify-content-center mt-1 mb-2 py-1">{t("chartOptions")}
                                    
                                </label>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-xAxisMin"
                                    margin="normal"
                                    variant="outlined"
                                    name="xAxisMin"
                                    type="number"
                                    label="x Min"
                                    value={xAxisMin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: xAxisStep,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setXAxisMin(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-xAxisMax"
                                    margin="normal"
                                    variant="outlined"
                                    label="x Max"
                                    type="number"
                                    name="xAxisMax"
                                    value={xAxisMax}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: xAxisStep,
                                        max: 305,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setXAxisMax(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-xAxisStep"
                                    margin="normal"
                                    variant="outlined"
                                    name="xAxisStep"
                                    type="number"
                                    label="x Step"
                                    value={xAxisStep}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setXAxisStep(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-yAxisMin"
                                    margin="normal"
                                    variant="outlined"
                                    label="y Min"
                                    name="yAxisMin"
                                    type="number"
                                    value={yAxisMin}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: yAxisStep,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setYAxisMin(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-yAxisMax"
                                    margin="normal"
                                    variant="outlined"
                                    label="y Max"
                                    name="yAxisMax"
                                    type="number"
                                    value={yAxisMax}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: yAxisStep,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setYAxisMax(Number(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="my-yAxisStep"
                                    margin="normal"
                                    variant="outlined"
                                    name="yAxisStep"
                                    type="number"
                                    label="y Step"
                                    value={yAxisStep}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{ margin: 0 }}
                                    onChange={(e) => setYAxisStep(Number(e.target.value))}
                                />
                            </Grid>
                        </Grid>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <GrowthDataShower growthData={growthData.sort((a, b) => new Date(b.TaskDate) - new Date(a.TaskDate))} ref={growthDataShowerRef} forceUpdate={forceUpdate} childData={childData} />
        </div>
    );
};

export default GrowthChart;
