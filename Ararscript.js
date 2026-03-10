// الكود الرئيسي لملف العروض واكسل المجلة
(function() {
    window.startAdvancedExport = function() {
        const expiryDate = prompt('📅 الرجاء إدخال تاريخ انتهاء العرض (مثال: 2025-07-31):');
        if (!expiryDate) return;

        const rows = document.querySelectorAll('tr');
        let items = [];

        rows.forEach(row => {
            const code = row.querySelector('span[id*="itemCodeId::content"]')?.textContent?.trim();
            const name = row.querySelector('span[style*="font-weight:bold"][style*="font-size"]')?.textContent?.trim();
            const priceBefore = row.querySelector('span[id*="it9::content"]')?.textContent?.trim();
            const priceAfter = row.querySelector('span[style*="font-weight:bold"][style*="color:Blue"]')?.textContent?.trim();

            if (code && name && priceBefore && priceAfter) {
                items.push({
                    code, name,
                    priceBefore: parseFloat(priceBefore),
                    priceAfter: parseFloat(priceAfter),
                    expiry: expiryDate
                });
            }
        });

        items.sort((a, b) => (a.priceBefore === a.priceAfter ? -1 : 1));

        const win = window.open('', '_blank');
        let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>بطاقات العرض المطورة</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Sukar&display=swap');
                body { font-family: 'Sukar', sans-serif; direction: rtl; margin: 20px; }
                .card { background-color: #ffffff; border-radius: 15px; padding: 20px; text-align: center; width: 75mm; height: 75mm; margin: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.1); display: inline-block; vertical-align: top; position: relative; overflow: hidden; }
                .new-price { color: #fff; font-size: 24px; font-weight: 700; border-radius: 10px 0; background: #0077b6; padding: 2px 0; line-height: 1; }
                .old-price { font-size: 24px; font-weight: 700; border-radius: 10px 0; padding: 2px 0; line-height: 1; }
                .old-price-number { font-size: 56px; font-weight: 700; color: #ffffff; position: relative; display: inline-block; }
                .strike-line::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background-color: blue; transform: translateY(-50%); }
                .item-name { margin: 10px 0; font-size: 16px; min-height: 1.2em; }
                .controls { position: absolute; top: 5px; right: 5px; display: flex; gap: 5px; z-index: 10; }
                .btn-tool { width: 22px; height: 22px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }
                @media print { .controls, h2, .editor-area, .exportExcel { display:none !important; } }
            </style>
            <script>
                function toggleColor(i) {
                    const el = document.getElementById('bg-box-' + i);
                    el.style.backgroundColor = (el.style.backgroundColor === 'red') ? 'orange' : 'red';
                }
                function toggleCurrency(i) {
                    const el = document.getElementById('currency-' + i);
                    el.style.display = (el.style.display === 'none') ? 'inline' : 'none';
                }
            </script>
        </head>
        <body>
            <h2>🧾 بطاقات العرض</h2>
        `;

        items.forEach((x, i) => {
            const equal = x.priceBefore === x.priceAfter;
            const discount = (100 - (x.priceAfter / x.priceBefore) * 100).toFixed(0);
            html += `
            <div class="card" id="card-${i}">
                <div class="controls">
                    <div class="btn-tool" onclick="toggleColor(${i})">🎨</div>
                    <div class="btn-tool" onclick="toggleCurrency(${i})">💰</div>
                    <div class="btn-tool" onclick="document.getElementById('old${i}').classList.toggle('strike-line')">⚡</div>
                </div>
                <div class="new-price"><span style="font-size:56px;">${x.priceAfter.toFixed(2)}</span><span> ريال</span></div>
                <div id="instead${i}" class="text-separator" contenteditable="true" style="font-size:24px;font-weight:bold;">${equal ? "-" : "بدلاً من"}</div>
                <div id="bg-box-${i}" class="old-price" style="background:${equal ? 'red' : 'orange'}">
                    <span id="old${i}" class="old-price-number strike-line" contenteditable="true">${x.priceBefore.toFixed(2)}</span>
                    <span id="currency-${i}" style="font-size:16px;color:white; ${equal ? 'display:none;' : ''}">ريال</span>
                </div>
                <div class="item-name" contenteditable="true">${x.name}</div>
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggr46InwjIE3TgHhv13-cWokCo4mjrirtMQ42Sh-DqCoPjb-T4UcIosocZPaP7oVl-zYIShmh-4GAs9xwDheNoQBcLI7A4BN8ndrEhc9Icr-wHDC2TvDw3LRCIBmrvwAuv8SbWMfJj7fd6LxIKmK1dbP-kWzTR2CxfhTAcFrRik1XT0jeZnIkWKLaQHol_/s868/outlet.png" style="max-width:38%;height:auto;">
                <div style="display:flex;justify-content:space-between;font-size:12px;">
                    <span id="exp${i}" contenteditable="true">ينتهي في ${x.expiry}</span>
                    <span>كود: <span class="item-code">${x.code}</span></span>
                </div>
                <div id="disc${i}" style="color:red;font-size:14px;" contenteditable="true">خصم ${discount}%</div>
            </div>`;
        });

        html += `
        <div class="editor-area">
            <button class="exportExcel" style="padding:10px; background:#007bff; color:white; border-radius:8px; cursor:pointer;">📥 تصدير إلى Excel</button>
            <button onclick="window.print()" style="padding:10px; cursor:pointer;">🖨 طباعة</button>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
        <script>
            document.querySelector(".exportExcel").onclick = function() {
                let rows = [["اسم الصنف", "الكود", "تاريخ الانتهاء", "رابط الصورة", "فارغ", "قبل", "بعد", "الحالة", "الخصم"]];
                document.querySelectorAll(".card").forEach(card => {
                    rows.push([
                        card.querySelector(".item-name").innerText,
                        card.querySelector(".item-code").innerText,
                        card.querySelector("[id^='exp']").innerText.replace("ينتهي في",""),
                        card.querySelector(".item-code").innerText + ".png",
                        "",
                        card.querySelector(".old-price-number").innerText,
                        card.querySelector(".new-price span").innerText,
                        card.querySelector(".text-separator").innerText,
                        card.querySelector("[id^='disc']").innerText.replace("خصم","").replace("%","")
                    ]);
                });
                let ws = XLSX.utils.aoa_to_sheet(rows);
                let wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Offers");
                XLSX.writeFile(wb, "offers_report.xlsx");
            };
        </script>
        </body></html>`;

        win.document.write(html);
        win.document.close();
    };
})();
