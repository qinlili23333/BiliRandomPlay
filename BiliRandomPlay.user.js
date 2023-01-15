// ==UserScript==
// @name         B站分P视频随机播放
// @namespace    https://github.com/GyanguStar
// @version      0.3.0
// @description  B站分P视频随机播放
// @author       GyanguStar
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @homepage     https://github.com/GyanguStar/BiliRandomPlay
// @supportURL   https://github.com/GyanguStar/BiliRandomPlay
// @license      GPLv3
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';
    if (document.getElementById("multi_page")) {
        const utils = {
            parseInfo: text => {
                return {
                    now: text.substr(1, text.indexOf("/") - 1),
                    total: text.substr(text.indexOf("/") + 1, text.length - text.indexOf("/") - 2)
                }
            },
            random: (min, max) => {
                return Math.round(Math.random() * (max - min)) + min;
            }
        }
        let current = utils.parseInfo(document.getElementsByClassName("cur-page")[0].innerText);
        let next = 0;
        let noClick = true;
        //接管pushState来替换分P
        history.pushState.bind(history)
        const originPush = history.pushState
        window.history.pushState = (a, b, c) => {
            if (c.startsWith("/video")) {
                c = location.origin + c
            }
            const nextUrl = new URL(c)
            if ((nextUrl.pathname == location.pathname) && switchOn && noClick) {
                const nextParams = new URLSearchParams(nextUrl.search);
                nextParams.set('p', next);
                nextParams.set('random', 'on');
                location.href = nextUrl.pathname + "?" + nextParams.toString();
            } else {
                originPush.call(history, a, b, c)
                searchParams = new URLSearchParams(document.location.search);
            }
        }
        let switchOn = false;
        let searchParams = new URLSearchParams(document.location.search);
        if (searchParams.get("random") == "on") {
            switchOn = true
        }
        setTimeout(() => {
            if (switchOn) {
                document.querySelector("#multi_page > div.head-con > div.head-right").innerHTML = '<span class="next-button"><span class="txt">随机播放</span> <span id="random-switch" class="switch-button on"></span></span>' + document.querySelector("#multi_page > div.head-con > div.head-right").innerHTML;
            }
            else {
                document.querySelector("#multi_page > div.head-con > div.head-right").innerHTML = '<span class="next-button"><span class="txt">随机播放</span> <span id="random-switch" class="switch-button"></span></span>' + document.querySelector("#multi_page > div.head-con > div.head-right").innerHTML;
            }
            document.querySelector('#random-switch').addEventListener("click", function () {
                switchOn = !switchOn
                if (switchOn) {
                    this.className = "switch-button on"
                }
                else {
                    this.className = "switch-button"
                }
            })
            random();
            document.querySelector("#multi_page > div.cur-list").addEventListener("click", () => {
                noClick = false;
                setTimeout(() => { noClick = true; }, 500)
            }, true);
        }, 5000);
        const random = () => {
            if (switchOn) {
                next = utils.random(1, current.total)
                searchParams.set('random', 'on');
                originPush.call(history, {}, '', location.pathname + "?" + searchParams.toString())
            } else {
                searchParams.set('random', 'off');
                originPush.call(history, {}, '', location.pathname + "?" + searchParams.toString())
            }
        }
    }
})();
