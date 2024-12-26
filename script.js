// 導入 Excel 的功能
function importExcel() {
    const fileInput = document.getElementById('import-excel');
    const file = fileInput.files[0];

    if (!file) {
        alert('請選擇一個文件！');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 假設我們只處理第一個工作表
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // 更新表格
        updateTable(jsonData);
    };

    reader.readAsArrayBuffer(file);
}

// 更新表格的功能
function updateTable(data) {
    const tableBody = document.querySelector('#unit-table tbody');
    tableBody.innerHTML = ''; // 清空現有表格

    // 從導入的數據生成表格
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell || ''; // 如果單元格為空，顯示空字串
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// 顯示特定分類
function showCategory(categoryId) {
    document.querySelectorAll('.hidden').forEach(el => el.style.display = 'none');
    document.getElementById(categoryId).style.display = 'block';
}

// 顯示單位表格
function showUnitTable(unitId) {
    document.querySelectorAll('.hidden').forEach(el => el.style.display = 'none');
    document.getElementById('table-container').style.display = 'block';
    console.log(`Loading data for ${unitId}`);
}
