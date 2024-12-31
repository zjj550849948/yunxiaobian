// 创建动态链接的函数
function createLink(baseURL, inputElementId, linkElementId, additionalParams = '') {
    var userInput = document.getElementById(inputElementId).value;
    var fullURL = baseURL + encodeURIComponent(userInput) + additionalParams;
    document.getElementById(linkElementId).href = fullURL;
}

// 回车进入编辑页和搜索页
function bindEnterKey(inputElementId, linkElementId, createFunction) {
    document.getElementById(inputElementId).addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // 阻止默认的回车键行为
            const userInput = document.getElementById(inputElementId).value.trim();
            // 如果输入框内容为空，不执行链接点击行为
            if (!userInput) {
                return;
            }
            createFunction();
            document.getElementById(linkElementId).target = "_blank"; // 设置链接的 target 属性为 _blank，使其在新标签页中打开
            document.getElementById(linkElementId).click(); // 模拟点击链接
        }
    });
}

// 初始化绑定
document.addEventListener("DOMContentLoaded", function() {
    // 绑定回车事件
    bindEnterKey("songUserInput", "songLink", createSongLink);
    bindEnterKey("albumUserInput", "albumLink", createAlbumLink);
    bindEnterKey("artistUserInput", "artistLink", createArtistLink);
    bindEnterKey("addAlbumUserInput", "addAlbumLink", createAddAlbumLink);
    bindEnterKey("artistRepeatUserInput", "artistRepeatLink", createArtistRepeatLink);
    bindEnterKey("searchQuery", "searchLink", createSearchLink);

    // 初始化清空按钮功能
    initClearButton("songUserInput", "songLink", createSongLink);
    initClearButton("albumUserInput", "albumLink", createAlbumLink);
    initClearButton("artistUserInput", "artistLink", createArtistLink);
    initClearButton("addAlbumUserInput", "addAlbumLink", createAddAlbumLink);
    initClearButton("artistRepeatUserInput", "artistRepeatLink", createArtistRepeatLink);
    initClearButton("searchQuery", "searchLink", createSearchLink);
});

// 歌曲编辑页面直达
function createSongLink() {
    createLink("https://music.163.com/#/wiki/song?songId=", "songUserInput", "songLink");
}

// 专辑编辑页面直达
function createAlbumLink() {
    createLink("https://music.163.com/#/wiki/album?albumId=", "albumUserInput", "albumLink");
}

// 艺人编辑页面直达
function createArtistLink() {
    createLink("https://music.163.com/#/wiki/artist?artistId=", "artistUserInput", "artistLink");
}

// 艺人补充专辑页面直达
function createAddAlbumLink() {
    createLink("https://music.163.com/#/wiki/add-album?artistId=", "addAlbumUserInput", "addAlbumLink");
}

// 重复艺人报错页面直达
function createArtistRepeatLink() {
    createLink("https://music.163.com/#/wiki/artist-repeat-error?artistId=", "artistRepeatUserInput", "artistRepeatLink");
}

// 搜索页面直达
function createSearchLink() {
    // 获取输入框的搜索词和选择的搜索类型
    const searchType = document.getElementById("searchLabel").getAttribute("data-value");

    // 使用 createLink 来生成和设置搜索链接
    createLink("https://music.163.com/#/search/m/?s=", "searchQuery", "searchLink", `&type=${searchType}`);
}

// 通用下拉框选项绑定函数
function bindDropdownOptions(optionsSelector, labelElement, queryElement, onOptionSelected) {
    const options = document.querySelectorAll(optionsSelector);

    options.forEach(function(option) {
        // 点击事件绑定
        option.addEventListener('click', handleSelection);

        // 键盘事件绑定：Enter 键选择当前选项
        option.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') handleSelection.call(this, event);
        });

        // 通用处理逻辑
        function handleSelection() {
            const value = this.getAttribute('data-value');
            const text = this.textContent;

            // 更新 label 的文本和数据值
            labelElement.textContent = text;
            labelElement.setAttribute('data-value', value);

            // 调用更新回调
            if (onOptionSelected) onOptionSelected();
            queryElement.focus();
        }
    });
}

