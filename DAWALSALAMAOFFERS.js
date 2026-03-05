// هذا الكود يوضع في ملف main_offer.js على GitHub
(function() {
    window.startExportLogic = function() {
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
            alert('⚠️ لم يتم العثور على بيانات في الجدول.');
            return;
        }

        const newWindow = window.open('', '_blank');
        const style = `
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Sukar&display=swap');
        body { font-family: 'Sukar', sans-serif; direction: rtl; margin: 20px; }
        .card { background-color: #ffffff; border-radius: 15px; padding: 20px; text-align: center; width: 75mm; height: 75mm; margin: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.1); display: inline-block; vertical-align: top; }
        .old-price { background: #000000; font-size: 24px; font-weight: 700; border-radius: 10px 0; padding: 2px 0; line-height: 1; }
        .old-price-number { font-size: 56px; font-weight: 700; color: #ffffff; position: relative; display: inline-block; }
        .old-price-number::after { content: ''; position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background-color: blue; transform: translateY(-50%); }
        .new-price { color: #fff; font-size: 24px; font-weight: 700; border-radius: 10px 0; background: #0077b6; padding: 2px 0; line-height: 1; }
        .item-name { margin: 10px 0; font-size: 16px; height: 45px; overflow: hidden; }
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
                <div><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9uRz1j9FYykwvj5nwS8rIdW6abnVHwjRJNamiYIQpi_6oL94t2mHfgfsn-k5_Lswi5kEvx-nCQMc0PZvX0NpG4X5enCZPv6wAeaYCUN6SaDNoEaM0NMCC1QBM-izp-2H93p43j7b9wSn_h8VyNpoiw8aHes3m1Krm8RW7t_D5BIQISZhHgH_XjyPYn6g/s320/Capture.PNG" alt="Logo" style="max-width: 38%; height: auto;"></div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 2px;">
                    <span>صالح حتى ${item.expiryDate}</span><span>كود: ${item.code}</span>
                </div>
                <div style="color:red; font-size: 14px;">خصم ${percent}%</div>
            </div>`;
        });

        newWindow.document.write('<html><head><meta charset="UTF-8"><title>بطاقات العرض</title>' + style + '</head><body>' + cardsHTML + '</body></html>');
        newWindow.document.close();
    };
})();
