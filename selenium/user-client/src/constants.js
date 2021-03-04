module.exports = {
    "environments" : {
        "spaces.avayacloud.com" : {
            "accounts" : "accounts.avayacloud.com",
            "selectors" : {
                "emailXPath" : '//*[@id="UsernameInput"]/input',
                "passwordXPath" : '//*[@id="PasswordInput"]/input',
                "signInButtonXPath" : '//*[@id="GetStartedBtn"]',
                "meetingButtonXPath" : '/html/body/div/div/div[3]/div[3]/div[4]/div/div[1]/div/div/div/button',
                "joinButtonXPath" : '/html/body/div/div/div[3]/div[3]/div[6]/div/div[1]/div/div/div/div[3]/div/button',
                "signInFromGuestXPath" : '//*[@id="root"]/div/div[5]'
            }
        },
        "loganstaging.esna.com" : {
            "accounts" : "accounts.onesnastaging.com",
            "selectors" : {
                "emailXPath" : '//*[@id="UsernameInput"]/input',
                "passwordXPath" : '//*[@id="PasswordInput"]/input',
                "signInButtonXPath" : '//*[@id="GetStartedBtn"]',
                "meetingButtonXPath" : '/html/body/div/div/div[3]/div[3]/div[4]/div/div[1]/div/div/div/button',
                "joinButtonXPath" : '/html/body/div/div/div[3]/div[3]/div[6]/div/div[1]/div/div/div/div[3]/div/button',
                "signInFromGuestXPath" : '//*[@id="root"]/div/div[5]'
            }
        }
    },
    "PRODUCTION" : "spaces.avayacloud.com",
    "STAGING" : "loganstaging.esna.com"
}