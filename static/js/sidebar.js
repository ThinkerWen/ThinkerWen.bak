// 加载JSON文件的函数
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/static/file/contents.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

function findKeyWithValue(obj, targetValue, keys = []) {
    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            obj.forEach(item => findKeyWithValue(item, targetValue, keys));
        } else {
            for (let key in obj) {
                if (typeof obj[key] === 'object') {
                    findKeyWithValue(obj[key], targetValue, keys);
                } else if (typeof obj[key] === 'string' && obj[key].split('id=') == targetValue) {
                    keys.push(key);
                }
            }
        }
    }
    return keys;
}

// 生成单个菜单项的HTML内容
function generateMenuItem(item) {
    var menuItem = '';
    var keys = Object.keys(item).filter(function (key) {
        return key !== 'isFile';
    });
    if (item.isFile) {
        keys.forEach(function (key) {
            menuItem += '<li><a href="' + item[key] + '" class="waves-effect">' + key + '</a></li>';
        });
    } else {
        keys.forEach(function (key) {
            menuItem += '<li><a href="javascript:void(0);" class="has-arrow waves-effect">' + key + '</a>';
            menuItem += '<ul class="sub-menu" style="display:none" aria-expanded="false">';
            item[key].forEach(function (subItem) {
                menuItem += generateMenuItem(subItem);
            });
        });
        menuItem += '</ul></li>';
    }
    return menuItem;
}

// 生成整个菜单的HTML内容
function generateMenu(menuData) {
    var menuHTML = '';
    for (var key in menuData) {
        menuHTML += '<li class="menu-title">' + key + '</li>';
        menuData[key].forEach(function (item) {
            menuHTML += generateMenuItem(item);
        });
    }
    return menuHTML;
}

function combineAll(list_str) {
    let initialHTML = `
    <header id="page-topbar">
    <div class="navbar-header">
        <div class="d-flex">
            <div class="navbar-brand-box">
                <a href="/index.html" class="logo logo-light">
                    <span class="logo-lg">
                        <img src="/static/picture/logo-light.png" alt="logo-light" height="20">
                    </span>
                </a>
            </div>
            <button type="button" class="btn btn-sm px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn"
                onClick="switchSideBar()">
                <i class="ri-menu-2-line align-middle"></i>
            </button>
        </div>
        <div class="d-flex">
            <div class="dropdown d-none d-sm-inline-block">
                <button type="button" class="btn header-item waves-effect">
                    <a href="https://github.com/ThinkerWen"><img class="" src="/static/picture/github-mark-white.png" alt="Github" height="20"></a>
                </button>
            </div>
        </div>
    </div>
</header>
<div class="vertical-menu">
    <div data-simplebar="" class="h-100">
        <div class="user-profile text-center mt-3">
            <div class="">
                <img src="https://avatars.githubusercontent.com/u/59362976" alt="" class="avatar-md rounded-circle">
            </div>
            <div class="mt-3">
                <h4 class="font-size-16 mb-1">Dreamer Wen</h4>
            </div>
        </div>
        <div id="sidebar-menu">
            <ul class="metismenu list-unstyled" id="side-menu">
                ${list_str}
            </ul>
        </div>
    </div>
</div>
    `;
    document.getElementById('layout-wrapper').innerHTML = initialHTML;
}

// 主函数，加载JSON并生成菜单内容
function initMenu() {
    loadJSON(function (data) {
        var verticalMenu = document.getElementsByClassName('vertical-menu');
        if (verticalMenu) {
            combineAll(generateMenu(data));
        }
    });
}

// 在页面加载完成后调用主函数
document.addEventListener('DOMContentLoaded', function () {
    initMenu();
});

// 添加事件监听器，当点击具有子菜单的菜单项时切换其展开状态
document.addEventListener('DOMContentLoaded', function () {
    var subMenus = document.querySelectorAll('.sub-menu');

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (target.tagName === 'A' && target.nextElementSibling && target.nextElementSibling.classList.contains('sub-menu')) {
            var subMenu = target.nextElementSibling;
            toggleDisplay(subMenu);
        }
    });

    function toggleDisplay(element) {
        var currentDisplay = window.getComputedStyle(element).getPropertyValue('display');
        element.style.display = currentDisplay === 'block' ? 'none' : 'block';
    }
});
