## Official Anti-Captcha.com npm module ##

Official anti-captcha.com npm package for solving images with text, Recaptcha v2/v3 Enterprise/non-Enterpise, Funcaptcha, GeeTest, HCaptcha Enterprise/non-Enterprise.

[Anti-captcha](https://anti-captcha.com) is an oldest and cheapest web service dedicated to solving captchas by human workers from around the world. By solving captchas with us you help people in poorest regions of the world to earn money, which not only cover their basic needs, but also gives them ability to financially help their families, study and avoid jobs where they're simply not happy.

To use the service you need to [register](https://anti-captcha.com/clients/) and topup your balance. Prices start from $0.0005 per image captcha and $0.002 for Recaptcha. That's $0.5 per 1000 for images and $2 for 1000 Recaptchas.

For more technical information and articles visit our [documentation](https://anti-captcha.com/apidoc) page. 

Module installation:
```bash
npm -i @antiadmin/anticaptchaofficial
```

Import and check your balance:
```javascript
const ac = require("@antiadmin/anticaptchaofficial");
ac.setAPIKey('YOUR_API_KEY');
ac.getBalance()
     .then(balance => console.log('my balance is $'+balance))
     .catch(error => console.log('received error '+error))

```

Disable verbose output to console:
```javascript
ac.shutUp();
```

Specify softId to earn __10% commission__ from all captcha spendings with your app.
Get your softId in [Developers Center](https://anti-captcha.com/clients/tools/devcenter).
```javascript
ac.setSoftId(SOFT_ID_NUMBER);
```
&nbsp;


---
Solve image captcha:
```javascript
const fs = require('fs');
const captcha = fs.readFileSync('captcha.png', { encoding: 'base64' });
ac.solveImage(captcha, true)
    .then(text => console.log('captcha text: '+text))
    .catch(error => console.log('test received error '+error));
```
Report last solved image captcha as incorrect (must read [this](https://anti-captcha.com/apidoc/methods/reportIncorrectImageCaptcha) before using):
```javascript
ac.reportIncorrectImageCaptcha();
```
---

&nbsp;

Solve Recaptcha V2 without proxy:
```javascript
ac.settings.recaptchaDataSValue = 'set me for google.com domains';
ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY')
    .then(gresponse => {
        console.log('g-response: '+gresponse);
        console.log('google cookies:');
        console.log(ac.getCookies());
    })
    .catch(error => console.log('test received error '+error));
```
Learn what to do with g-response in [this](https://anti-captcha.com/apidoc/articles/how-to-use-g-response) article.


Report last solved Recaptcha v2/v3 as incorrect (must read [this](https://anti-captcha.com/apidoc/methods/reportIncorrectRecaptcha) before using):
```javascript
ac.reportIncorrectRecaptcha();
```

Report Recaptcha v3 as correctly solved (more info [here](https://anti-captcha.com/apidoc/methods/reportCorrectRecaptcha) before using):
```javascript
ac.reportCorrectRecaptcha();
```




Solve Recaptcha V2 with proxy:
```javascript
ac.solveRecaptchaV2ProxyOn('http://DOMAIN.COM',
    'WEBSITE_KEY',
    'http', //http, socks4, socks5
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
    'some=cookies') 
    .then(gresponse => {
        console.log('g-response: '+gresponse);
    })
    .catch(error => console.log('test received error '+error));
```
Solve Recaptcha V2-invisible (note the 3rd parameter "true"):
```javascript
ac.solveRecaptchaV2Proxyless('http://DOMAIN.COM', 'WEBSITE_KEY', true)
```
---

&nbsp;

Solve Recaptcha V3:
```javascript
ac.solveRecaptchaV3('http://DOMAIN.COM',
    'WEBSITE_KEY',
    0.3, //minimum score required: 0.3, 0.7 or 0.9
    'PAGE_ACTION_CAN_BE_EMPTY')
    .then(gresponse => {
        console.log('g-response: '+gresponse);
    })
    .catch(error => console.log('test received error '+error));
```

Solve Recaptcha V2 Enterprise without proxy:
```javascript
ac.solveRecaptchaV2EnterpriseProxyless(
    'http://DOMAIN.COM', 
    'WEBSITE_KEY', 
    { 
        "s" : "SOME_TOKEN",
        "custom_parameter" : "string_number_boolean" 
    })
    .then(gresponse => {
        console.log('g-response: '+gresponse);
    })
    .catch(error => console.log('test received error '+error));
```
---

&nbsp;

Solve HCaptcha without proxy:
```javascript
ac.solveHCaptchaProxyless('http://DOMAIN.COM', 'WEBSITE_KEY', 'FULL USER AGENT HERE')
    .then(token => {
        console.log('token: '+token);
    })
    .catch(error => console.log('test received error '+error));
```
Report last solved Hcaptcha as incorrect:
```javascript
ac.reportIncorrectHcaptcha();
```
---
&nbsp;

Solve HCaptcha Enterprise without proxy:
```javascript
ac.solveHCaptchaProxyless('http://DOMAIN.COM', 
    'WEBSITE_KEY', 
    'FULL USER AGENT HERE',
    {
        'rqdata': 'rqdata from target website',
        'sentry': true,
        // set here parameters like rqdata, sentry, apiEndpoint, endpoint, reportapi, assethost, imghost
        // for more info go to https://anti-captcha.com/apidoc/task-types/HCaptchaTaskProxyless
    })
    .then(token => {
        console.log('token: '+token);
    })
    .catch(error => console.log('test received error '+error));
```

---

&nbsp;

Solve Turnstile without proxy:
```javascript
ac.solveTurnstileProxyless('http://DOMAIN.COM', 'WEBSITE_KEY')
    .then(token => {
        console.log('token: '+token);
    })
    .catch(error => console.log('test received error '+error));
```
---
&nbsp;

Solve Turnstile with proxy:
```javascript
ac.solveTurnstileProxyOn('http://DOMAIN.COM',
    'WEBSITE_KEY',
    'http', //http, socks4, socks5
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD')
    .then(token => {
        console.log('token: '+token);
    })
    .catch(error => console.log('test received error '+error));
```
---
&nbsp;

Solve AntiGate Task:
```javascript
ac.solveAntiGateTask(
    'http://antigate.com/logintest.php', 
    'Sign-in and wait for control text', 
    { 
        "login_input_css": "#login",
        "login_input_value": "the login",
        "password_input_css": "#password",
        "password_input_value": "the password",
        "control_text": "You have been logged successfully" 
    })
    .then(solution => {
        console.log('cookies: ', solution.cookies);
        console.log('localStorage: ', solution.localStorage);
        console.log('url: ', solution.url);
    })
    .catch(error => console.error('test received error: ', error));
```
same with a proxy:
```javascript
ac.solveAntiGateTask(
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
    'PROXY_PASSWORD')
    .then(solution => {
        console.log(solution);
    })
    .catch(error => console.error('test received error: ', error));
```
Send a task with a delayed variable and push it after a few seconds:
```javascript
(async() => {
    try {
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

    } catch (e) {
        console.error('Something went wrong: '+e.toString());
    }
})();
```


&nbsp;

Bypass Cloudflare / Datadome / etc:
```javascript
ac.solveAntiBotCookieTask(
    'https://www.thewebsite.com/', 
    'PROXY_IP',
    'PROXY_PORT',
    'PROXY_LOGIN',
    'PROXY_PASSWORD')
    .then(solution => {
        console.log(solution);
        //use solution.fingerprint['self.navigator.userAgent'] as user-agent for your requests
        //use solution.cookies for your requests
    })
    .catch(error => console.error('test received error: ', error));
```

---
Other available task types with similar method calls:

```javascript
ac.solveRecaptchaV2EnterpriseProxyOn( ... ); //Recaptcha V2 Enterprise with proxy
ac.solveRecaptchaV3Enterprise( ... ); //Recaptcha V3 Enterprise
ac.solveHCaptchaProxyOn( ... ); //hCaptcha with proxy
ac.solveFunCaptchaProxyless( ... ); //Solve FunCaptcha Arkoselabs without proxy
ac.solveFunCaptchaProxyOn( ... ); //Solve FunCaptcha Arkoselabs  with proxy
ac.solveGeeTestProxyless( ... ); //Solve Geetest without proxy
ac.solveGeeTestProxyOn( ... ); //Solve Geetest with proxy
ac.solveGeeTestV4Proxyless( ... ); //Bypass Geetest V4 without proxy
ac.solveGeeTestV4ProxyOn( ... ); //Bypass Geetest V4 with proxy
```
