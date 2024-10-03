// 编辑页面直达
function createLink(baseURL, inputElementId, linkElementId) {
    var userInput = document.getElementById(inputElementId).value;
    var fullURL = baseURL + encodeURIComponent(userInput);
    document.getElementById(linkElementId).href = fullURL;
}

// 回车进入编辑页
function bindEnterKey(inputElementId, linkElementId, createFunction) {
    document.getElementById(inputElementId).addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // 阻止默认的回车键行为
            createFunction();
            document.getElementById(linkElementId).target = "_blank"; // 设置链接的 target 属性为 _blank，使其在新标签页中打开
            document.getElementById(linkElementId).click(); // 模拟点击链接
        }
    });
}

// 初始化绑定
document.addEventListener("DOMContentLoaded", function() {
    bindEnterKey("songUserInput", "songLink", createSongLink);
    bindEnterKey("albumUserInput", "albumLink", createAlbumLink);
    bindEnterKey("artistUserInput", "artistLink", createArtistLink);
    bindEnterKey("addAlbumUserInput", "addAlbumLink", createAddAlbumLink);
    bindEnterKey("artistRepeatUserInput", "artistRepeatLink", createArtistRepeatLink);
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

// 任务配置，存储任务 ID 和类型
const tasks = [
    { id: "6504450", type: "yfc" },
    { id: "6505450", type: "yfc2" },
    { id: "6554452", type: "eygmfy" },
    { id: "6539455", type: "rygmfy" },
    { id: "6527461", type: "hygmfy" },
    { id: "6553451", type: "ynygmfy" },
    { id: "6558451", type: "tygmfy" },
    { id: "6536459", type: "zygmfy" }
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

// 导航栏跳转修正
window.onload = function() {
    // 获取导航栏和菜单及公告的高度
    var navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
    var menuHeight = document.querySelector('.menu') ? document.querySelector('.menu').offsetHeight : 0;
    var topNoticeHeight = document.querySelector('.top-notice') ? document.querySelector('.top-notice').offsetHeight : 0;
    // 计算修正值
    var correction = navHeight + menuHeight + topNoticeHeight;

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

    // 检查 URL 中是否包含 hash，并滚动到相应位置
    var hash = window.location.hash;
    if (hash) {
        var targetId = hash.slice(1);
        scrollToElement(targetId);
    }

    // 找到所有的跳转链接并添加点击事件监听器
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认的点击事件
            var targetId = this.getAttribute('href').slice(1); // 获取目标元素的ID
            scrollToElement(targetId); // 调用滚动函数

            // 更新URL
            history.pushState(null, null, '#' + targetId);
        });
    });

    // 监听滚动事件，根据滚动位置更新URL并激活相应的导航链接
    var sections = document.querySelectorAll('.container-header');
    var sectionIds = Array.from(sections).map(function(section) {
        return section.id;
    });

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

                // 激活相应的导航链接
                var navLinks = document.querySelectorAll('.nav .link');
                navLinks.forEach(function(navLink) {
                    if (navLink.getAttribute('href') === '#' + sectionId) {
                        navLink.classList.add('active');
                    } else {
                        navLink.classList.remove('active');
                    }
                });

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