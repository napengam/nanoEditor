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
 * Copyright (C) 2013 Heinrich Schweitzer http://hgsweb.de/
 * 
 */
function createEditor() {
    'use strict';
    ////////////////////////////////////////////////////
    var
            div, docx, d, t, iframe, uidiv, i, n, item,
            storedSelections, innerHTML, dd,
            xstart, ystart, fheight, configMenu,
            fwidth, fheightStart, fwidthStart, saveCallback, closeCallback;
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
    div.id = t + 'Div';
    uidiv = div;
    div.innerHTML = "<table> <tr id=" + t + "saveselect class=menuRow>" +
            "<td  id=" + t + "save><img src='../icons/save_on.gif' alt=save title='save&close'></td>\n\
                <td id=" + t + "-bold > <img src='../icons/bold_on.gif' alt='bold' title='Bold'></td>" +
            "<td id=" + t + "-italic><img src='../icons/italics_on.gif' alt='italics' title='Italics'></td> " +
            "<td id=" + t + "-underline><img src='../icons/underline_on.gif' alt='underline' title='underline'></td> " +
            " <td><select id=" + t + "Font name=sel size=1  tabindex=-1>\n\
                      <option > </option> \n\
                      <option value=Courier selected>Courier</option> \n\
                      <option value=Arial>Arial</option> \n\
                      <option value=Helvetica >Helvetica</option> \n\
                      <option value=Times >Times</option> \n\
                       </select>  \n\</td> \n\
                 <td> <select id=" + t + "Size name=sel size=1 tabindex=-1>\n\
                       <option > </option> \n\
                      <option value=1>1</option> \n\
                      <option value=2>2</option> \n\
                      <option value=3 selected>3</option> \n\
                      <option value=4>4</option> \n\
                      <option value=5>5</option> \n\
                      <option value=6>6</option> \n\
                      <option value=7>7</option> \n\
                       </select>  \n\
                        </td>\n\
                        <td>\n\
                            <span id=" + t + "-black style='background:black'>&nbsp;&nbsp;&nbsp;</span>\n\
                            <span id=" + t + "-red  style='background:red'>&nbsp;&nbsp;&nbsp;</span>\n\
                            <span id=" + t + "-green style='background:green'>&nbsp;&nbsp;&nbsp;</span>\n\
                            <span id=" + t + "-blue style='background:blue'>&nbsp;&nbsp;&nbsp;</span></td>" +
            "<td  id=" + t + "-undo ><img src='../icons/undo_on.gif' alt=undo title='undo'></td>" +
            "<td  id=" + t + "close style='color:red;font-weight:bold;'><img src='../icons/close.jpg' alt=close title='close'></td>" +
            "</tr>\n\
                <tr><td colspan = '9'> <iframe id =" + t + "nanoContent src = '' > </iframe></td></tr> \n\
            <tr><td colspan=9><img id=" + t + "dragMe style=\"float:right\" src=\"../icons/resize.gif\"></td></tr></table>";


    n = configMenu.length;
    t = t.toString();
    for (i = 0; i < n; i++) {
        item = configMenu[i];
        addEvent(document.getElementById(t + item.label), item.event, item.action);

    }
    function addEvent(obj, ev, fu) {
        if (obj.addEventListener) {
            obj.addEventListener(ev, fu, false);
        } else {
            var eev = 'on' + ev;
            obj.attachEvent(eev, fu);
        }
    }

    function _dragLimit(e) {
        if (fwidth + (e.screenX - xstart) >= fwidthStart) {
            iframe.style.width = fwidth + (e.screenX - xstart) + 'px';
        } else {
            iframe.style.width = fwidth + 'px';
        }
        if (fheight + (e.screenY - ystart) >= fheightStart) {
            iframe.style.height = fheight + (e.screenY - ystart) + 'px';
        } else {
            iframe.style.height = fheight + 'px';
        }
    }
    ;
    dd = document.getElementById(t + 'dragMe');
    dd.ondragstart = function(e) {
        fheight = parseInt(iframe.clientHeight);
        fwidth = parseInt(iframe.clientWidth);
        xstart = e.screenX;
        ystart = e.screenY;
        if (this.style.position !== 'relative') {
            this.style.position = 'relative';
        }
    };
    dd.ondragend = function(e) {
        _dragLimit(e);
    };
    dd.ondrag = function(e) {
        _dragLimit(e);
    };

    iframe = document.getElementById(t + 'nanoContent');

    fheightStart = parseInt(iframe.clientHeight);
    fwidthStart = parseInt(iframe.clientWidth);

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
        var innerHTML = iframe.contentDocument.body.innerHTML;
        var node = uidiv.parentNode;
        uidiv.style.display = 'none';
        document.body.appendChild(uidiv);
        node.innerHTML = '';
        node.innerHTML = innerHTML;
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
        if (iframe.contentDocument.getSelection) {  // all browsers, except IE before version 9
            var selection = iframe.contentDocument.getSelection();
            if (selection.rangeCount > 0) {
                storedSelections = selection.getRangeAt(0);
            }
        } else if (iframe.contentDocument.selection) {   // Internet Explorer
            var range = iframe.contentDocument.selection.createRange();
            storedSelections = range.getBookmark();
        }
    }
    function restoreSelection() {
        if (iframe.contentDocument.getSelection) {  // all browsers, except IE before version 9
            iframe.contentDocument.getSelection().removeAllRanges();
            iframe.contentDocument.getSelection().addRange(storedSelections);
        } else if (iframe.contentDocument.body.createTextRange) {    // Internet Explorer
            var rangeObj = iframe.contentDocument.body.createTextRange();
            rangeObj.moveToBookmark(storedSelections);
            rangeObj.select();
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
        docx.body.ondrop = function(e) {
            e.preventDefault();
            return false;
        };
        docx.contentEditable = true;
        uidiv.style.display = '';
        docx.body.focus();
    }
    function attacheEditor(obj) {
        var val;       
        closeEditor();
        val = obj.innerHTML;
        innerHTML = val;
        obj.innerHTML = '';
        obj.appendChild(uidiv);
        setContent(val);
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
        saveCallback:onSaveCallback,
        closeCallback:onCloseCallback
    };
}