// الكود الرئيسي لملف العروض - نسخة العرض والطباعة فقط
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

        // ترتيب البطاقات: الأصناف التي ليس عليها خصم تظهر أولاً (اختياري حسب كودك السابق)
        items.sort((a, b) => (a.priceBefore === a.priceAfter ? -1 : 1));

        const win = window.open('', '_blank');
        let html = `
        <html>
        <head>
            <meta charset="UTF-8">
            <title>بطاقات العرض - عرض فقط</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Sukar&display=swap');
                body { font-family: 'Sukar', sans-serif; direction: rtl; margin: 20px; background-color: #f4f4f4; }
                
                /* تنسيق البطاقة */
                .card { 
                    background-color: #ffffff; border-radius: 15px; padding: 20px; text-align: center; 
                    width: 75mm; height: 75mm; margin: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.1); 
                    display: inline-block; vertical-align: top; position: relative; overflow: hidden; 
                }
                
                .new-price { color: #fff; font-size: 24px; font-weight: 700; border-radius: 10px 0; background: #0077b6; padding: 2px 0; line-height: 1; }
                .old-price { font-size: 24px; font-weight: 700; border-radius: 10px 0; padding: 2px 0; line-height: 1; color: #ffffff; }
                .old-price-number { font-size: 56px; font-weight: 700; position: relative; display: inline-block; }
                
                /* خط التشطيب الأزرق الثابت */
                .strike-line::after { 
                    content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 2px; 
                    background-color: blue; transform: translateY(-50%); 
                }
                
                .item-name { margin: 10px 0; font-size: 16px; font-weight: bold; min-height: 1.2em; color: #333; }
                
                /* أزرار التحكم في الصفحة (تختفي عند الطباعة) */
                .print-area { text-align: center; margin-bottom: 20px; }
                .btn-print { padding: 10px 25px; font-size: 18px; cursor: pointer; background: #28a745; color: white; border: none; border-radius: 8px; }

                @media print { 
                    .print-area, h2 { display:none !important; } 
                    body { background-color: #fff; margin: 0; }
                    .card { box-shadow: none; border: 1px solid #eee; margin: 5px; }
                }
            </style>
        </head>
        <body>
            <div class="print-area">
                <h2>🧾 معاينة بطاقات العرض</h2>
                <button class="btn-print" onclick="window.print()">🖨 طباعة البطاقات</button>
            </div>
            <div style="text-align: center;">
        `;

        items.forEach((x, i) => {
            const equal = x.priceBefore === x.priceAfter;
            const discount = (100 - (x.priceAfter / x.priceBefore) * 100).toFixed(0);
            
            html += `
            <div class="card">
                <div class="new-price">
                    <span style="font-size:56px;">${x.priceAfter.toFixed(2)}</span><span> ريال</span>
                </div>
                
                <div style="font-size:24px; font-weight:bold; margin: 5px 0;">
                    ${equal ? "-" : "بدلاً من"}
                </div>
                
                <div class="old-price" style="background:${equal ? 'red' : 'orange'}">
                    <span class="old-price-number ${equal ? '' : 'strike-line'}">${x.priceBefore.toFixed(2)}</span>
                    <span style="font-size:16px; ${equal ? 'display:none;' : ''}">ريال</span>
                </div>
                
                <div class="item-name">${x.name}</div>
                
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggr46InwjIE3TgHhv13-cWokCo4mjrirtMQ42Sh-DqCoPjb-T4UcIosocZPaP7oVl-zYIShmh-4GAs9xwDheNoQBcLI7A4BN8ndrEhc9Icr-wHDC2TvDw3LRCIBmrvwAuv8SbWMfJj7fd6LxIKmK1dbP-kWzTR2CxfhTAcFrRik1XT0jeZnIkWKLaQHol_/s868/outlet.png" style="max-width:38%; height:auto; margin: 5px 0;">
                
                <div style="display:flex; justify-content:space-between; font-size:12px; color: #555;">
                    <span>ينتهي في ${x.expiry}</span>
                    <span>كود: ${x.code}</span>
                </div>
                
                <div style="color:red; font-size:14px; font-weight: bold; margin-top: 5px;">
                    ${equal ? "سعر خاص" : "خصم " + discount + "%"}
                </div>
            </div>`;
        });

        html += `
            </div>
        </body>
        </html>`;

        win.document.write(html);
        win.document.close();
    };
})();