// 自定义选择框
document.addEventListener("DOMContentLoaded", function() {
    const searchLabel = document.getElementById('searchLabel');
    const searchTypeBox = document.getElementById('searchTypeBox');
    const searchQuery = document.getElementById('searchQuery');
    const searchOptions = Array.from(searchTypeBox.querySelectorAll('.search-type-option'));

    // 初始显示 "单曲" 作为默认选项
    searchLabel.textContent = '单曲';
    searchLabel.setAttribute('data-value', '1');  // 设置默认的 data-value 值为 1 (单曲)

    // 点击触发模拟 label 行为，切换下拉框显示状态
    searchLabel.addEventListener('click', function() {
        const rect = searchLabel.getBoundingClientRect(); // 获取选择框的位置
        const pageXOffset = window.scrollX || document.documentElement.scrollLeft;

        // 切换 .show 类以控制显示或隐藏
        if (searchTypeBox.classList.contains('show')) {
            // 如果已经显示，则隐藏下拉框并恢复箭头
            searchTypeBox.classList.remove('show');  // 移除 .show 类，触发隐藏动画
            searchLabel.classList.remove('open');  // 恢复箭头方向（向下）
        } else {
            // 如果没有显示，则显示下拉框并旋转箭头
            searchTypeBox.style.left = `${rect.left + pageXOffset}px`;  // 设置下拉框的位置
            searchTypeBox.classList.add('show');  // 添加 .show 类，触发显示动画
            searchLabel.classList.add('open');  // 旋转箭头
            searchOptions[0].classList.add('selected'); // 添加选中样式
        }
    });

    // 使用通用绑定函数处理下拉框选项点击
    bindDropdownOptions('.search-type-option', searchLabel, searchQuery, function() {

            // 隐藏下拉框
            searchTypeBox.classList.remove('show');  // 移除 .show 类，触发隐藏动画
            searchLabel.classList.remove('open');  // 恢复箭头方向（向下）
    });

    // 点击输入框或外部区域时关闭下拉框
    document.addEventListener('click', function(event) {
        // 如果点击的是下拉框或选择框，忽略
        if (!searchTypeBox.contains(event.target) && !searchLabel.contains(event.target)) {
            searchTypeBox.classList.remove('show');  // 移除 .show 类，触发隐藏动画
            searchLabel.classList.remove('open');  // 恢复箭头方向
        }
    });

    // 监听窗口缩放，动态调整下拉框的位置
    window.addEventListener('resize', function() {
        // 如果下拉框已经显示，重新计算位置
        if (searchTypeBox.classList.contains('show')) {
            const rect = searchLabel.getBoundingClientRect();
            const pageXOffset = window.scrollX || document.documentElement.scrollLeft;

            // 重新计算并设置下拉框的左侧位置
            searchTypeBox.style.left = `${rect.left + pageXOffset}px`;
        }
    });

    // 键盘支持逻辑
    searchLabel.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const isOpen = searchTypeBox.classList.contains('show');
            if (isOpen) {
                // 获取当前选中的值
                const selectedOption = Array.from(searchOptions).find(opt => opt.classList.contains('selected'));
                if (selectedOption) {
                    selectedOption.focus(); // 聚焦到已选中的选项
                }
            } else {
                searchLabel.click(); // 模拟点击行为打开下拉框
            }
        } 
    });
    
    // 选项键盘导航逻辑
    searchOptions.forEach((option, index) => {
        option.setAttribute('tabindex', '-1'); // 禁止选项被默认聚焦，确保焦点控制完全由代码管理
    
        option.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown') {
                event.preventDefault(); // 阻止页面滚动
                const nextOption = searchOptions[index + 1] || searchOptions[0];
                searchOptions.forEach(opt => opt.classList.remove('selected')); // 移除其他选项的选中样式
                nextOption.focus(); // 聚焦到下一个选项
                nextOption.classList.add('selected'); // 添加选中样式
            } else if (event.key === 'ArrowUp') {
                event.preventDefault(); // 阻止页面滚动
                const prevOption = searchOptions[index - 1] || searchOptions[searchOptions.length - 1];
                searchOptions.forEach(opt => opt.classList.remove('selected')); // 移除其他选项的选中样式
                prevOption.focus(); // 聚焦到上一个选项
                prevOption.classList.add('selected'); // 添加选中样式
            } else if (event.key === 'Enter') {
                event.preventDefault();
                searchLabel.textContent = option.textContent;
                searchLabel.setAttribute('data-value', option.getAttribute('data-value'));
                searchTypeBox.classList.remove('show');
                searchLabel.classList.remove('open');
                searchQuery.focus(); // 聚焦到搜索输入框
            } else if (event.key === 'Escape' || event.key === 'Tab') {
                searchTypeBox.classList.remove('show');
                searchLabel.classList.remove('open');
                searchLabel.focus(); // 返回到搜索框
            }
        });
    });
    
    // 打开下拉框时确保正确的选中和聚焦项
    searchLabel.addEventListener('click', function() {
        const isOpen = searchTypeBox.classList.contains('show');
        if (isOpen) {
            searchOptions.forEach(opt => opt.classList.remove('selected')); // 清除所有选中样式
            const currentValue = searchLabel.getAttribute('data-value'); // 获取当前选中值
            const selectedOption = Array.from(searchOptions).find(opt => opt.getAttribute('data-value') === currentValue);
            if (selectedOption) {
                selectedOption.classList.add('selected'); // 重新标记为选中
                selectedOption.focus(); // 确保焦点同步到选中项
            }
        }
    });

    // 动画结束时清理视觉效果
    searchTypeBox.addEventListener('transitionend', function() {
        if (!searchTypeBox.classList.contains('show')) {
            searchOptions.forEach(opt => opt.classList.remove('selected')); // 确保关闭后没有多余样式
        }
    });
});

