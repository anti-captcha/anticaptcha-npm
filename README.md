## Official Anti-Captcha.com npm module ##

Official anti-captcha.com npm package for solving images with text, Recaptcha v2/v3 Enterprise/non-Enterpise, Funcaptcha, GeeTest, HCaptcha Enterprise/non-Enterprise.

[Anti-captcha](https://anti-captcha.com) is an oldest and cheapest web service dedicated to solving captchas by human workers from around the world. By solving captchas with us you help people in poorest regions of the world to earn money, which not only cover their basic needs, but also gives them ability to financially help their families, study and avoid jobs where they're simply not happy.

To use the service you need to [register](https://anti-captcha.com/clients/) and topup your balance. Prices start from $0.0005 per image captcha and $0.002 for Recaptcha. That's $0.5 per 1000 for images and $2 for 1000 Recaptchas.

For more technical information and articles visit our [documentation](https://anti-captcha.com/apidoc) page. 

Module installation:
```bash
npm install @antiadmin/anticaptchaofficial
```

Import and check your balance in sync mode:
```javascript
(async() => {
    
    const ac = require("@antiadmin/anticaptchaofficial");
    ac.setAPIKey('YOUR_API_KEY');
    try {
        const balance = await ac.getBalance();
        console.log(`my balance is $${balance}`);
        if (balance <= 0) {
            throw "negative balance"
        }
        console.log("solving a captcha..")
        // const token = await ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY');
        // const fs = require('fs');
        // const text = await ac.solveImage(fs.readFileSync('captcha.png', { encoding: 'base64' }), true)
    } catch (e) {
        console.log("got error: ", e.toString());
    }
    
})();
```
Or do the same with promises:
```javascript
const ac = require("@antiadmin/anticaptchaofficial");
ac.setAPIKey('YOUR_API_KEY');
ac.getBalance()
     .then(balance => {
         console.log('my balance is $' + balance)
         if (balance <= 0) {
             return false;
         }
         console.log("solving a captcha..")
         // ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY')
         //     .then(token => {
         //         console.log('Got g-response:', token)
         //         // do something
         //     })
         //     .catch(error => {
         //         console.log('test received error ' + error)
         //         return false;
         //     });
     })
     .catch(error => console.log('received error '+error))
```

Disable verbose output to console:
```javascript
ac.shutUp();
```
<br>
Request subscription credits balance:

```javascript
const remainingCredits = await ac.getCreditsBalance();
```
<br>

Specify softId to earn __10% commission__ from all captcha spendings with your app.
Get your softId in [Developers Center](https://anti-captcha.com/clients/tools/devcenter).
```javascript
ac.setSoftId(SOFT_ID_NUMBER);
```
&nbsp;

All following examples are for sync mode, compatible with promises
---
Run synchronous code like this:
&nbsp;
```javascript
(async() => {
    try {
        // your code here:
        // const balance = await ac.getBalance();
        // const token = await ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY');
        // etc.
    } catch (e) {
        console.error("Received error:", e.toString());
    }
})();
```
&nbsp;
---
Solve image captcha:
```javascript
const fs = require('fs');
const captcha = fs.readFileSync('captcha.png', { encoding: 'base64' });

// Additional flags, see https://anti-captcha.com/apidoc/task-types/ImageToTextTask for description:
// ac.settings.phrase = true;                  // 2 words
// ac.settings.case = true;                    // case sensitivity
// ac.settings.numeric = 1;                    // only numbers
// ac.settings.comment = "only green letters"; // text comment for workers
// ac.settings.math = true;                    // math operation like 50+2
// ac.settings.minLength = 1;                  // minimum amount of characters
// ac.settings.maxLength = 10;                 // maximum number of characters
// ac.settings.languagePool = 'en';            // language pool
const text = await ac.solveImage(captcha, true);
```

Report last solved image captcha as incorrect (must read [this](https://anti-captcha.com/apidoc/methods/reportIncorrectImageCaptcha) before using):
```javascript
await ac.reportIncorrectImageCaptcha();
```
---

&nbsp;

Solve Recaptcha V2 without proxy:
```javascript
ac.settings.recaptchaDataSValue = 'set me for google.com domains';
const gresponse = ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY');
console.log('g-response: '+gresponse);
console.log('google cookies:');
console.log(ac.getCookies());
```
Learn what to do with g-response in [this](https://anti-captcha.com/apidoc/articles/how-to-use-g-response) article.


Report last solved Recaptcha v2/v3 as incorrect (must read [this](https://anti-captcha.com/apidoc/methods/reportIncorrectRecaptcha) before using):
```javascript
await ac.reportIncorrectRecaptcha();
```

Report Recaptcha v3 as correctly solved (more info [here](https://anti-captcha.com/apidoc/methods/reportCorrectRecaptcha) before using):
```javascript
await ac.reportCorrectRecaptcha();
```




Solve Recaptcha V2 with proxy:
```javascript
const gresponse = await ac.solveRecaptchaV2ProxyOn('http://DOMAIN.COM',
    'WEBSITE_KEY',
    'http', //http, socks4, socks5
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
    'some=cookies');
```
Solve Recaptcha V2-invisible (note the 3rd parameter "true"):
```javascript
const gresponse = await ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY', true)
```
---

&nbsp;

Solve Recaptcha V3:
```javascript
const gresponse = await ac.solveRecaptchaV3('http://DOMAIN.COM',
    'WEBSITE_KEY',
    0.3, //minimum score required: 0.3, 0.7 or 0.9
    'PAGE_ACTION_CAN_BE_EMPTY');
```

Solve Recaptcha V2 Enterprise without proxy:
```javascript
const gresponse = await ac.solveRecaptchaV2EnterpriseProxyless(
    'http://DOMAIN.COM', 
    'WEBSITE_KEY', 
    {   //enterprise payload:
        "s" : "SOME_TOKEN",
        "custom_parameter" : "string_number_boolean" 
    });
```
---

&nbsp;

Solve HCaptcha without proxy:
```javascript
const token = await ac.solveHCaptchaProxyless('http://DOMAIN.COM', 'WEBSITE_KEY', 'FULL USER AGENT HERE');

// use this userAgent for posting the form with token!
const userAgent = ac.getHcaptchaUserAgent();

//some Hcaptchas also produce "respkey" value, this is how to get it:
const respKey = ac.getHcaptchaRespKey();

```
Report last solved Hcaptcha as incorrect:
```javascript
await ac.reportIncorrectHcaptcha();
```
---
&nbsp;

Solve HCaptcha Enterprise without proxy:
```javascript
const token = await ac.solveHCaptchaProxyless('http://DOMAIN.COM', 
    'WEBSITE_KEY', 
    'FULL USER AGENT HERE',
    {
        'rqdata': 'rqdata from target website',
        'sentry': true,
        // set here optional parameters like rqdata, sentry, apiEndpoint, endpoint, reportapi, assethost, imghost
        // for more info go to https://anti-captcha.com/apidoc/task-types/HCaptchaTaskProxyless
    },
    false, //set isInvisible  = false
    true); //set isEnterprise = true

// use this userAgent for posting the form with token!
const userAgent = ac.getHcaptchaUserAgent();

//some Hcaptchas also produce "respkey" value, this is how to get it:
const respKey = ac.getHcaptchaRespKey();
```

---
&nbsp;

Solve HCaptcha Enterprise with proxy:
```javascript
const token = await ac.solveHCaptchaProxyless('http://DOMAIN.COM', 
    'WEBSITE_KEY', 
    'FULL USER AGENT HERE',
    'http',
    '1.2.3.4',
    3128,
    'proxy-login',
    'proxy-password',
    '',
    '',
    {
        'rqdata': 'rqdata from target website',
        'sentry': true,
        // set here optional parameters like rqdata, sentry, apiEndpoint, endpoint, reportapi, assethost, imghost
        // for more info go to https://anti-captcha.com/apidoc/task-types/HCaptchaTaskProxyless
    },
    false, //set isInvisible  = false
    true); //set isEnterprise = true
const userAgent = ac.getHcaptchaUserAgent();
// use this userAgent for posting the form with token!
```

---

&nbsp;

Solve Turnstile without proxy:
```javascript
const token = await ac.solveTurnstileProxyless('http://DOMAIN.COM', 'WEBSITE_KEY', 'optional_action', 'optional_cData_token');
```
---
&nbsp;

Solve Turnstile with proxy:
```javascript
const token = await ac.solveTurnstileProxyOn('http://DOMAIN.COM',
    'WEBSITE_KEY',
    'http', //http, socks4, socks5
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD',
    'optional_action',
    'optional_cData_token');
```
---
&nbsp;

Solve AntiGate Task:
```javascript
const solution = await ac.solveAntiGateTask(
    'http://antigate.com/logintest.php', 
    'Sign-in and wait for control text', 
    { 
        "login_input_css": "#login",
        "login_input_value": "the login",
        "password_input_css": "#password",
        "password_input_value": "the password",
        "control_text": "You have been logged successfully" 
    });
console.log('cookies: ', solution.cookies);
console.log('localStorage: ', solution.localStorage);
console.log('url: ', solution.url);
```
same with a proxy:
```javascript
const solution = await ac.solveAntiGateTask(
    'http://antigate.com/logintest.php', 
    'Sign-in and wait for control text', 
    { 
        "login_input_css": "#login",
        "login_input_value": "the login",
        "password_input_css": "#password",
        "password_input_value": "the password",
        "control_text": "You have been logged successfully" 
    },
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD');
```
Send a task with a delayed variable and push it after a few seconds:
```javascript
const taskId = await ac.sendAntiGateTask('http://antigate.com/logintest2fa.php',
    'Sign-in with 2FA and wait for control text',
    {
        "login_input_css": "#login",
        "login_input_value": "the login",
        "password_input_css": "#password",
        "password_input_value": "the password",
        "2fa_input_css": "#2facode",
        "2fa_input_value": "_WAIT_FOR_IT_",
        "control_text": "You have been logged successfully"
    });
await ac.delay(5000); //simulate a delay in 2FA retrieval
await ac.pushAntiGateVariable('2fa_input_value', '349001');
const solution = await ac.waitForResult(taskId);

console.log('solution:');
console.log(solution);

```


&nbsp;

Bypass Cloudflare / Datadome / etc. [More info about this](https://anti-captcha.com/ru/apidoc/task-types/AntiBotCookieTask):
```javascript
const solution = await ac.solveAntiBotCookieTask(
    'https://www.thewebsite.com/', 
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD');
```
---

&nbsp;

Bypass Funcaptcha / Arkoselabs without proxy:
```javascript
//optional data blob:
ac.settings.funcaptchaDataBlob = 'blob value here is any, or leave it empty';
const token = await ac.solveFunCaptchaProxyless(
    'https://www.thewebsite.com/path',
    'site-key');
```
&nbsp;


Bypass Funcaptcha / Arkoselabs via proxy:
```javascript
//optional data blob:
ac.settings.funcaptchaDataBlob = 'blob value here is any, or leave it empty';
const token = await ac.solveFunCaptchaProxyOn(
    'https://www.thewebsite.com/path',
    'site-key', 
    'http',
    '1.2.3.4',
    3128,
    'proxy-login',
    'proxy-password',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
    '');
```

---



&nbsp;

Bypass Geetest version 3 without proxy. [See tutorial](https://anti-captcha.com/tutorials/how-to-use-chrome-breakpoints-for-finding-funcaptcha-and-geetest-api-parameters) how to find these parameters.
```javascript
const token = await ac.solveGeeTestProxyless(
    'https://www.thewebsite.com/path',
    'gt key 32 bytes',
    'challenge value 32 bytes',
    'optional.api-domain.com');
```

&nbsp;

Bypass Geetest version 4 without proxy. [See tutorial](https://anti-captcha.com/tutorials/how-to-use-chrome-breakpoints-for-finding-funcaptcha-and-geetest-api-parameters) how to find these parameters.
```javascript
const token = await ac.solveGeeTestV4Proxyless(
    'https://www.thewebsite.com/path',
    'captchaId key 32 bytes',
    'optional.api-domain.com',
    {
        'riskType': 'slide' //example
    });
```
---

&nbsp;
Get object coordinates in an image:
```javascript
const fs = require('fs');
const captcha = fs.readFileSync('captcha.png', { encoding: 'base64' });
const coordinates = await ac.solveImageToCoordinates(captcha, "Select all objects in specified order", "points");
```

Report last solved image captcha as incorrect:
```javascript
await ac.reportIncorrectImageCaptcha();
```
---

Other available task types with similar method calls, see source code:

```javascript
await ac.solveRecaptchaV2EnterpriseProxyOn( ... ); //Recaptcha V2 Enterprise with proxy
await ac.solveRecaptchaV3Enterprise( ... ); //Recaptcha V3 Enterprise
await ac.solveHCaptchaProxyOn( ... ); //hCaptcha with proxy
await ac.solveGeeTestProxyOn( ... ); //Solve Geetest with proxy
await ac.solveGeeTestV4ProxyOn( ... ); //Bypass Geetest V4 with proxy
```
