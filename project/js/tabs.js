/* 通用选项卡（tab）组件，可复用在任意页面
 *
 * 使用方法：
 *   1. 容器加 data-tzk-tabs；
 *   2. 选项卡按钮加 data-tzk-tabs-tab，放在带 data-tzk-tabs-tablist 的标签栏里；
 *   3. 内容面板加 data-tzk-tabs-panel，顺序与按钮一一对应；
 *   4. 引入本文件即可自动初始化，同一页面可以放多组选项卡，互不影响。
 *
 * 切换逻辑：先清除所有选项卡的选中状态，再设置当前元素的选中状态。
 */
(function (window, document) {
    'use strict';

    var tzkTabsTabActive = 'tzk-tabs__tab--active';
    var tzkTabsPanelActive = 'tzk-tabs__panel--active';

    /* 切换到第 index 个选项卡 */
    function tzkTabsSwitch(root, tzkTabsIndex) {
        var tzkTabsTabs = root.querySelectorAll('[data-tzk-tabs-tab]');
        var tzkTabsPanels = root.querySelectorAll('[data-tzk-tabs-panel]');
        var tzkTabsCurrent = tzkTabsTabs[tzkTabsIndex];
        if (!tzkTabsCurrent) return;

        // 第一步：清除所有选项卡的选中状态
        for (var tzkTabsI = 0; tzkTabsI < tzkTabsTabs.length; tzkTabsI++) {
            tzkTabsTabs[tzkTabsI].classList.remove(tzkTabsTabActive);
            tzkTabsTabs[tzkTabsI].setAttribute('aria-selected', 'false');
            tzkTabsTabs[tzkTabsI].setAttribute('tabindex', '-1');
        }

        // 同时清除所有内容面板的显示状态
        for (var tzkTabsJ = 0; tzkTabsJ < tzkTabsPanels.length; tzkTabsJ++) {
            tzkTabsPanels[tzkTabsJ].classList.remove(tzkTabsPanelActive);
        }

        // 第二步：设置当前元素的选中状态
        tzkTabsCurrent.classList.add(tzkTabsTabActive);
        tzkTabsCurrent.setAttribute('aria-selected', 'true');
        tzkTabsCurrent.setAttribute('tabindex', '0');
        if (tzkTabsPanels[tzkTabsIndex]) {
            tzkTabsPanels[tzkTabsIndex].classList.add(tzkTabsPanelActive);
        }
    }

    /* 为单个选项卡容器绑定事件（重复调用不会重复绑定） */
    function tzkTabsBind(root) {
        if (root.dataset.tzkTabsReady === 'true') return;

        var tzkTabsTablist = root.querySelector('[data-tzk-tabs-tablist]');
        if (!tzkTabsTablist) return;

        // 事件监听：点击事件委托到标签栏上，新增的选项卡按钮也能响应
        tzkTabsTablist.addEventListener('click', function (tzkTabsEvent) {
            var tzkTabsTarget = tzkTabsEvent.target.closest('[data-tzk-tabs-tab]');
            if (!tzkTabsTarget || !root.contains(tzkTabsTarget)) return;

            var tzkTabsTabs = root.querySelectorAll('[data-tzk-tabs-tab]');
            tzkTabsSwitch(root, Array.prototype.indexOf.call(tzkTabsTabs, tzkTabsTarget));
        });

        // 键盘操作：左右方向键切换选项卡，Home / End 跳到首尾
        tzkTabsTablist.addEventListener('keydown', function (tzkTabsEvent) {
            var tzkTabsKey = tzkTabsEvent.key;
            if (tzkTabsKey !== 'ArrowLeft' && tzkTabsKey !== 'ArrowRight' &&
                tzkTabsKey !== 'Home' && tzkTabsKey !== 'End') {
                return;
            }

            var tzkTabsTabs = root.querySelectorAll('[data-tzk-tabs-tab]');
            var tzkTabsActive = root.querySelector('[data-tzk-tabs-tab][aria-selected="true"]');
            var tzkTabsNow = Array.prototype.indexOf.call(tzkTabsTabs, tzkTabsActive);
            var tzkTabsNext = tzkTabsNow;

            if (tzkTabsKey === 'ArrowLeft') tzkTabsNext = (tzkTabsNow + tzkTabsTabs.length - 1) % tzkTabsTabs.length;
            if (tzkTabsKey === 'ArrowRight') tzkTabsNext = (tzkTabsNow + 1) % tzkTabsTabs.length;
            if (tzkTabsKey === 'Home') tzkTabsNext = 0;
            if (tzkTabsKey === 'End') tzkTabsNext = tzkTabsTabs.length - 1;

            tzkTabsEvent.preventDefault();
            tzkTabsSwitch(root, tzkTabsNext);
            tzkTabsTabs[tzkTabsNext].focus();
        });

        // 默认项：优先取 aria-selected="true" 的按钮，否则取第一个
        var tzkTabsFirst = root.querySelector('[data-tzk-tabs-tab][aria-selected="true"]') ||
            root.querySelector('[data-tzk-tabs-tab]');
        if (tzkTabsFirst) {
            var tzkTabsAll = root.querySelectorAll('[data-tzk-tabs-tab]');
            tzkTabsSwitch(root, Array.prototype.indexOf.call(tzkTabsAll, tzkTabsFirst));
        }

        root.dataset.tzkTabsReady = 'true';
    }

    /* 初始化页面上所有选项卡 */
    function tzkTabsInit(tzkTabsScope) {
        var tzkTabsRoots = (tzkTabsScope || document).querySelectorAll('[data-tzk-tabs]');
        for (var tzkTabsI = 0; tzkTabsI < tzkTabsRoots.length; tzkTabsI++) {
            tzkTabsBind(tzkTabsRoots[tzkTabsI]);
        }
    }

    // 对外暴露，方便动态插入内容后手动初始化
    window.tzkTabs = {
        init: tzkTabsInit,
        switch: function (root, index) {
            tzkTabsSwitch(root, index);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            tzkTabsInit();
        });
    } else {
        tzkTabsInit();
    }
})(window, document);
