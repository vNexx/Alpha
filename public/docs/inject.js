(function() {
    function receiveMessage(event) {
        var e = JSON.parse(event.data);

        if (e.type === 'get-content') {
            event.source.postMessage(
                JSON.stringify({
                    head: document.getElementsByTagName('head')[0].innerHTML,
                    body: document.getElementsByTagName('body')[0].innerHTML
                }),
                '*'
            );
        }

        if (e.type === 'set-content') {
            document.getElementsByTagName('head')[0].innerHTML = e.head;
            document.getElementsByTagName('body')[0].innerHTML = e.body;
        }
    }

    window.addEventListener('message', receiveMessage, false);
} ());
