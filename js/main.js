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