// 清空按钮功能通用函数
function initClearButton(inputElementId, linkElementId, createLink) {
    const inputElement = document.getElementById(inputElementId);   // 获取输入框
    const linkElement = document.getElementById(linkElementId);      // 获取链接
    const searchLabel = document.getElementById('searchLabel');      // 获取搜索类型的 label 元素

    let inputWrapper = inputElement.parentNode;  // 获取输入框的父容器

    // 如果没有父容器则动态创建一个 wrapper 包裹 input 和 clear-button
    if (!inputWrapper.classList.contains('input-wrapper')) {
        inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');
        inputElement.parentNode.insertBefore(inputWrapper, inputElement);
        inputWrapper.appendChild(inputElement);
    }

    // 如果没有清空按钮，就动态创建它
    let clearButton = inputWrapper.querySelector('.clear-button');
    if (!clearButton) {
        clearButton = document.createElement('span');
        clearButton.classList.add('clear-button');
        clearButton.textContent = '✕';
        inputWrapper.appendChild(clearButton); // 将清空按钮插入到输入框旁边
    }

    // 更新清空按钮的显示状态和链接
    function updateClearButton() {
        const userInput = inputElement.value.trim();  // 判断输入框是否有内容
        clearButton.style.display = userInput ? 'block' : 'none';  // 显示或隐藏清空按钮

        // 获取附加参数 (基于 searchLabel 的 data-value)
        const additionalParams = `&type=${searchLabel.getAttribute('data-value')}`;

        // 如果有值，更新链接
        if (userInput) {
            createLink(inputElement, linkElement, additionalParams);  // 更新链接
            linkElement.target = "_blank";  // 确保在点击时打开新标签
        } else {
            linkElement.href = 'javascript:void(0);'; // 输入框为空时，设置无效链接，防止跳转
            linkElement.target = '_self'; // 设置 target 为 _self，避免新标签页打开
        }
    }

    // 监听输入框内容变化
    inputElement.addEventListener('input', updateClearButton);

    // 监听类型选择框（search-type-option）的点击，切换时更新链接
    bindDropdownOptions('.search-type-option', searchLabel, inputElement, updateClearButton);

    // 点击清空按钮时清空输入框内容
    clearButton.addEventListener('click', function() {
        inputElement.value = '';  // 清空输入框内容
        updateClearButton();  // 更新清空按钮的显示状态和链接
        inputElement.focus();  // 聚焦到输入框
    });

    // 失去焦点时检查输入框内容并更新链接
    inputElement.addEventListener('blur', updateClearButton);

    // 初始化时，更新清空按钮的显示状态和链接
    updateClearButton();
}

