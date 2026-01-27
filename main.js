(function () {
    'use strict';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '📄 عرض البطاقات في صفحة جديدة';
    Object.assign(exportBtn.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 9999,
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
    });
    document.body.appendChild(exportBtn);

    exportBtn.addEventListener('click', () => {
        const expiryDate = prompt('📅 الرجاء إدخال تاريخ انتهاء العرض (مثال: 2025-07-31):');
        if (!expiryDate) {
            alert('⚠️ لم يتم إدخال تاريخ. تم إلغاء العملية.');
            return;
        }

        const rows = document.querySelectorAll('tr');
        const results = [];

        rows.forEach(row => {
            const codeSpan = row.querySelector('span[id*="itemCodeId::content"]');
            const nameSpan = row.querySelector('span[style*="font-weight:bold"][style*="font-size"]');
            const priceBeforeSpan = row.querySelector('span[id*="it9::content"]');
            const priceAfterSpan = row.querySelector('span[style*="font-weight:bold"][style*="color:Blue"]');

            const code = codeSpan?.textContent.trim();
            const name = nameSpan?.textContent.trim();
            const priceBefore = priceBeforeSpan?.textContent.trim();
            const priceAfter = priceAfterSpan?.textContent.trim();

            if (code && name && priceBefore && priceAfter) {
                results.push({
                    code,
                    name,
                    priceBefore: parseFloat(priceBefore),
                    priceAfter: parseFloat(priceAfter),
                    expiryDate
                });
            }
        });

        if (results.length === 0) {
            alert('⚠️ لم يتم العثور على بيانات.');
            return;
        }

        const newWindow = window.open('', '_blank');
        const style = `
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Sukar&display=swap');

        body {
            font-family: 'Sukar', sans-serif;
            direction: rtl;
            margin: 20px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            width: 75mm;
            height: 75mm;
            margin: 10px;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
            display: inline-block;
            vertical-align: top;
        }
        .old-price {
            background: orange;
            font-size: 24px;
            font-weight: 700;
            border-radius: 10px 0;
            padding: 2px 0;
            line-height: 1;
        }
        .old-price-number {
            font-size: 56px;
            font-weight: 700;
            color: #ffffff;
            position: relative;
            display: inline-block;
        }
        .old-price-number::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: blue;
            transform: translateY(-50%);
        }
        .new-price {
            color: #fff;
            font-size: 24px;
            font-weight: 700;
            border-radius: 10px 0;
            background: #0077b6;
            padding: 2px 0;
            line-height: 1;
        }
        .item-name {
            margin: 10px 0;
            font-size: 16px;
        }
        .offer-end {
            font-size: 12px;
            color: gray;
            margin-top: 5px;
        }
        </style>`;

        let cardsHTML = '';
        results.forEach(item => {
            const percent = (100 - (item.priceAfter / item.priceBefore) * 100).toFixed(0);
            cardsHTML += `
            <div class="card">
                <div class="new-price">
                    <span style="font-size: 56px;">${item.priceAfter.toFixed(2)}</span>
                    <span style="font-size: 18px;">ريال</span>
                </div>
                <div style="font-size: 24px; font-weight: bold;">بدلاً من</div>
                <div class="old-price">
                    <span class="old-price-number">${item.priceBefore.toFixed(2)}</span>
                    <span style="font-size: 16px; color: white;">ريال</span>
                </div>
                <div class="item-name">${item.name}</div>
                <div><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggr46InwjIE3TgHhv13-cWokCo4mjrirtMQ42Sh-DqCoPjb-T4UcIosocZPaP7oVl-zYIShmh-4GAs9xwDheNoQBcLI7A4BN8ndrEhc9Icr-wHDC2TvDw3LRCIBmrvwAuv8SbWMfJj7fd6LxIKmK1dbP-kWzTR2CxfhTAcFrRik1XT0jeZnIkWKLaQHol_/s868/outlet.png" alt="Logo" style="max-width: 38%; height: auto;"></div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 2px;">
                    <span>ينتهي فى ${item.expiryDate}</span><span>كود: ${item.code}</span>
                </div>
                <div style="color:red; font-size: 14px;">خصم ${percent}%</div>
            </div>
            `;
        });

        const html = `
        <html>
        <head><meta charset="UTF-8"><title>بطاقات العرض</title>${style}</head>
        <body>${cardsHTML}</body>
        </html>
        `;

        newWindow.document.write(html);
        newWindow.document.close();
    });
})();



