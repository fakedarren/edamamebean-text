require(['../../src/edamame-texteditor.min'], function(TextEditor){
    
    'use strict';

    var editor = document.querySelector('textarea');
    var buttons = document.querySelectorAll('.toolbar a');

    new TextEditor(editor, {
        buttons: buttons
    });

});