// 任务配置，存储任务 ID 和类型
const tasks = [
    { id: "6504450", type: "yfc" },
    { id: "6505450", type: "yfc2" },
    { id: "6570457", type: "eygmfy" },
    { id: "6591454", type: "rygmfy" },
    { id: "6590454", type: "hygmfy" },
    { id: "6568458", type: "ynygmfy" },
    { id: "6567458", type: "tygmfy" },
    { id: "6569456", type: "zygmfy" }
];

// 基础任务链接
const baseTaskWebURL = "https://music.163.com/#/wiki/task-center/m/st/wiki/task-center/song/list?missionId=";
const baseTaskMobileURL = "orpheus://activity?url=https%3A%2F%2Fmusic.163.com%2Fst%2Fmusicwiki%2Ftask-detail%3FmissionId%3D";

// 任务链接创建
function createTaskLink(taskID, taskWebLinks, taskMobileLinks) {

    // 生成链接
    const taskWebURL = baseTaskWebURL + encodeURIComponent(taskID);
    const taskMobileURL = baseTaskMobileURL + encodeURIComponent(taskID);

    // 修改网页端链接
    taskWebLinks.forEach(link => {
        link.href = taskWebURL;
    });

    // 修改移动端链接
    taskMobileLinks.forEach(link => {
        link.href = taskMobileURL;
    });
}

// 任务初始化绑定
document.addEventListener("DOMContentLoaded", function() {
    // 创建缓存对象
    const taskLinkMap = {};

    // 一次性生成对应的链接类名并查询所有任务链接
    tasks.forEach(task => {
        const taskWebLinkClass = `.${task.type}TaskWebLink`; // 网页端任务链接的类名
        const taskMobileLinkClass = `.${task.type}TaskMobileLink`; // 移动端任务链接的类名

        // 查询并缓存对应类型的链接
        const taskWebLinks = Array.from(document.querySelectorAll(taskWebLinkClass));
        const taskMobileLinks = Array.from(document.querySelectorAll(taskMobileLinkClass));

        taskLinkMap[task.type] = { taskWebLinks, taskMobileLinks };
    });

    // 创建对应任务类型的链接
    tasks.forEach(task => {
        const { taskWebLinks, taskMobileLinks } = taskLinkMap[task.type];
        createTaskLink(task.id, taskWebLinks, taskMobileLinks);
    });
});

// 监听滚动事件以显示或隐藏回到顶部容器
window.onscroll = function() {
    if (window.scrollY > 100) {
        document.querySelector(".back-to-top").classList.add("show"); // 添加显示按钮的类
    } else {
        document.querySelector(".back-to-top").classList.remove("show"); // 移除显示按钮的类
    }
};

// 点击回到顶部按钮执行函数
function scrollToTop() {
    window.scrollTo({
        top: 0,
    });
}

// 监听触摸事件，点击页面其他地方时移除所有 hover 效果
document.addEventListener('touchend', function() {
    document.querySelectorAll('.hover').forEach(el => el.classList.remove('hover'));
});

