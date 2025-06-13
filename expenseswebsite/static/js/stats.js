const renderDoughnutChart = (data, labels) => {
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                label: "Expenses by Category",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                    "rgba(255, 159, 64, 0.5)",
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Expenses per Category",
                    color: "#333",
                    font: { size: 16 }
                },
                legend: {
                    labels: {
                        color: "#333"
                    }
                }
            }
        }
    });
};

const renderLineChart = (data, labels) => {
    const ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Expenses",
                data: data,
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Monthly Expenses",
                    color: "#333",
                    font: { size: 16 }
                },
                legend: {
                    labels: {
                        color: "#333"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#333" }
                },
                y: {
                    ticks: { color: "#333" }
                }
            }
        }
    });
};

const renderBarChart = (data, labels) => {
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Expenses Comparison",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Expenses by Month",
                    color: "#333",
                    font: { size: 16 }
                },
                legend: {
                    labels: {
                        color: "#333"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#333" }
                },
                y: {
                    ticks: { color: "#333" }
                }
            }
        }
    });
};
const renderScatterChart = (dataX, dataY) => {
    const ctx = document.getElementById("scatterChart").getContext("2d");
    new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Expenses vs Categories",
                data: dataX.map((x, index) => ({ x: x, y: dataY[index] })),
                backgroundColor: "rgba(153, 102, 255, 0.5)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Scatter Chart: Expenses vs Categories",
                    color: "#333",
                    font: { size: 16 }
                },
                legend: {
                    labels: {
                        color: "#333"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "#333" }
                },
                y: {
                    ticks: { color: "#333" }
                }
            }
        }
    });
};
 
const getChartData = () => {
    fetch("/expense_category_summary")
        .then((res) => res.json())
        .then((results) => {
            const categoryData = results.expense_category_data;
            const monthData = results.monthly_expense_data;

            const [categoryLabels, categoryValues] = [
                Object.keys(categoryData),
                Object.values(categoryData)
            ];

            const [monthLabels, monthValues] = [
                Object.keys(monthData),
                Object.values(monthData)
            ];

            renderDoughnutChart(categoryValues, categoryLabels);
            renderLineChart(monthValues, monthLabels);
            renderBarChart(monthValues, monthLabels);
            renderScatterChart(categoryValues, monthValues); // Scatter chart rendering
            // Add bar chart rendering
        })
        .catch((err) => {
            console.error('Error fetching chart data:', err);
        });
};

document.addEventListener('DOMContentLoaded', getChartData);
