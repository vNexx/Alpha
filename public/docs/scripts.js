(function() {
    var smallMenu;

    window.changeScreen = function (url, path) {
        var hash = url;

        if (!url) {
            url = 'index-content';
            hash = '';
        }

        document.querySelector('#iframe').src = (path || '') + url + '.html';
        window.location.hash = hash;

        if (smallMenu) {
            smallMenu.setAttribute('value', '["' + hash + '"]');
        }
    }

    window.openBar = function () {
        document.body.classList.remove('bar-hidden');
        window.localStorage.removeItem('bar-hidden');
    };

    window.closeBar = function () {
        document.body.classList.add('bar-hidden');
        window.localStorage.setItem('bar-hidden', 1);
    };

    window.codeAtSidebar = false;

    window.moveCodeToExample = function () {
        document.body.classList.remove('code-sidebar');
        window.localStorage.removeItem('code-sidebar');
        window.codeAtSidebar = false;
    };

    window.moveCodeToBar = function () {
        document.body.classList.add('code-sidebar');
        window.localStorage.setItem('code-sidebar', 1);
        window.codeAtSidebar = true;
    };

    document.addEventListener('DOMContentLoaded', function() {
        smallMenu = document.querySelector('#small-menu');
        if (smallMenu) {
            smallMenu.addEventListener('change', function (event) {
                window.changeScreen(event.detail[0])
            });
        }

        var hash = window.location.hash.substring(1);
        if (hash) {
            window.changeScreen(hash);
        }

        if (window.localStorage.getItem('bar-hidden')) {
            window.closeBar();
        }

        if (window.localStorage.getItem('code-sidebar')) {
            window.moveCodeToBar();
            var codePlaceSelect = document.querySelector('#code-place-select');
            if (codePlaceSelect) {
                codePlaceSelect.value = [ 'bar' ];
            }
        }
    });
} ());
