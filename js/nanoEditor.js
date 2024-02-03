/* global Node */

//
// * nanoEditor.js
// * http://hgsweb.de/
// * MIT licensed
// *
// * based on work done in 
// * 
// * openwysiwyg at  http://openwebware.com/ 
// *
// *
function createEditor(config) {
    'use strict';
    var // GLOBALS within this module

            defaultOptions, docx, d, t, iframe, uidiv, self, cfg,
            thisDropZone, savedInnerHTML, context_timeout,
            configMenu = [], innerHTML, storedSelections, currentLink = '',
            saveCallback, closeCallback, theForm;
    //*
    // * do we allready exist ?
    //
    uidiv = document.querySelector('.uidivuidiv');
    if (uidiv) {
        return uidiv.aaaself;
    }
    defaultOptions = {
        'imageUploadPath': '',
        'imageUploadScript': '../php/upload_save_2.php',
        'saveAndExit': true
    };
    cfg = defaultOptions;
    if (typeof config !== 'undefined' && typeof config === 'object') {
        cfg = Object.assign(defaultOptions, config);
    }
    //********************************************
    //  create one Instance of Editor
    //*******************************************
    
    createEditUI();

    function createEditUI() {
        d = new Date();
        t = d.getTime(); // used to make ids  somehow 'unique' 

        uidiv = document.createElement('DIV');
        configMenu = [
            {'label': 'saveselect', 'event': 'mouseover', 'action': saveSelection},
            {'label': '-bold', 'event': 'click', 'action': editCommand},
            {'label': '-italic', 'event': 'click', 'action': editCommand},
            {'label': '-underline', 'event': 'click', 'action': editCommand},
            {'label': '-undo', 'event': 'click', 'action': editCommand},
            {'label': '-insertOrderedList', 'event': 'click', 'action': editCommand},
            {'label': '-insertUnorderedList', 'event': 'click', 'action': editCommand},
            {'label': '-Justifyleft', 'event': 'click', 'action': editCommand},
            {'label': '-Justifyright', 'event': 'click', 'action': editCommand},
            {'label': '-Justifyfull', 'event': 'click', 'action': editCommand},
            {'label': '-Justifycenter', 'event': 'click', 'action': editCommand},
            {'label': '-outdent', 'event': 'click', 'action': editCommand},
            {'label': '-indent', 'event': 'click', 'action': editCommand},
            {'label': '-print', 'event': 'click', 'action': editCommand},
            {'label': 'save', 'event': 'click', 'action': saveContent},
            {'label': 'Color', 'event': 'change', 'action': foreColor},
            {'label': 'close', 'event': 'click', 'action': closeEditor},
            {'label': 'Size', 'event': 'change', 'action': fontSize},
            {'label': 'Font', 'event': 'change', 'action': fontName},
            {'label': 'Image', 'event': 'click', 'action': insertImageDropZone},
            {'label': 'Link', 'event': 'click', 'action': enterEditLink},
            {'label': 'Table', 'event': 'click', 'action': enterTable},
            {'label': 'saveLink', 'event': 'click', 'action': saveLink},
            {'label': 'deleteLink', 'event': 'click', 'action': deleteLink}
        ];
        document.body.appendChild(uidiv);
        uidiv.classList.add('uidivuidiv');
        uidiv.style.border = '1px solid gray';
        uidiv.style.backgroundColor = 'white';//';rgb(249, 249, 249)';
        uidiv.style.display = 'inline-block';
        uidiv.style.width = '800px';

        uidiv.id = t + 'Div';
        uidiv.innerHTML = ["<table style='min-width:600px;border-collapse:collapse'>",
            "<tr style='border-bottom:0px solid gray' id=", t, "saveselect><td>",
            "<button id=", t, "save><i class='fa-solid fa-save' title='save&close'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-bold ><i class='fa-solid fa-bold' title='Bold'></i></button>",
            "<button id=", t, "-italic><i class='fa-solid fa-italic'  title='Italics'></i></button>",
            "<button id=", t, "-underline><i class='fa-solid fa-underline' title='underline'></i></button><i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-insertUnorderedList><i class='fa-solid fa-list-ul' title='unordered list'></i></button>",
            "<button id=", t, "-insertOrderedList><i class='fa-solid fa-list-ol' title='unordered list'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-Justifyleft><i class='fa-solid fa-align-left' title='align left'></i></button>",
            "<button id=", t, "-Justifyright><i class='fa-solid fa-align-right' title='align right'></i></button>",
            "<button id=", t, "-Justifyfull><i class='fa-solid fa-align-justify' title='align full'></i></button>",
            "<button id=", t, "-Justifycenter><i class='fa-solid fa-align-center' title='align center'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-outdent><i class='fa-solid fa-outdent' title='outdent'></i></button>",
            "<button id=", t, "-indent><i class='fa-solid fa-indent' title='indent'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-print><i class='fa-solid fa-print' title='print'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<span><select id=", t, "Font name=sel size=1  tabindex=-1 style='font-size:1em'>",
            "<option></option> ",
            "<option value=Courier selected>Courier</option> ",
            "<option value=Arial>Arial</option> ",
            "<option value=Helvetica >Helvetica</option> ",
            "<option value=Times >Times</option> ",
            "</select> </span> ",
            "<span><select id=", t, "Size name=sel size=1 tabindex=-1 style='font-size:1em'>",
            "<option ></option> ",
            "<option value=1>1</option> ",
            "<option value=2>2</option> ",
            "<option value=3 selected>3</option> ",
            "<option value=4>4</option> ",
            "<option value=5>5</option> ",
            "<option value=6>6</option> ",
            "<option value=7>7</option> ",
            "</select></span>",
            "<input id=", t, "Color type='color' value='#000000' title='Foreground' style='width:2em;margin:0;padding:0;border:0;position:relative;top:3px'>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button id=", t, "-undo ><i class='fa-solid fa-undo' title='undo'></i></button>",
            "<button id=", t, "Table ><i class='fa-solid fa-table' title='Table'></i></button>",
            "<button id=", t, "Image ><i class='fa-solid fa-image' title='Picture'></i></button>",
            "<button id=", t, "Link ><i class='fa-solid fa-link' title='Link'></i></button>",
            "<i class='fa-solid fa-square-full hidesquare'></i>",
            "<button  style=''  id=", t, "close ><i style='color:red' class='fa-solid fa-times' title='close'></i></button>",
            "</td></tr>",
            "<tr><td id='enterLink' style='visibility:hidden;text-align:center'>",
            "<input type=text placeholder='enter URL' size=80 maxlegth=265>",
            "<button id=", t, "saveLink ><i class='fa-solid fa-save' title='save Link'></i></button>",
            "<button id=", t, "deleteLink ><i class='fa-solid fa-unlink' title='delete Link'></i></button>",
            "</td></tr>",
            "<tr><td><iframe style='min-height:800px;resize:vertical;width:100%' id =", t, "nanoContent src = '' ></iframe></td></tr> ",
            "<tr><td style='border-top:1px solid black' class='formatLine'>where am I ?</td></tr>",
            "</table>"
        ].join('');
        t = t.toString();
        //********************************************
        //  instrument buttons from config with callbacks
        //*******************************************

        configMenu.forEach(function (item) {
            document.getElementById(t + item.label).addEventListener(item.event, item.action, false);
        });
        //********************************************
        //  prepare the iframe
        //*******************************************

        iframe = document.getElementById(t + 'nanoContent');
        iframe.style.border = '0px';
        docx = iframe.contentDocument;
        docx.open();
        docx.write();
        docx.close();
        docx.body.contentEditable = true;
        uidiv.style.display = 'none';

        //********************************************
        //  keep all these events inside Editor
        //*******************************************

        uidiv.onclick = stopBubble;
        uidiv.ondblclick = stopBubble;
        uidiv.onfocus = stopBubble;
        uidiv.onmouseover = stopBubble;
        uidiv.onmouseup = stopBubble;
        uidiv.keyup = stopBubble;
    }
    function attacheEditor() {
        closeEditor();
        savedInnerHTML = this.innerHTML;
        this.innerHTML = '';
        this.appendChild(uidiv);
        setContent(savedInnerHTML);
    }
    function setContent(content) {
        var dz, docx = iframe.contentDocument;
        if (content === '') {
            content = '&nbsp;';
        }
        docx.open();
        docx.write(content);
        docx.close();
        docx.body.contentEditable = true;
        docx.body.ondrop = function (e) {
            e.preventDefault();
            return false;
        };
        docx.contentEditable = true;
        uidiv.style.display = 'inline-block';
        docx.body.focus();

        //********************************************
        //  prepare any dropzones from attached content
        //*******************************************

        if (cfg.imageUploadPath) {
            dz = docx.querySelectorAll('.dropZone');
            dz.forEach((node) => {
                uploadFiles(node);
            });
        }
        dz = docx.querySelectorAll('TABLE');
        dz.forEach((node) => {
            node.oncontextmenu = contextMenu;
        });

        docx.body.onmouseup = watchEvent;
        docx.body.onkeyup = watchEvent;
        //********************************************
        //  inject styles,  fontawsome and creat context menue for tables
        //*******************************************
        //    makeStyle();
        makeScript();
        makeTableContextMenu();
    }

    function saveContent() {
        // remove context menu from iframe source
        var ctm = iframe.contentDocument.getElementById(t + 'ctm');
        if (ctm) {
            ctm.parentNode.removeChild(ctm);
        }
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

    function makeStyle() {
        var styleElem = iframe.contentDocument.createElement('STYLE');
        styleElem.innerHTML = [
            "table,  th, td{border-collapse:collapse;  border: 1px solid silver;}",
            "th, td{min-width:2em}",
            ".contextctmC {}", 
            ".contextctmC > span:hover{cursor:default}"
        ].join('');
        iframe.contentDocument.getElementsByTagName('head')[0].appendChild(styleElem);
        return styleElem;
    }
    function makeScript() {
        var elem = iframe.contentDocument.createElement('SCRIPT');
        elem.src = "https://use.fontawesome.com/ed46cb3bd2.js";
        iframe.contentDocument.getElementsByTagName('head')[0].appendChild(elem);
        return elem;
    }

    function enterTable() {
        var t;
        t = document.createElement('TABLE');
        t.innerHTML = [
            '<tr><th>head cell</th><th>head cell</th><th>head cell</th></tr>',
            '<tr><td>111</td><td>222</td><td>33</td></tr>',
            '<tr><td>4</td><td>55</td><td>666</td></tr>'
        ].join('');
        insertNodeAtSelection(t);
        t.oncontextmenu = contextMenu;
    }

    function enterEditLink() {
        var at = {}, el = uidiv.querySelector('#enterLink'), sel, range;
        sel = iframe.contentDocument.getSelection();
        range = sel.getRangeAt(0);
        if (el.style.visibility === 'visible') {
            el.style.visibility = 'hidden';
            currentLink = '';
            return;
        }
        el.firstChild.value = '';
        at = isElement('A');
        if (at.elem) {
            el.firstChild.value = at.elem.href;
            currentLink = at.elem;
        } else if (at.selType === 'None') {
            return;
        }
        el.style.visibility = 'visible';
        el.firstChild.focus();
    }

    function saveLink() {
        var a, el = uidiv.querySelector('#enterLink');

        el.style.visibility = 'hidden';
        if (currentLink) {
            currentLink.href = uidiv.querySelector('#enterLink').firstChild.value;
            currentLink = '';
        } else {
            a = document.createElement('A');
            a.href = el.firstChild.value;
            a.innerHTML = '';
            insertNodeAtSelection(a);
        }
    }
    function deleteLink() {
        var i, n, parent, el = uidiv.querySelector('#enterLink');

        el.style.visibility = 'hidden';
        if (currentLink) {
            parent = currentLink.parentNode;
            n = currentLink.childNodes.length;
            for (i = 0; i < n; i++) {
                parent.insertBefore(currentLink.childNodes[i], currentLink);
                i--;
                n--;
            }
            parent.removeChild(currentLink);
            currentLink = '';
        }
    }

    function insertImageDropZone() {
        var sel, dz, node;

        if (cfg.imageUploadPath === '') {
            return;
        }
        sel = iframe.contentDocument.getSelection();
        if (sel.type === 'None') {
            return;
        }
        node = document.createElement('span');
        node.innerHTML = "&nbsp;<i  title='Drop picture here'>DROPZONE</i>&nbsp;";
        node.className = 'dropZone';

        insertNodeAtSelection(node);
        dz = iframe.contentDocument.querySelectorAll('.dropZone');
        dz.forEach((node) => {
            uploadFiles(node);
        });
    }

    function editCommand(e) {
        var task;
        stopBubble(e);
        restoreSelection();
        task = this.id.split('-')[1];
        if (task === 'print' && typeof iframe.contentWindow.print === 'function') {
            iframe.contentWindow.print();
        } else {
            iframe.contentDocument.execCommand(task, false, null);
        }
    }
    function foreColor(e) {
        stopBubble(e);
        restoreSelection();
        iframe.contentDocument.execCommand('foreColor', false, this.value);
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
        e.stopPropagation();
    }
    function saveSelection(e) {
        stopBubble(e);
        var selection = iframe.contentDocument.getSelection();
        if (selection.rangeCount > 0) {
            storedSelections = selection.getRangeAt(0);
        }
    }
    function restoreSelection() {
        iframe.contentDocument.getSelection().removeAllRanges();
        iframe.contentDocument.getSelection().addRange(storedSelections);
    }
    function closeEditor() {
        var node = uidiv.parentNode;
        if (uidiv.style.display !== 'none') {
            node.onchange = '';
            uidiv.style.display = 'none';
            document.body.appendChild(uidiv);
            node.innerHTML = '';
            node.innerHTML = savedInnerHTML;
        }
        if (typeof closeCallback === 'function') {
            closeCallback();
        }
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
    function insertNodeAtSelection(insertNode) {

        var sel, range, startContainer, df, pos, textBefore, textAfter,
                afterNode, beforeNode, textNode, text;
        sel = iframe.contentDocument.getSelection();
        if (sel.anchorNode === null) {
            restoreSelection();
            sel = iframe.contentDocument.getSelection();
        }
        range = sel.getRangeAt(0);
        startContainer = range.startContainer;
        pos = range.startOffset;
        if (insertNode.tagName !== 'TABLE') {
            df = range.extractContents();
            insertNode.appendChild(df);
        }
        if (startContainer.nodeType === 3) {
            textNode = startContainer;
            text = startContainer.nodeValue;
            startContainer = textNode.parentNode;

            textBefore = text.substr(0, pos);
            textAfter = text.substr(pos);
            beforeNode = document.createTextNode(textBefore);
            afterNode = document.createTextNode(textAfter);
            startContainer.insertBefore(afterNode, textNode);
            startContainer.insertBefore(insertNode, afterNode);

            startContainer.insertBefore(beforeNode, insertNode);
            startContainer.removeChild(textNode);
        } else {
            afterNode = startContainer.childNodes[pos];
            startContainer.insertBefore(insertNode, afterNode);

        }

        return insertNode;
    }
    function whereAmI() {
        var start, sel, range, path = [];
        sel = iframe.contentDocument.getSelection();
        range = sel.getRangeAt(0);
        start = range.startContainer;
        do {
            if (typeof start.tagName !== 'undefined') {
                path.push(start.tagName);
            }
            start = start.parentNode;
        } while (start !== null && start.tagName !== 'BODY');
        path.push('BODY');
        uidiv.querySelector('.formatLine').innerHTML = path.reverse().join('>');
    }
    function isElement(tagName) {
        var start, sel, range;
        sel = iframe.contentDocument.getSelection();
        range = sel.getRangeAt(0);
        start = range.startContainer;
        do {
            if (typeof start.tagName !== 'undefined') {
                if (tagName === start.tagName) {
                    return {'elem': start, 'selType': sel.type};
                }
            }
            start = start.parentNode;
        } while (start !== null && start.tagName !== 'BODY');
        return {'elem': '', 'selType': sel.type};
    }

    function watchEvent(e) {
        if (e) {
            if (e.type === 'mouseup' || e.type === 'keyup') {
                whereAmI();
                return;
            }
        }
    }
    function makeTableContextMenu() {
        var div = document.createElement('DIV');
        div.id = t + 'ctm';
        div.innerHTML = [
            '<span id="irow"><i class="fa fa-xs fa-bars"> </i> Insert Row</span><br>',
            '<span id="drow"><i style="color:red" class="fa  fa-trash"> </i> Delete row </span><br>',
            '<hr>',
            '<span id="icol"><i class="fa fa-bars fa-rotate-90"> </i> Insert Column</span><br>',
            '<span id="dcol"><i style="color:red" class="fa f fa-trash"> </i> Delete column</span>'
        ].join('');

        div.style.display = 'none';
        div.style.backgroundColor = '#eaeaea';
        div.style.fontSize = '0.8em';
        div.className = "contextctmC";

        iframe.contentDocument.body.appendChild(div);
    }
    function contextMenu(e) {
        var div, left, top, obj;
        e.stopPropagation();
        e.preventDefault();
        div = iframe.contentDocument.getElementById(t + 'ctm');
        div.style.display = '';
        div.style.position = 'absolute';
        div.style.top = '0px';
        div.style.left = '0px';

        //*********************
        //position context menu
        //********************/
        left = e.clientX;
        top = e.clientY;
        left = left + document.documentElement.scrollLeft;
        top = top + document.documentElement.scrollTop;

        ///******************
        // * render to get geometrie
        //******************/
        div.style.display = 'inline-block';
        div.style.position = 'absolute';
        div.style.left = left - 5 + 'px';
        div.style.top = top - 5 + 'px';
        div.style.padding = '10px';

        div.onmouseout = function () {
            context_timeout = setTimeout("document.getElementById('" + t + "nanoContent').contentDocument.getElementById('" + t + "ctm').style.display='none';", 200);
        };
        div.onmouseover = function () {
            clearTimeout(context_timeout);
        };
        div.focus();

        obj = div.querySelector('#irow');
        obj.onclick = insertRow.bind(e.srcElement);
        obj = div.querySelector('#drow');
        obj.onclick = deleteRow.bind(e.srcElement);
        obj = div.querySelector('#icol');
        obj.onclick = insertCols.bind(e.srcElement);
        obj = div.querySelector('#dcol');
        obj.onclick = deleteCols.bind(e.srcElement);
    }
    function closeContextMenu() {
        clearTimeout(context_timeout);
        iframe.contentDocument.getElementById(t + 'ctm').style.display = 'none';
    }
    function getCell(t) { // find enclosing TD starting at t
        if (t.tagName === 'TD') {
            return t;
        }
        do {
            t = t.parentNode;
        } while (t !== null && t.tagName !== 'TD')
        return t;
    }
    function insertRow() {
        var i, cell, ci, ri, cc, row;
        cell = getCell(this);
        if (cell === null) {
            return;
        }
        ci = cell.cellIndex;
        ri = cell.parentNode.rowIndex;
        cc = cell.parentNode.cells.length;
        row = cell.parentNode.parentNode.insertRow(ri);

        for (i = 0; i < cc; i++) {
            row.insertCell(0);
        }
        row.cells[0].innerHTML = '&nbsp;';
        closeContextMenu();
        return;

    }
    function deleteRow() {
        var cell, ci, ri, cc, row;
        cell = getCell(this);
        if (cell === null) {
            return;
        }
        ci = cell.cellIndex;
        ri = cell.parentNode.rowIndex;
        cc = cell.parentNode.cells.length;
        row = cell.parentNode.parentNode.deleteRow(ri);
        closeContextMenu();
        return;
    }

    function insertCols() {
        var cell = getCell(this), ci, ri, i, cii, tbody;
        ci = cell.cellIndex;
        ri = cell.parentNode.rowIndex;
        tbody = cell.parentNode.parentNode;
        for (i = ri; i >= 0; i--) {
            cii = findCi(ci, tbody.rows[i].cells);
            if (tbody.rows[i].cells[cii].colSpan === 1) {
                tbody.rows[i].insertCell(cii);
            } else {
                tbody.rows[i].cells[cii].colSpan++;
            }
        }
        for (i = ri + 1; i < tbody.rows.length; i++) {
            if (tbody.rows[i].cells[ci].colSpan === 1) {
                tbody.rows[i].insertCell(ci);
            } else {
                tbody.rows[i].cells[ci].colSpan++;
            }
        }
        closeContextMenu();
        return;
    }
    function deleteCols() {
        var cell = getCell(this), i, ci, ri, cii, tbody;
        ci = cell.cellIndex;
        ri = cell.parentNode.rowIndex;
        tbody = cell.parentNode.parentNode;
        for (i = ri; i >= 0; i--) {
            cii = findCi(ci, tbody.rows[i].cells);
            if (tbody.rows[i].cells[cii].colSpan === 1) {
                tbody.rows[i].deleteCell(cii);
            } else {
                tbody.rows[i].cells[cii].colSpan--;
            }
        }
        for (i = ri + 1; i < tbody.rows.length; i++) {
            if (tbody.rows[i].cells[ci].colSpan === 1) {
                tbody.rows[i].deleteCell(ci);
            } else {
                tbody.rows[i].cells[ci].colSpan--;
            }
        }
        closeContextMenu();
        return;
    }

    function findCi(ci, cells) {
        var prev = 0, i, n;
        n = cells.length;
        for (i = 0; i < n; i++) {
            if (prev + cells[i].colSpan - 1 >= ci) {
                return i;
            }
            prev += cells[i].colSpan;
        }

    }

    function uploadFiles(dropZoneId) {
        'use strict';
        var
                request = new XMLHttpRequest(),
                dropZone, div;
        // 
        //    add drop handlers
        //
        if (typeof dropZoneId === 'string') {
            dropZone = document.getElementById(dropZoneId);
        } else {
            dropZone = dropZoneId;
        }

        dropZone.ondrop = dropHandler;
        dropZone.ondragover = function (event) {
            event.preventDefault();
        };

        if (!theForm) { // GLOBAL
            //*
            //* Create  form to  upload files once 
            //
            div = document.createElement('DIV');
            div.innerHTML = ["<form name='upload' enctype='multipart/form-data' action='", cfg.imageUploadScript, "' method='POST'>",
                "<input type='hidden' name='MAX_FILE_SIZE' value='123456789'>",
                "<input type='hidden' name='path' value='", cfg.imageUploadPath, "'>",
                "<input name='uploadedFile' type='file'>", //<== here we place the droped file 
                "<input name='submit' value='Speichern'>",
                "</form>"].join('');
            document.body.appendChild(div);
            theForm = div.firstChild;
            theForm.style.display = 'none';
        }

        function dropHandler(ev) {
            var file, formData;
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
            if (ev.dataTransfer.items) {
                thisDropZone = this;
                // Use DataTransferItemList interface to access the file(s)
                [].some.call(ev.dataTransfer.items, function (item) {
                    // If dropped items aren't files, reject them
                    if (item.kind === 'file' && item.type.split('/')[0] === 'image') {
                        file = item.getAsFile();
                        formData = new FormData(theForm);
                        formData.append('uploadedFile', file, file.name);
                        // send file over
                        request.open("POST", theForm.action, true);
                        request.onreadystatechange = onChange;
                        request.send(formData);
                        return true;
                    }
                    return false;
                });
            }
        }
        function onChange() {
            var js;
            if (this.readyState !== 4 || this.status !== 200) {
                if (this.readyState === 4) {
                }
                return;
            }
            try {
                js = JSON.parse(this.responseText);
                thisDropZone.innerHTML = `<img style='width:${js.width}px''; src='${js.result}'>`;
            } catch (e) {
                return;
            }
        }
    }

    self = {// reveal these functions to the outside
        closeEditor: closeEditor,
        attacheEditor: attacheEditor,
        saveCallback: onSaveCallback,
        closeCallback: onCloseCallback,
        onchange: closeEditor
    };
    uidiv.aaaself = self;
    return self;
}