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
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 假設我們只處理第一個工作表
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (jsonData.length === 0) {
                alert("上傳的文件為空！");
                return;
            }

            console.log("文件解析成功", jsonData);
            categorizeAndDisplayData(jsonData);
            alert("Excel 檔案上傳成功！");
        } catch (error) {
            console.error("文件解析失敗:", error);
            alert("文件解析失敗，請檢查文件格式！");
        }
    };

    reader.readAsArrayBuffer(file);
}

// 整理並分類數據
function categorizeAndDisplayData(data) {
    const headers = data[0];
    const categorizedData = {};

    // 检查表头是否符合预期
    if (!headers || headers[0] !== "單位" || headers[1] !== "品名") {
        alert("文件格式錯誤，請檢查是否包含正確的表頭（單位, 品名）！");
        console.error("文件標題錯誤", headers);
        return;
    }

    data.slice(1).forEach(row => {
        const [unit, category, price = "-", remark = "-"] = row;

        if (!category || !unit) {
            console.warn("忽略不完整的數據行:", row);
            return;
        }

        if (!categorizedData[category]) {
            categorizedData[category] = {};
        }
        if (!categorizedData[category][unit]) {
            categorizedData[category][unit] = [];
        }

        categorizedData[category][unit].push({ price, remark });
    });

    window.categorizedData = categorizedData;
    console.log("分類後的數據:", categorizedData);
}

// 顯示特定分類
function showCategory(categoryName) {
    document.querySelectorAll('.hidden').forEach(el => el.style.display = 'none');
    document.getElementById(categoryName).style.display = 'block';
    document.getElementById('table-container').setAttribute('data-category', categoryName);
}

// 顯示單位表格
function showUnitTable(unitName) {
    const categoryName = document.querySelector('#table-container').getAttribute('data-category');

    // 確保按鈕名稱和 Excel 數據中的商品名稱以及單位名稱完全匹配
    const unitData = window.categorizedData?.[categoryName]?.[unitName];

    if (!unitData || unitData.length === 0) {
        alert(`無相關數據！\n商品名稱: ${categoryName}, 單位: ${unitName}`);
        console.warn(`商品名稱: ${categoryName}, 單位: ${unitName} 無數據`);
        return;
    }

    const tableBody = document.querySelector('#unit-table tbody');
    tableBody.innerHTML = ''; // 清空现有表格

    unitData.forEach(row => {
        const tr = document.createElement('tr');

        const tdUnit = document.createElement('td');
        tdUnit.textContent = unitName;
        tr.appendChild(tdUnit);

        const tdPrice = document.createElement('td');
        tdPrice.textContent = row.price || '-';
        tr.appendChild(tdPrice);

        const tdRemark = document.createElement('td');
        tdRemark.textContent = row.remark || '-';
        tr.appendChild(tdRemark);

        tableBody.appendChild(tr);
    });

    console.log(`顯示商品名稱 ${categoryName} 下單位 ${unitName} 的數據:`, unitData);
}
