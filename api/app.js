

export default async function handler(req, res) {
    GET()
    async function GET() {
        let browser = null;

        // 远程执行包
        const remoteExecutablePath =
            "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

        // 运行环境
        const isDev = process.env.NODE_ENV === "development";
        try {
            // 引入依赖
            const chromium = require("@sparticuz/chromium-min");
            const puppeteer = require("puppeteer-core");

            // 启动
            browser = await puppeteer.launch({
                args: isDev ? [] : chromium.args,
                defaultViewport: { width: 1920, height: 1080 },
                executablePath: isDev
                    ? localExecutablePath
                    : await chromium.executablePath(remoteExecutablePath),
                headless: chromium.headless,
            });

            // 打开页面
            const page = await browser.newPage();
            // 等待页面资源加载完毕
            await page.goto("https://juejin.cn/post/7263035818047373367", {
                waitUntil: "networkidle0",
                timeout: 100000,
            });
            // 打印页面标题
            console.log("page title", await page.title());
            // const blob = await page.screenshot({ type: "png" });

            // const headers = new Headers();

            // headers.set("Content-Type", "image/png");
            // headers.set("Content-Length", blob.length.toString());

            // // 响应页面截图
            // return new NextResponse(blob, { status: 200, statusText: "OK", headers });
            res.status(200).json({ code: -1, msg: await page.title() });
        } catch (err) {
            // console.log(err);
            // return NextResponse.json(
            //     { error: "Internal Server Error" },
            //     { status: 500 }
            // );
            res.status(200).json({ code: -1, msg: JSON.stringify(err) });

        } finally {
            // 释放资源
            await browser.close();

        }
    }
    // let browser = null;
    // const { ip } = req.query;
    // if (!ip) {
    //     return res.status(200).json({ code: -1, msg: 'ip blank' });
    // }
    // // 这里可以再对IP的合法性做进一步校验
    // try {
    //     browser = await chromium.puppeteer.launch({
    //         headless: true,
    //         args: chromium.args,
    //         defaultViewport: chromium.defaultViewport,
    //         executablePath: await chromium.executablePath,
    //         headless: chromium.headless,
    //         ignoreHTTPSErrors: true,
    //     });
    //     const page = await browser.newPage();

    //     await page.goto("https://www.zhihu.com/", { waitUntil: 'domcontentloaded' });
    //     const data = await page.evaluate((ipaddr) => {
    //         return new Promise(reslove => {
    //             //  这里的api-key似乎是不变的
    //             ipaddr = ipaddr + "232323"
    //         });
    //     }, ip);
    //     res.status(200).json({ data, ip })
    // } catch (error) {
    //     return res.status(200).json({ code: -1, msg: `${error}` });
    // } finally {
    //     if (browser) {
    //         await browser.close();
    //     }

    // }
}