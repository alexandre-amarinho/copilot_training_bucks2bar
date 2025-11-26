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

async function sendChartByEmail() {
    const email = $('#userEmail').val();
    const username = $('#username').val();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const canvas = document.getElementById('financeChart');
    const imageData = canvas.toDataURL('image/png');
    
    try {
        const response = await fetch('http://localhost:3000/api/send-chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                username: username,
                chartImage: imageData
            })
        });
        
        if (response.ok) {
            alert('Email sent successfully!');
        } else {
            alert('Failed to send email');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Testable validation functions
function validateUsername(username) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(username);
}

function checkUsernameLength(username) {
    return username.length >= 8;
}

function checkHasCapital(username) {
    return /[A-Z]/.test(username);
}

function checkHasNumber(username) {
    return /[0-9]/.test(username);
}

function checkHasSpecial(username) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(username);
}

// Export for testing (Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUsername,
        checkUsernameLength,
        checkHasCapital,
        checkHasNumber,
        checkHasSpecial
    };
}

// Only run jQuery code in browser environment
if (typeof $ !== 'undefined') {
    $(document).ready(function() {
        // Username validation with single regex (min 8 chars, 1 uppercase, 1 number, 1 special char)
        $('#username').on('input', function() {
            const username = $(this).val();
            const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
            
            // Individual checks for UI feedback
            const hasLength = username.length >= 8;
            const hasCapital = /[A-Z]/.test(username);
            const hasNumber = /[0-9]/.test(username);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(username);
            
            $('#lengthCheck').toggleClass('valid', hasLength).find('.validation-icon').text(hasLength ? '✅' : '❌');
            $('#capitalCheck').toggleClass('valid', hasCapital).find('.validation-icon').text(hasCapital ? '✅' : '❌');
            $('#numberCheck').toggleClass('valid', hasNumber).find('.validation-icon').text(hasNumber ? '✅' : '❌');
            $('#specialCheck').toggleClass('valid', hasSpecial).find('.validation-icon').text(hasSpecial ? '✅' : '❌');
            
            // Validate with single regex
            const isValid = regex.test(username);
            $(this).toggleClass('is-valid', isValid).toggleClass('is-invalid', username.length > 0 && !isValid);
        });

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
}