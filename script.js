let chart;

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['TikTok', 'Instagram', 'YouTube'],
            datasets: [{
                label: 'Revenue (USD)',
                data: [0, 0, 0],
                backgroundColor: ['#fe8019', '#fabd2f', '#8ec07c'],
                borderColor: '#1d2021',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: '#3c3836' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// Calculation Logic (The "Intelligence")
function calculate() {
    const platforms = [
        { id: 'tk', name: 'TikTok', views: parseFloat(document.getElementById('tk-views').value) || 0, rev: parseFloat(document.getElementById('tk-rev').value) || 0 },
        { id: 'ig', name: 'Instagram', views: parseFloat(document.getElementById('ig-views').value) || 0, rev: parseFloat(document.getElementById('ig-rev').value) || 0 },
        { id: 'yt', name: 'YouTube', views: parseFloat(document.getElementById('yt-views').value) || 0, rev: parseFloat(document.getElementById('yt-rev').value) || 0 }
    ];

    // 1. Total Revenue
    const total = platforms.reduce((acc, p) => acc + p.rev, 0);
    document.getElementById('total-revenue').innerText = `$${total.toLocaleString()}`;

    // 2. RPM Calculation (Revenue Per 1000 views)
    platforms.forEach(p => {
        p.rpm = p.views > 0 ? (p.rev / p.views) * 1000 : 0;
    });

    // 3. Find Winner
    const winner = platforms.reduce((prev, current) => (prev.rev > current.rev) ? prev : current);
    const highRPM = platforms.reduce((prev, current) => (prev.rpm > current.rpm) ? prev : current);

    if (total > 0) {
        document.getElementById('efficiency-leader').innerText = highRPM.name;
        document.getElementById('insight-text').innerText = `Analysis complete. ${winner.name} is the primary revenue driver. However, ${highRPM.name} shows the highest resource efficiency with an RPM of $${highRPM.rpm.toFixed(2)}. Suggest scaling ${highRPM.name} for maximum edge growth.`;
    }

    // 4. Update Chart
    chart.data.datasets[0].data = platforms.map(p => p.rev);
    chart.update();

    // 5. Sovereignty Mode: Save to LocalStorage
    localStorage.setItem('localytics_data', JSON.stringify(platforms));
}

function loadSavedData() {
    const saved = localStorage.getItem('localytics_data');
    if (saved) {
        const data = JSON.parse(saved);
        data.forEach(p => {
            document.getElementById(`${p.id}-views`).value = p.views;
            document.getElementById(`${p.id}-rev`).value = p.rev;
        });
        calculate();
    }
}

function resetData() {
    localStorage.clear();
    location.reload();
}

window.onload = () => {
    initChart();
    loadSavedData();
};
