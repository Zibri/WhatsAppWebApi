const Api = {}

const initApi = () => {
    return new Promise((resolve, reject) => {
        /*
        *  There are 2 stores that need initializing: WLAPStore and WLAPWAPStore.
        *  From the WA DOM we extract 2 scrips, download and regex them to search
        *  for the correct function names in the webpacked WA javascripts.   *
        *
        * */

        const scripts = document.getElementsByTagName('script')
        const regexApp = /\/app\..+.js/
        const regexApp2 = /\/app2\..+.js/
        let appScriptUrl, app2ScriptUrl

        // Derive script urls
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src
            if (regexApp.exec(src) != null) {
                appScriptUrl = src
            }

            if (regexApp2.exec(src) != null) {
                app2ScriptUrl = src
            }
        }

        // Download scripts, regex them and assign store
        fetch(appScriptUrl).then(e => {
            const reader = e.body.getReader()
            let js_src = ""

            return reader.read().then(function readMore({done, value}) {
                const td = new TextDecoder("utf-8")
                const str_value = td.decode(value)
                if (done) {
                    js_src += str_value
                    const regExDynNameStore = /Wap:[a-z]\('"(\w+)"'\)/
                    const res = regExDynNameStore.exec(js_src)
                    const funcName = res[1]
                    window.webpackJsonp([], {[funcName]: (x, y, z) => {Api.WLAPWAPStore = z('"' + funcName + '"')}}, funcName)
                    return
                }

                js_src += str_value
                return reader.read().then(readMore)

            })

        }).then(() => {
            fetch(app2ScriptUrl).then(e => {
                const reader = e.body.getReader()
                let js_src = ""

                return reader.read().then(function readMore({done, value}) {
                    const td = new TextDecoder("utf-8")
                    const str_value = td.decode(value)
                    if (done) {
                        js_src += str_value
                        const regExDynNameStore = /'"(\w+)"':function\(e,t,a\)\{\"use strict\";e\.exports=\{AllStarredMsgs:/
                        const res = regExDynNameStore.exec(js_src)
                        const funcName = res[1]

                        window.webpackJsonp([], {[funcName]: (x, y, z) => Api.WLAPStore = z('"' + funcName + '"')}, funcName)
                        resolve()
                        return
                    }

                    js_src += str_value
                    return reader.read().then(readMore)

                })

            })
        })


    })
}

const getApi = () => {
    if (Api && typeof Api.WLAPStore === "object" && typeof Api.WLAPWAPStore === "object") {
        return Api
    } else {
        console.error('WWapApi is not initialized, call initApi() first')
    }
}
