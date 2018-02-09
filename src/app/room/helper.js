function Helper() {
    this.handlers = [];  // observers
}
 
Helper.prototype = { 
    subscribe: function(fn) {
        this.handlers.push(fn);
    }, 
    unsubscribe: function(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },
    unsubscribeAll: function() {
        this.handlers = [];
    }, 
    fire: function(o, thisObj) {
        var scope = thisObj || window;
        this.handlers.forEach(function(item) {
            item.call(scope, o);
        });
    }
}

var helper = new Helper();

var eventListener = function() {
    let text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    helper.fire(text);
};

var addListener = function() {
    document.addEventListener('copy', eventListener);
};

var removeListener = function() {
    document.removeEventListener('copy', eventListener);
};

module.exports = {helper: helper, addListener: addListener, removeListener: removeListener};
