
module.exports = {
    settings: {
        clientKey : '12345678901234567890123456789012',

        // reCAPTCHA 2
        websiteSToken: null,
        recaptchaDataSValue: null,

        // image
        phrase: null,
        case: null,
        numeric: null,
        math: null,
        minLength: null,
        maxLength: null,
        languagePool: 'en',
        comment: null,

        connectionTimeout: 20,
        firstAttemptWaitingInterval: 5,
        normalWaitingInterval: 2,
        isVerbose: true,
        taskId: 0,

        funcaptchaApiJSSubdomain: null,
        funcaptchaDataBlob: null,

        softId: 0,

        //opensubmitter.com revenue share program
        OSTronAddress: '',

        hcaptchaUserAgent: null,
        hcaptchaRespKey: null

    },
    setAPIKey(key) {
        this.settings.clientKey = key;
    },
    shutUp() {
        this.settings.isVerbose = false;
    },
    //Specify softId to earn 10% commission with your app.
    //Get your softId here: https://anti-captcha.com/clients/tools/devcenter
    setSoftId(softId) {
        this.settings.softId = softId;
    },
    async getBalance() {
        const response = await this.JSONRequest('getBalance', {
            'clientKey' : this.settings.clientKey
        });
        return response.balance;
    },
    async getCreditsBalance() {
        const response = await this.JSONRequest('getBalance', {
            'clientKey' : this.settings.clientKey
        });
        if (typeof response.captchaCredits !== "undefined") return response.captchaCredits;
        else return 0;
    },
    async solveImage(body) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:           'ImageToTextTask',
                    body:           body,
                    phrase:         this.settings.phrase,
                    case:           this.settings.case,
                    numeric:        this.settings.numeric,
                    comment:        this.settings.comment,
                    math:           this.settings.math,
                    minLength:      this.settings.minLength,
                    maxLength:      this.settings.maxLength,
                    languagePool : this.settings.languagePool
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.text;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },
    async reportIncorrectImageCaptcha() {
        await this.JSONRequest('reportIncorrectImageCaptcha', {
                'clientKey' : this.settings.clientKey,
                'taskId': this.settings.taskId
            })
        return true;
    },

    async solveRecaptchaV2Proxyless(websiteURL, websiteKey, isInvisible = false) {
        const task = {
            type:                   'RecaptchaV2TaskProxyless',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey,
            websiteSToken:          this.settings.websiteSToken,
            recaptchaDataSValue:    this.settings.recaptchaDataSValue
        }
        if (isInvisible === true) {
            task['isInvisible'] = true
        }
        const taskCreateResult =
            await this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task'      : task,
                'softId'    : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            if (solution.cookies) {
                this.settings.cookies = solution.cookies;
            }
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveRecaptchaV2ProxyOn(websiteURL,
                            websiteKey,
                            proxyType,
                            proxyAddress,
                            proxyPort,
                            proxyLogin,
                            proxyPassword,
                            userAgent,
                            cookies,
                            isInvisible = false) {

        const task = {
            type:                   'RecaptchaV2Task',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey,
            websiteSToken:          this.settings.websiteSToken,
            recaptchaDataSValue:    this.settings.recaptchaDataSValue,
            proxyType:              proxyType,
            proxyAddress:           proxyAddress,
            proxyPort:              proxyPort,
            proxyLogin:             proxyLogin,
            proxyPassword:          proxyPassword,
            userAgent:              userAgent,
            cookies:                cookies
        };
        if (isInvisible === true) {
            task['isInvisible'] = true;
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task'      : task,
                'softId'    : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            if (solution.cookies) {
                this.settings.cookies = solution.cookies;
            }
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },


    async solveRecaptchaV3(websiteURL, websiteKey, minScore, pageAction) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'RecaptchaV3TaskProxyless',
                    websiteURL:             websiteURL,
                    websiteKey:             websiteKey,
                    minScore:               minScore,
                    pageAction:             pageAction
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveRecaptchaV2EnterpriseProxyless(websiteURL,
                                        websiteKey,
                                        enterprisePayload = null) {

        const taskObject = {
            type:                   'RecaptchaV2EnterpriseTaskProxyless',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey
        };
        if (enterprisePayload) {
            taskObject["enterprisePayload"] = enterprisePayload;
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : taskObject,
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },


    async solveRecaptchaV2EnterpriseProxyOn(websiteURL,
                                      websiteKey,
                                      enterprisePayload,
                                      proxyType,
                                      proxyAddress,
                                      proxyPort,
                                      proxyLogin,
                                      proxyPassword,
                                      userAgent,
                                      cookies) {
        const taskObject = {
            type:                   'RecaptchaV2EnterpriseTask',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey,
            proxyType:              proxyType,
            proxyAddress:           proxyAddress,
            proxyPort:              proxyPort,
            proxyLogin:             proxyLogin,
            proxyPassword:          proxyPassword,
            userAgent:              userAgent,
            cookies:                cookies
        };
        if (enterprisePayload) {
            taskObject["enterprisePayload"] = enterprisePayload;
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : taskObject,
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveRecaptchaV3Enterprise(websiteURL, websiteKey, minScore, pageAction) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'RecaptchaV3TaskProxyless',
                    websiteURL:             websiteURL,
                    websiteKey:             websiteKey,
                    minScore:               minScore,
                    pageAction:             pageAction,
                    isEnterprise:           true
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            if (solution.cookies) {
                this.settings.cookies = solution.cookies;
            }
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async reportIncorrectRecaptcha() {
        await this.JSONRequest('reportIncorrectRecaptcha', {
                'clientKey' : this.settings.clientKey,
                'taskId': this.settings.taskId
            })
        return true;
    },

    async reportCorrectRecaptcha() {
        await this.JSONRequest('reportCorrectRecaptcha', {
            'clientKey' : this.settings.clientKey,
            'taskId': this.settings.taskId
        });
        return true;
    },


    async solveHCaptchaProxyless(websiteURL, websiteKey, userAgent, enterprisePayload, isInvisible, isEnterprise) {
        if (typeof userAgent === "undefined") userAgent = '';
        this.settings.hcaptchaUserAgent = null;
        this.settings.hcaptchaRespKey = null;
        const taskPayLoad = {
            type:                   'HCaptchaTaskProxyless',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey,
            userAgent:              userAgent
        }
        if (typeof enterprisePayload === "object") taskPayLoad['enterprisePayload'] = enterprisePayload;
        if (typeof isInvisible === "boolean") {
            if (isInvisible === true) taskPayLoad['isInvisible'] = true;
        }
        if (typeof isEnterprise === "boolean") {
            if (isEnterprise === true) taskPayLoad['isEnterprise'] = true;
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' :  taskPayLoad,
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            if (solution.userAgent) {
                this.settings.hcaptchaUserAgent = solution.userAgent;
            }
            if (solution.respKey) {
                this.settings.hcaptchaRespKey = solution.respKey;
            }
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveHCaptchaProxyOn(websiteURL,
                            websiteKey,
                            proxyType,
                            proxyAddress,
                            proxyPort,
                            proxyLogin,
                            proxyPassword,
                            userAgent,
                            cookies,
                            enterprisePayload,
                            isInvisible,
                            isEnterprise) {
        const taskPayLoad = {
            type:                   'HCaptchaTask',
            websiteURL:             websiteURL,
            websiteKey:             websiteKey,
            proxyType:              proxyType,
            proxyAddress:           proxyAddress,
            proxyPort:              proxyPort,
            proxyLogin:             proxyLogin,
            proxyPassword:          proxyPassword,
            userAgent:              userAgent,
            cookies:                cookies
        };
        if (typeof enterprisePayload === "object") taskPayLoad['enterprisePayload'] = enterprisePayload;
        if (typeof isInvisible === "boolean") {
            if (isInvisible === true) taskPayLoad['isInvisible'] = true;
        }
        if (typeof isEnterprise === "boolean") {
            if (isEnterprise === true) taskPayLoad['isEnterprise'] = true;
        }
        this.settings.hcaptchaUserAgent = null;
        this.settings.hcaptchaRespKey = null;
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : taskPayLoad,
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            if (solution.userAgent) {
                this.settings.hcaptchaUserAgent = solution.userAgent;
            }
            if (solution.respKey) {
                this.settings.hcaptchaRespKey = solution.respKey;
            }
            return solution.gRecaptchaResponse;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },


    async reportIncorrectHcaptcha() {
        await this.JSONRequest('reportIncorrectHcaptcha', {
                'clientKey' : this.settings.clientKey,
                'taskId': this.settings.taskId
            });
        return true;
    },

    async solveFunCaptchaProxyless(websiteURL, websiteKey) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'FunCaptchaTaskProxyless',
                    websiteURL:             websiteURL,
                    websitePublicKey:       websiteKey,
                    funcaptchaApiJSSubdomain:   this.settings.funcaptchaApiJSSubdomain ? this.settings.funcaptchaApiJSSubdomain : '',
                    data: this.settings.funcaptchaDataBlob ? JSON.stringify({
                        blob: this.settings.funcaptchaDataBlob
                    }) : ''
                },
                'softId' : this.settings.softId
            })
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.token;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveFunCaptchaProxyOn(websiteURL,
                         websiteKey,
                         proxyType,
                         proxyAddress,
                         proxyPort,
                         proxyLogin,
                         proxyPassword,
                         userAgent,
                         cookies) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'FunCaptchaTask',
                    websiteURL:             websiteURL,
                    websitePublicKey:       websiteKey,
                    funcaptchaApiJSSubdomain:   this.settings.funcaptchaApiJSSubdomain ? this.settings.funcaptchaApiJSSubdomain : '',
                    data: this.settings.funcaptchaDataBlob ? JSON.stringify({
                        blob: this.settings.funcaptchaDataBlob
                    }) : '',
                    proxyType:              proxyType,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword,
                    userAgent:              userAgent,
                    cookies:                cookies
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.token;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },



    async solveGeeTestProxyless(websiteURL,
                          gt,
                          challenge,
                          apiSubdomain,
                          getLib) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                       'GeeTestTaskProxyless',
                    websiteURL:                 websiteURL,
                    gt:                         gt,
                    challenge:                  challenge,
                    geetestApiServerSubdomain:  apiSubdomain,
                    geetestGetLib:              getLib,
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return await this.waitForResult(taskCreateResult.taskId);
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveGeeTestV4Proxyless(websiteURL,
                          captchaId,
                          apiSubdomain,
                          initParameters) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                       'GeeTestTaskProxyless',
                    websiteURL:                 websiteURL,
                    gt:                         captchaId,
                    geetestApiServerSubdomain:  apiSubdomain,
                    version:                    4,
                    initParameters:             initParameters,
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return await this.waitForResult(taskCreateResult.taskId);
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveGeeTestProxyOn(websiteURL,
                           gt,
                           challenge,
                           apiSubdomain,
                           getLib,
                           proxyType,
                           proxyAddress,
                           proxyPort,
                           proxyLogin,
                           proxyPassword,
                           userAgent,
                           cookies) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                       'GeeTestTask',
                    websiteURL:                 websiteURL,
                    gt:                         gt,
                    challenge:                  challenge,
                    geetestApiServerSubdomain:  apiSubdomain,
                    geetestGetLib:              getLib,

                    proxyType:              proxyType,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword,
                    userAgent:              userAgent,
                    cookies:                cookies
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return await this.waitForResult(taskCreateResult.taskId);
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveGeeTestV4ProxyOn(websiteURL,
                          captchaId,
                          apiSubdomain,
                          initParameters,
                          proxyType,
                          proxyAddress,
                          proxyPort,
                          proxyLogin,
                          proxyPassword,
                          userAgent,
                          cookies) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                       'GeeTestTask',
                    websiteURL:                 websiteURL,
                    gt:                         captchaId,
                    geetestApiServerSubdomain:  apiSubdomain,
                    version:                    4,
                    initParameters:             initParameters,
                    proxyType:              proxyType,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword,
                    userAgent:              userAgent,
                    cookies:                cookies
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return await this.waitForResult(taskCreateResult.taskId);
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveTurnstileProxyless(websiteURL, websiteKey, action = "", cData = "") {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' :  {
                    type:                   'TurnstileTaskProxyless',
                    websiteURL:             websiteURL,
                    websiteKey:             websiteKey,
                    action:                 action,
                    turnstileCData:         cData
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.token;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },


    async solveTurnstileProxyOn(websiteURL,
                            websiteKey,
                            proxyType,
                            proxyAddress,
                            proxyPort,
                            proxyLogin,
                            proxyPassword,
                            action = "",
                            cData = "") {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'TurnstileTask',
                    websiteURL:             websiteURL,
                    websiteKey:             websiteKey,
                    action:                 action,
                    turnstileCData:         cData,
                    proxyType:              proxyType,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.token;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },



    async sendAntiGateTask(websiteURL,
                      templateName,
                      variables,
                      proxyAddress,
                      proxyPort,
                      proxyLogin,
                      proxyPassword,
                      domainsOfInterest) {

        if (typeof templateName != "string") {
            throw 'Parameter "templateName" must be a string';
        }
        if (typeof variables != "object") {
            throw 'Parameter "variables" must be an object';
        }
        if (typeof domainsOfInterest != "object") {
            domainsOfInterest = [];
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'AntiGateTask',
                    websiteURL:             websiteURL,
                    templateName:           templateName,
                    variables:              variables,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword,
                    domainsOfInterest:      domainsOfInterest
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return taskCreateResult.taskId;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveAntiGateTask(websiteURL,
                      templateName,
                      variables,
                      proxyAddress,
                      proxyPort,
                      proxyLogin,
                      proxyPassword,
                      domainsOfInterest) {
        const taskId = await
            this.sendAntiGateTask(websiteURL,
                templateName,
                variables,
                proxyAddress,
                proxyPort,
                proxyLogin,
                proxyPassword,
                domainsOfInterest);
        return await this.waitForResult(taskId);
    },

    async pushAntiGateVariable(name, value) {
        return await this.JSONRequest('pushAntiGateVariable', {
                'clientKey' : this.settings.clientKey,
                'taskId': this.settings.taskId,
                'name': name,
                'value': value
            })
    },

    async solveAntiBotCookieTask(websiteURL,
                      proxyAddress,
                      proxyPort,
                      proxyLogin,
                      proxyPassword) {
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:                   'AntiBotCookieTask',
                    websiteURL:             websiteURL,
                    proxyAddress:           proxyAddress,
                    proxyPort:              proxyPort,
                    proxyLogin:             proxyLogin,
                    proxyPassword:          proxyPassword
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            return await this.waitForResult(taskCreateResult.taskId);
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async solveImageToCoordinates(body, comment, mode = "points") {
        if (['points', 'rectangles'].indexOf(mode) === -1) {
            mode = "points"
        }
        const taskCreateResult = await
            this.JSONRequest('createTask', {
                'clientKey' : this.settings.clientKey,
                'task' : {
                    type:           'ImageToCoordinatesTask',
                    body:           body,
                    comment:        comment,
                    mode:           mode
                },
                'softId' : this.settings.softId
            });
        if (taskCreateResult.taskId) {
            this.settings.taskId = taskCreateResult.taskId;
            const solution = await this.waitForResult(taskCreateResult.taskId);
            return solution.coordinates;
        } else {
            throw "ERROR_NO_SLOT_AVAILABLE";
        }
    },

    async waitForResult(taskId) {

        if (this.settings.isVerbose) console.log('created task with ID '+taskId);
        if (this.settings.isVerbose) console.log('waiting '+this.settings.firstAttemptWaitingInterval+' seconds');
        await this.delay(this.settings.firstAttemptWaitingInterval * 1000);

        while (taskId > 0) {
            const checkResult = await this.JSONRequest('getTaskResult', {
                'clientKey' :   this.settings.clientKey,
                'taskId'    :   taskId
            });
            if (checkResult.status === 'ready') {
                return checkResult.solution;
            }
            if (checkResult.status === 'processing') {
                if (this.settings.isVerbose) console.log('captcha result is not yet ready');
            }

            if (this.settings.isVerbose) console.log('waiting '+this.settings.normalWaitingInterval+' seconds');
            await this.delay(this.settings.normalWaitingInterval * 1000);

        }
    },

    async JSONRequest(methodName, payLoad) {

        if (typeof process !== 'object' || typeof require !== 'function') {
            const message = 'Application should be run either in NodeJs or a WebBrowser environment';
            if (this.settings.isVerbose) console.error(message);
            throw message;
        }

        if (methodName === 'createTask' && this.settings.OSTronAddress.length > 0) {
            payLoad['revenueShareTronAddress'] = this.settings.OSTronAddress;
        }

        const axios = require('axios');

        const response =
            await axios.post('https://api.anti-captcha.com/' + methodName,
                payLoad,
                {
                    timeout: this.connectionTimeout * 1000,
                    headers: {
                        'content-type':     'application/json; charset=utf-8',
                        'accept':           'application/json'
                    }
                });

        return this.checkForErrors(response.data);
    },

    checkForErrors(response) {
        if (typeof response.errorId === "undefined") {
            throw "Incorrect API response, something is wrong";
        }
        if (typeof response.errorId !== "number") {
            throw "Unknown API error code "+response.errorId
        }
        if (response.errorId > 0) {
            if (this.settings.isVerbose) console.error('Received API error '+response.errorCode+': '+response.errorDescription);
            throw response.errorCode;
        }
        return response;
    },

    getCookies() {
        return this.settings.cookies;
    },

    getHcaptchaUserAgent() {
        return this.settings.hcaptchaUserAgent;
    },

    getHcaptchaRespKey() {
        return this.settings.hcaptchaRespKey;
    },

    delay(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time)
        });
    }
}
