function showCategory(categoryId) {
    document.querySelectorAll('.hidden').forEach(el => el.style.display = 'none');
    document.getElementById(categoryId).style.display = 'block';
}

function showUnitTable(unitId) {
    document.querySelectorAll('.hidden').forEach(el => el.style.display = 'none');
    document.getElementById('table-container').style.display = 'block';
    // 可根據 unitId 更新表格內容
    console.log(`Loading data for ${unitId}`);
}

function importExcel() {
    const fileInput = document.getElementById('import-excel');
    const file = fileInput.files[0];

    if (file) {
        alert('導入功能待實現，檔案名：' + file.name);
    }
}
