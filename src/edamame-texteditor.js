define(function(){

    'use strict';

    var Actions = {
        heading1: ['formatblock', '<h1>'],
        heading2: ['formatblock', '<h2>'],
        heading3: ['formatblock', '<h3>'],
        heading4: ['formatblock', '<h4>'],
        heading5: ['formatblock', '<h5>'],
        heading6: ['formatblock', '<h6>'],
        paragraph: ['formatblock', '<p>'],
        bold: 'bold',
        italic: 'italic',
        orderedlist: 'insertorderedlist',
        unorderedlist: 'insertunorderedlist',
        undo: 'undo',
        redo: 'redo',
        link: function(){
            var url = prompt('Please enter a URL to link to');
            this.action(['createlink', url]);
        },
        viewsource: function(){
            this.toggle();
        }
    };

    return function TextEditor(textarea, options){

        var self = this;

        this.textarea = textarea;
        this.iframe = document.createElement('iframe');
        this.wysiwygview = true;


        var createIframe = function(){
            this.textarea.parentNode.insertBefore(this.iframe, this.textarea.nextSibling);
            this.textarea.style.display = 'none';
            
            this.iframe.frameBorder = 0;
            this.iframe.src = '#';
            this.iframe.onload = function(){
                self.win = self.iframe.contentWindow;
                self.doc = self.win.document;
                self.doc.body.innerHTML = self.textarea.value;
                self.doc.body.contentEditable = true;
                self.doc.addEventListener('keypress', self.listener.bind(self), true);
            }
        };


        var createToolbar = function(){
            for (var i = 0, l = options.buttons.length; i < l; i++){
                options.buttons[i].addEventListener('click', function(evt){
                    evt.preventDefault();
                    var action = Actions[this.getAttribute('data-action')];

                    (typeof action === 'function') ? action.call(self) : self.action(action);
                });
            }
        };


        this.listener = function(evt){
            if(evt.shiftKey && evt.keyCode == 13){
                evt.preventDefault();
                this.action(0, '<br />\n');
            }
        };


        this.focus = function(){
            (this.wysiwygview ?  this.iframe.contentWindow : this.textarea).focus();
        };


        this.action = function(cmd, html){
            if(typeof cmd == 'string')
                cmd = [cmd];

            if (this.wysiwygview){
                this.doc.execCommand(cmd[0], false, cmd[1]); 
            } else if(html){
                var start = this.textarea.selectionStart,
                    end = this.textarea.selectionEnd,
                    val = this.textarea.value,
                    applyToSelection = function(html, selection){
                        return html.replace('$', (selection || '')).replace(/#/g, '\n');
                    };

                    this.textarea.value = val.substring(0, start)
                                          + applyToSelection(html, val.substring(start, end))
                                          + val.substring(end, val.length);
            }
            this.focus();
        };


        this.toggle = function(){
            this.wysiwygview = !!this.textarea.offsetHeight * 1;
            
            this.wysiwygview ?
                this.doc.body.innerHTML = this.textarea.value :
                this.textarea.value = this.doc.body.innerHTML;

            var el = ['textarea', 'iframe'];
            this[el[this.wysiwygview]].style.display = null;
            this[el[!this.wysiwygview * 1]].style.display = 'none';
        };


        createIframe.call(this);
        createToolbar.call(this);
    };

});