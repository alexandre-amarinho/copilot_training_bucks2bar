function downloadChartAsImage() {
    const canvas = document.getElementById('financeChart');
    
    // Get the image data
    const url = canvas.toDataURL('image/png');
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.download = 'bucks2bar-chart-' + new Date().toISOString().split('T')[0] + '.png';
    link.href = url;
    link.click();
}

$(document).ready(function() {
    // Initialize the chart
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    const financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Income',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Function to update chart with input values
    function updateChart() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const incomeData = [];
        const expenseData = [];

        months.forEach(month => {
            const income = parseFloat($('#income' + month).val()) || 0;
            const expenses = parseFloat($('#expenses' + month).val()) || 0;
            incomeData.push(income);
            expenseData.push(expenses);
        });

        financeChart.data.datasets[0].data = incomeData;
        financeChart.data.datasets[1].data = expenseData;
        financeChart.update();
    }

    // Add event listeners to all input fields
    $('input[type="number"]').on('input', function() {
        updateChart();
    });

    // Update chart when switching to Chart tab
    $('a[href="#chartSection"]').on('shown.bs.tab', function() {
        updateChart();
        financeChart.resize();
    });
});