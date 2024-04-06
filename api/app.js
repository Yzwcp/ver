import chromium from 'chrome-aws-lambda';

export default async function handler(req, res) {
    let browser = null;
    const { ip } = req.query;
    if (!ip) {
        return res.status(200).json({ code: -1, msg: 'ip blank' });
    }
    // 这里可以再对IP的合法性做进一步校验
    try {
        browser = await chromium.puppeteer.launch({
            headless: true,
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const blocked = ["image", "stylesheet", "media", "font"];
            if (blocked.includes(req.resourceType())) {
                req.abort();
                return;
            }
            req.continue();
        });

        await page.goto("https://ipdata.co", { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate((ipaddr) => {
            return new Promise(reslove => {
                //  这里的api-key似乎是不变的
                $.get("https://api.ipdata.co/" + ipaddr + '?api-key=eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9', resp => {
                    reslove(resp);
                }, "jsonp")
            });
        }, ip);
        res.status(200).json(data)
    } catch (error) {
        return res.status(200).json({ code: -1, msg: `${error}` });
    } finally {
        if (browser) {
            await browser.close();
        }
        return res.status(200).json({ code: 200, msg: 'ip blank' });

    }
}