// 导航栏跳转修正
window.onload = function() {
    // 获取导航栏和菜单及公告和搜索框的高度
    var elements = document.querySelectorAll('.nav, .menu, .search, .top-notice');
    // 计算修正值
    var correction = 0;
    elements.forEach(function(element) {
        correction += element.offsetHeight;
    });

    // 获取所有导航链接和容器元素
    var navLinks = document.querySelectorAll('.nav .link');
    var sections = document.querySelectorAll('.container-header');
    var sectionIds = Array.from(sections).map(function(section) {
        return section.id;
    });

    // 处理跳转事件
    function scrollToElement(elementId) {
        // 获取目标元素的位置
        var element = document.getElementById(elementId);
        if (element) {
            var elementPosition = element.offsetTop - correction;

            // 滚动到目标位置
            window.scrollTo({
                top: elementPosition,
            });
        }
    }

    // 激活对应的导航链接
    function activateNavLink(targetId) {
        navLinks.forEach(function(navLink) {
            if (navLink.getAttribute('href') === '#' + targetId) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    }

    // 检查 URL 中是否包含 hash，并滚动到相应位置
    var hash = window.location.hash;
    if (hash) {
        var targetId = hash.slice(1); // 获取目标元素ID
        scrollToElement(targetId); // 执行滚动（如果需要）
        activateNavLink(targetId); // 激活对应的导航链接
    } else if (window.scrollY === 0) {
        // 如果没有 hash 且滚动位置为 0，激活第一个导航链接
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }

    // 找到所有的跳转链接并添加点击事件监听器
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认的点击事件
            var targetId = this.getAttribute('href').slice(1); // 获取目标元素的ID
            scrollToElement(targetId); // 调用滚动函数
            history.pushState(null, null, '#' + targetId); // 更新URL
        });
    });

    // 监听滚动事件，根据滚动位置更新URL并激活相应的导航链接
    window.addEventListener('scroll', function() {
        var scrollPosition = window.scrollY + correction;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionTop = section.offsetTop;
            var sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                var sectionId = sectionIds[i];
                if (window.location.hash !== '#' + sectionId) {
                    history.replaceState(null, null, '#' + sectionId);
                }
                activateNavLink(sectionId); // 激活相应的导航链接
                break;
            }
        }
    });
};

// 加载审核进度数据
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面中的元素
    const jsonList = document.getElementById('audit-status');
    const loadingMessage = document.getElementById('loading-message');

    // 检查元素是否成功获取
    if (jsonList && loadingMessage) {
        // 显示加载中的消息
        loadingMessage.textContent = '审核进度加载中...';

        // 异步加载JSON文件
        fetch('/json/audit-status.json')
            .then(response => {
                // 检查网络响应是否正常
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }
                return response.json(); // 返回JSON数据的解析结果
            })
            .then(data => {
                // 处理获取的JSON数据
                const currentDate = new Date(data.last_updated); // 当前日期

                // 遍历每个类别的日期，计算日期差异并设置颜色类名
                const categoriesList = data.categories.map(item => {
                    const itemDate = new Date(item.date); // 类别的日期
                    const diffTime = currentDate.getTime() - itemDate.getTime(); // 毫秒差异
                    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // 转换为天数

                    // 根据日期差异设置不同的颜色类名
                    const colorClass =
                        diffDays < 7 ? 'green' :
                        diffDays >= 15 ? 'red' :
                        'yellow';

                    // 构造列表项的 HTML
                    return `<li class="status-item ${colorClass}">${item.category} : ${item.date}</li>`;
                }).join('');

                // 构造完整的内容
                const content = `
                    <span class="status-title">百科审核进度 更新时间 : ${formatDate(data.last_updated)}</span>
                    <ul class="status-list">${categoriesList}</ul>
                `;

                // 将内容填充到页面中的容器中
                jsonList.innerHTML = content;

                // 隐藏加载中的消息
                loadingMessage.style.display = 'none';
            })
            .catch(error => {
                // 捕获并处理任何错误
                console.error('获取JSON数据时出错:', error);
                // 在加载消息中显示错误信息
                loadingMessage.textContent = '加载审核数据出错';
            });
    } else {
        console.error('未找到元素'); // 元素未找到的错误处理
    }

    // 格式化日期函数
    function formatDate(dateString) {
        const date = new Date(dateString);

        // 获取各个部分
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // 返回格式化后的字符串
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
});

// 版权所有年份自动更新
document.addEventListener("DOMContentLoaded", () => {
    const copyYear = new Date().getFullYear(); // 当前年份
    const yearElement = document.getElementById("copy-year"); // 获取 id=copy-year 的元素
    if (yearElement) {
        yearElement.textContent = copyYear; // 更新内容
    } else {
        console.error("元素 #copy-year 不存在！");
    }
});