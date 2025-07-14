document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("study-form");
    const examFilter = document.getElementById("examFilter");
    const dataTableBody = document.querySelector("#dataTable tbody");
    const chartCanvas = document.getElementById("progressChart");
    let chart;

    // データ読み込み
    function loadData() {
        const data = JSON.parse(localStorage.getItem("studyData") || "[]");
        return data;
    }

    // データ保存
    function saveData(entry) {
        const data = loadData();
        data.push(entry);
        localStorage.setItem("studyData", JSON.stringify(data));
    }

    // 表の更新
    function updateTable(data) {
        dataTableBody.innerHTML = "";
        data.forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.examName}</td>
                <td>${entry.date}</td>
                <td>${entry.answers}</td>
                <td>${entry.correctAnswers}</td>
            `;
            dataTableBody.appendChild(row);
        });
    }

    // 試験名フィルターの更新
    function updateExamFilter(data) {
        const exams = [...new Set(data.map(d => d.examName))];
        examFilter.innerHTML = "";
        exams.forEach(exam => {
            const option = document.createElement("option");
            option.value = exam;
            option.textContent = exam;
            examFilter.appendChild(option);
        });
    }

    // グラフの更新
    function updateChart(data, examName) {
        const filtered = data.filter(d => d.examName === examName);
        const labels = filtered.map(d => d.date);
        const values = filtered.map(d => d.correctAnswers);

        if (chart) chart.destroy();
        chart = new Chart(chartCanvas, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "正解数",
                    data: values,
                    borderColor: "#3498db",
                    backgroundColor: "rgba(52, 152, 219, 0.2)",
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "日付" } },
                    y: { title: { display: true, text: "正解数" }, beginAtZero: true }
                }
            }
        });
    }

    // フォーム送信イベント
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const entry = {
            examName: document.getElementById("examName").value,
            date: document.getElementById("date").value,
            answers: parseInt(document.getElementById("answers").value),
            correctAnswers: parseInt(document.getElementById("correctAnswers").value)
        };
        saveData(entry);
        const data = loadData();
        updateTable(data);
        updateExamFilter(data);
        updateChart(data, examFilter.value);
        form.reset();
    });

    // 試験名選択イベント
    examFilter.addEventListener("change", () => {
        const data = loadData();
        updateChart(data, examFilter.value);
    });

    // 初期表示
    const initialData = loadData();
    updateTable(initialData);
    updateExamFilter(initialData);
    if (initialData.length > 0) {
        updateChart(initialData, examFilter.value);
    }
});
