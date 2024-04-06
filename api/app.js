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

        await page.goto("https://www.zhihu.com/", { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate((ipaddr) => {
            return new Promise(reslove => {
                //  这里的api-key似乎是不变的
                ipaddr = ipaddr + "232323"
            });
        }, ip);
        res.status(200).json({ data, ip })
    } catch (error) {
        return res.status(200).json({ code: -1, msg: `${error}` });
    } finally {
        if (browser) {
            await browser.close();
        }

    }
}