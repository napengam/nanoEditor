/*!
 * nanoEditor.js
 * http://hgsweb.de/
 * MIT licensed
 *
 * based on work done in 
 * 
 * openwysiwyg at  http://openwebware.com/ 
 * TyniEditor  at http://www.scriptiny.com/2010/02/javascript-wysiwyg-editor/
 * and documentation found at http://help.dottoro.com/larpvnhw.php
 * 
 * Copyright (C) 2013-2017  Heinrich Schweitzer http://hgsweb.de/
 * 
 */
function createEditor() {
    'use strict';
    ////////////////////////////////////////////////////
    var
            div, docx, d, t, iframe, uidiv, i, n, item,
            storedSelections, innerHTML, configMenu = [],
            saveCallback, closeCallback;
    ///////////////////////////////////////////////////

    d = new Date();
    t = d.getTime();// used to make ids  somehow 'unique' 
    div = document.createElement('DIV');

    configMenu = [
        {'label': 'saveselect', 'event': 'mouseover', 'action': saveSelection},
        {'label': '-bold', 'event': 'click', 'action': editCommand},
        {'label': '-italic', 'event': 'click', 'action': editCommand},
        {'label': '-underline', 'event': 'click', 'action': editCommand},
        {'label': '-undo', 'event': 'click', 'action': editCommand},
        {'label': 'save', 'event': 'click', 'action': saveContent},
        {'label': '-black', 'event': 'click', 'action': foreColor},
        {'label': '-red', 'event': 'click', 'action': foreColor},
        {'label': '-green', 'event': 'click', 'action': foreColor},
        {'label': '-blue', 'event': 'click', 'action': foreColor},
        {'label': 'close', 'event': 'click', 'action': closeEditor},
        {'label': 'Size', 'event': 'change', 'action': fontSize},
        {'label': 'Font', 'event': 'change', 'action': fontName}
    ];


    document.body.appendChild(div);
    div.style.border = '1px solid blue';
    div.style.background = 'white';
    div.id = t + 'Div';
    uidiv = div;
    div.innerHTML = ["<table style='width:100%'> <tr  style='text-align:center;'  id=", t, "saveselect class=menuRow>",
        "<td  id=", t, "save><i class='fa fa-floppy-o' title='save&close'></td>",
        "<td id=", t, "-bold ><i class='fa fa-bold'  title='Bold'></td>",
        "<td id=", t, "-italic><i class='fa fa-italic ' title='Italics'></td> ",
        "<td id=", t, "-underline><i class='fa fa_underline' title='underline'></td>",
        "<td><select id=", t, "Font name=sel size=1  tabindex=-1>",
        "<option ></option> ",
        "<option value=Courier selected>Courier</option> ",
        "<option value=Arial>Arial</option> ",
        "<option value=Helvetica >Helvetica</option> ",
        "<option value=Times >Times</option> ",
        "</select> </td> ",
        "<td><select id=", t, "Size name=sel size=1 tabindex=-1>",
        "<option ></option> ",
        "<option value=1>1</option> ",
        "<option value=2>2</option> ",
        "<option value=3 selected>3</option> ",
        "<option value=4>4</option> ",
        "<option value=5>5</option> ",
        "<option value=6>6</option> ",
        "<option value=7>7</option> ",
        "</select></td><td>",
        "<span id=", t, "-black style='background:black'>&nbsp;&nbsp;</span>",
        "<span id=", t, "-red  style='background:red'>&nbsp;&nbsp;</span>",
        "<span id=", t, "-green style='background:green'>&nbsp;&nbsp;</span>",
        "<span id=", t, "-blue style='background:blue'>&nbsp;&nbsp;</span></td>",
        "<td  id=", t, "-undo ><i class='fa fa-undo' title='undo'></td>",
        "<td  id=", t, "close style='color:red;font-weight:bold;'><i class='fa fa-times' title='close'></td>",
        "</tr>",
        "<tr><td colspan = '9'><iframe style='width:100%' id =", t, "nanoContent src = '' ></iframe></td></tr> "].join('');

    n = configMenu.length;
    t = t.toString();
    for (i = 0; i < n; i++) {
        item = configMenu[i];
        document.getElementById(t + item.label).addEventListener(item.event, item.action, false);
    }
    iframe = document.getElementById(t + 'nanoContent');
    docx = iframe.contentDocument;
    docx.open();
    docx.write('');
    docx.close();
    docx.body.contentEditable = true;
    docx.contentEditable = true;

    uidiv = div;
    uidiv.style.display = 'none';
    div.onclick = stopBubble; // keep all (click-)events inside the editor 
    div.onfocus = stopBubble;
    div.onmouseover = stopBubble;


    function saveContent() {
        uidiv.parentNode.innerHTML = iframe.contentDocument.body.innerHTML;
        uidiv.style.display = 'none';
        if (typeof saveCallback === 'function') {
            saveCallback();
        }
    }
    function editCommand(e) {
        stopBubble(e);
        restoreSelection();
        iframe.contentDocument.execCommand(this.id.split('-')[1], false, null);
    }
    function foreColor(e) {
        stopBubble(e);
        restoreSelection();
        iframe.contentDocument.execCommand('foreColor', false, this.id.split('-')[1]);
    }
    function fontSize(e) {
        stopBubble(e);
        restoreSelection();
        if (this.selectedIndex >= 0) {
            iframe.contentDocument.execCommand('fontSize', false, this.options[this.selectedIndex].value);
        }
    }
    function fontName(e) {
        stopBubble(e);
        restoreSelection();
        if (this.selectedIndex >= 0) {
            iframe.contentDocument.execCommand('fontName', false, this.options[this.selectedIndex].value);
        }
    }
    function stopBubble(e) {
        if (!e) {
            e = window.event;
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    }
    function saveSelection(e) {
        stopBubble(e);
        // all browsers, except IE before version 9
        var selection = iframe.contentDocument.getSelection();
        if (selection.rangeCount > 0) {
            storedSelections = selection.getRangeAt(0);
        } else {
            storedSelections = null;
        }
    }
    function restoreSelection() {
        if (storedSelections !== null) {  // all browsers, except IE before version 9
            iframe.contentDocument.getSelection().removeAllRanges();
            iframe.contentDocument.getSelection().addRange(storedSelections);
        }
    }
    function closeEditor() {
        var node = uidiv.parentNode;
        if (uidiv.style.display !== 'none') {
            node.onchange = '';
            uidiv.style.display = 'none';
            document.body.appendChild(uidiv);
            node.innerHTML = '';
            node.innerHTML = innerHTML;
        }
        if (typeof closeCallback === 'function') {
            closeCallback();
        }
    }
    function setContent(content) {
        var docx = iframe.contentDocument;
        docx.open();
        docx.write(content);
        docx.close();
        docx.body.contentEditable = true;
        docx.body.ondrop = function (e) {
            e.preventDefault();
            return false;
        };
        docx.contentEditable = true;
        uidiv.style.display = '';
        docx.body.focus();
    }
    function attacheEditor(obj) {
        closeEditor();
        innerHTML = obj.innerHTML;
        obj.innerHTML = '';
        obj.appendChild(uidiv);
        setContent(innerHTML);
    }
    function onSaveCallback(Callback) {
        if (typeof Callback === 'function') {
            saveCallback = Callback;
        } else {
            saveCallback = '';
        }
    }
    function onCloseCallback(Callback) {
        if (typeof Callback === 'function') {
            closeCallback = Callback;
        } else {
            closeCallback = '';
        }
    }
    return {// reveal these functions to the outside
        closeEditor: closeEditor,
        attacheEditor: attacheEditor,
        saveCallback: onSaveCallback,
        closeCallback: onCloseCallback,
        onchange: closeEditor
    };
}