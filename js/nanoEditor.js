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
    var
            docx, d, t, iframe, uidiv, self, cfg, thisDropZone, savedInnerHTML, context_timeout,
            configMenu = [], innerHTML, storedSelections, currentLink = '',
            saveCallback, closeCallback, theForm;
    //*
    // * do we allready exist ?
    //
    uidiv = document.querySelector('.uidivuidiv');
    if (uidiv) {
        return uidiv.aaaself;
    }
    cfg = {'imageUploadPath': ''};
    if (typeof config !== 'undefined' && typeof config === 'object') {
        cfg = Object.assign({'imageUploadPath': '', 'askOnExit': true}, config);
    }
//*
//* create
//
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
        {'label': 'saveLink', 'event': 'click', 'action': saveLink}
    ];
    document.body.appendChild(uidiv);
    uidiv.classList.add('uidivuidiv');
    uidiv.style.border = '1px solid gray';
    uidiv.style.backgroundColor = 'rgb(249, 249, 249)';
    uidiv.style.display = 'inline-block';
    uidiv.style.width = 'auto';
    //uidiv.style.minWidth = '600px';
    uidiv.id = t + 'Div';
    uidiv.innerHTML = ["<table style='border-collapse:collapse'>",
        "<tr style='border-bottom:1px solid gray' id=", t, "saveselect><td>",
        "<button id=", t, "save><i class='fa fa-fw fa-save' title='save&close'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-bold ><i class='fa fa-fw fa-bold' title='Bold'></i></button>",
        "<button id=", t, "-italic><i class='fa fa-fw fa-italic'  title='Italics'></i></button>",
        "<button id=", t, "-underline><i class='fa fa-fw fa-underline' title='underline'></i></button><i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-insertUnorderedList><i class='fa fa-fw fa-list-ul' title='unordered list'></i></button>",
        "<button id=", t, "-insertOrderedList><i class='fa fa-fw fa-list-ol' title='unordered list'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-Justifyleft><i class='fa fa-fw fa-align-left' title='align left'></i></button>",
        "<button id=", t, "-Justifyright><i class='fa fa-fw fa-align-right' title='align right'></i></button>",
        "<button id=", t, "-Justifyfull><i class='fa fa-fw fa-align-justify' title='align full'></i></button>",
        "<button id=", t, "-Justifycenter><i class='fa fa-fw fa-align-center' title='align center'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-outdent><i class='fa fa-fw fa-outdent' title='outdent'></i></button>",
        "<button id=", t, "-indent><i class='fa fa-fw fa-indent' title='indent'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-print><i class='fa fa-fw fa-print' title='print'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
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
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button id=", t, "-undo ><i class='fa fa-fw fa-undo' title='undo'></i></button>",
        "<button id=", t, "Table ><i class='fa fa-fw fa-table' title='Table'></i></button>",
        "<button id=", t, "Image ><i class='fa fa-fw fa-image' title='Picture'></i></button>",
        "<button id=", t, "Link ><i class='fa fa-fw fa-link' title='Link'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button  style=''  id=", t, "close ><i style='color:red' class='fa fa-fw fa-times' title='close'></i></button>",
        "</td></tr>",
        "<tr><td id='enterLink' style='visibility:hidden;text-align:center'>",
        "<input type=text placeholder='enter URL' size=80 maxlegth=265>",
        "<button id=", t, "saveLink ><i class='fa fa-fw fa-save' title='save Link'></i></button>",
        "</td></tr>",
        "<tr><td><iframe style='min-height:800px;resize:vertical;width:100%' id =", t, "nanoContent src = '' ></iframe></td></tr> ",
        "<tr><td style='border-top:1px solid black' class='formatLine'>where am I ?</td></tr>",
        "</table>"
    ].join('');
    t = t.toString();
    configMenu.forEach(function (item) {
        document.getElementById(t + item.label).addEventListener(item.event, item.action, false);
    });
    iframe = document.getElementById(t + 'nanoContent');
    iframe.style.border = '0px';
    docx = iframe.contentDocument;
    docx.open();
    docx.write();
    docx.close();
    docx.body.contentEditable = true;
    uidiv.style.display = 'none';
    uidiv.onclick = stopBubble; // keep all (click-)events inside the editor 
    uidiv.onfocus = stopBubble;
    uidiv.onmouseover = stopBubble;
    uidiv.onmouseup = stopBubble;
    uidiv.keyup = stopBubble;

    function makeStyle() {
        var styleElem = iframe.contentDocument.createElement('STYLE');
        styleElem.innerHTML = [
            "table,  th, td{border-collapse:collapse;  border: 1px solid silver;}",
            "th, td{min-width:2em}"
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
            '<tr><td>111</td><td>222</td><td>33</td></tr>'
        ].join('');
        insertNodeAtSelection(t);
    }

    function enterEditLink() {
        var at = {}, el = uidiv.querySelector('#enterLink'), sel;
        if (el.style.visibility === 'visible') {
            el.style.visibility = 'hidden';
            currentLink = '';
            return;
        }
        el.firstChild.value = '';
        at = isElement('A');
        if (at.a) {
            el.firstChild.value = at.a.href;
            currentLink = at.a;
        } else if (at.selType === 'None') {
            return;
        }
        el.style.visibility = 'visible';
        el.firstChild.focus();
    }

    function saveLink() {
        var a, el = uidiv.querySelector('#enterLink');
        if (el.style.visibility === 'visible') {
            el.style.visibility = 'hidden';
        }
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

    function insertImageDropZone() {
        var sel;
        if (cfg.imageUploadPath === '') {
            return;
        }
        sel = iframe.contentDocument.getSelection();
        if (sel.type === 'None') {
            return;
        }
        var dz, node = document.createElement('span');
        node.innerHTML = "&nbsp;<i title='Drop picture here'>DROPZONE</i>&nbsp;";
        node.className = 'dropZone';
        insertNodeAtSelection(node);
        dz = iframe.contentDocument.querySelectorAll('.dropZone');
        dz.forEach((node) => {
            uploadFiles(node, '', '');
        });
    }

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
        if (cfg.imageUploadPath) {
            dz = docx.querySelectorAll('.dropZone');
            dz.forEach((node) => {
                uploadFiles(node, '', '');
            });
        }

        docx.body.onmouseup = watchEvent;
        docx.body.onkeyup = watchEvent;
        makeStyle();
        makeScript();
        makeTableContextMenu();
    }
    function attacheEditor() {

        closeEditor();
        savedInnerHTML = this.innerHTML;
        this.innerHTML = '';
        this.appendChild(uidiv);
        setContent(savedInnerHTML);
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

    function copyAllFormSelection(sel, newNode) {

        var nl = [];
        nl = sel.anchorNode.parentNode.childNodes;
        walkNodes(newNode, nl, sel);
        return;
    }
    function walkNodes(parent, nodeList, selorg) {
        var i, what, nli, n = nodeList.length, start, end, tmp, sel = {};
        what = selorg.anchorNode.compareDocumentPosition(selorg.focusNode);
        if (what === Node.DOCUMENT_POSITION_PRECEDING) { // left  to right selection

            selorg.anchorNode.parentNode.removeAttribute('thisIsTheStartNode');
            selorg.anchorNode.thisIsTheStartContainer = '';
            selorg.focusNode.parentNode.removeAttribute('thisIsTheEndNode');
            selorg.focusNode.thisIsTheEndContainer = '';
            sel.anchorNode = selorg.focusNode;
            sel.anchorOffset = selorg.focusOffset;
            sel.focusNode = selorg.anchorNode;
            sel.focusOffset = selorg.anchorOffset;
            sel.anchorNode.parentNode.thisIsTheStartNode = 'start';
            sel.anchorNode.thisIsTheStartContainer = 'start';
            sel.focusNode.parentNode.thisIsTheEndNode = 'end';
            sel.focusNode.thisIsTheEndContainer = 'end';
            nodeList = sel.anchorNode.parentNode.childNodes;
        } else {
            sel = selorg;
        }
        // find start conatiner
        for (i = 0; i < n; i++) {
            nli = nodeList[i];
            if (nli.thisIsTheStartContainer === 'start') {
                break;
            }
        }
        // copy all from start conatiner to end
        for (; i < n; i++) {
            nli = nodeList[i];
            if (nli.skipThisNode) {
                continue;
            }
            if (nli.nodeType === 3) {
                if (nli.thisIsTheStartContainer === 'start') {
                    nli.thisIsTheStartContainer = '';
                    if (nli.thisIsTheEndContainer === 'end') {
                        nli.thisIsTheEndContainer = '';
                        start = sel.anchorOffset;
                        end = sel.focusOffset;
                        if (start > end) {
                            tmp = start;
                            start = end;
                            end = tmp;
                        }
                        parent.appendChild(document.createTextNode(nli.data.substr(start, end - start)));
                        nli.data = nli.data.substr(0, start) + nli.data.substr(end);
                        break
                    }
                    parent.appendChild(document.createTextNode(nli.data.substr(sel.anchorOffset)));
                    nli.data = nli.data.substr(0, sel.anchorOffset);
                } else if (nli.thisIsTheEndContainer === 'end') {
                    nli.thisIsTheEndContainer = '';
                    parent.appendChild(document.createTextNode(nli.data.substr(0, sel.focusOffset)));
                    nli.data = nli.data.substr(sel.focusOffset, nli.data.length - sel.focusOffset);
                    break;
                } else {
                    parent.appendChild(nli);
                    i--;
                    n--;
                }
            } else {
                parent.appendChild(nli);
                i--;
                n--;
            }
        }
        return parent;
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
        if (sel.type !== 'Caret') {
            return {'a': '', 'selType': sel.type};
        }
        range = sel.getRangeAt(0);
        start = range.startContainer;
        do {
            if (typeof start.tagName !== 'undefined') {
                if (tagName === start.tagName) {
                    return {'a': start, 'selType': sel.type};
                }
            }
            start = start.parentNode;
        } while (start !== null && start.tagName !== 'BODY');
        return {'a': '', 'selType': sel.type};
    }
    function insertNodeAtSelection(insertNode) {

        var sel, range, startContainer, pos, textBefore, textAfter,
                afterNode, beforeNode, textNode, text;
        sel = iframe.contentDocument.getSelection();
        sel.anchorNode.parentNode.thisIsTheStartNode = 'start';
        sel.anchorNode.thisIsTheStartContainer = 'start';
        sel.focusNode.parentNode.thisIsTheEndNode = 'end';
        sel.focusNode.thisIsTheEndContainer = 'end';
        range = sel.getRangeAt(0);
        startContainer = range.startContainer;
        pos = range.startOffset;
        if (insertNode.tagName === 'A') {
            if (range.collapsed) {
                return;
            }
            if (!sel.anchorNode.parentNode.thisIsTheEndNode) {
                return;
            }
            insertNode.skipThisNode = true;
            storedSelections = sel.getRangeAt(0);
            copyAllFormSelection(sel, insertNode);
        }

        if (startContainer.nodeType === 3) {
            textNode = startContainer;
            startContainer = textNode.parentNode;
            text = textNode.nodeValue;
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
            startContainer.appendChild(insertNode);
        }

        return insertNode;
    }
    function watchEvent(e) {
        var pos = {};
        if (e) {
            pos = isElement('TABLE');
            if (pos.a) {
                pos.a.oncontextmenu = function (e) {
                    contextMenu(e);
                    return false;
                };
            }
            if (!e.altKey) {
                if (e.type === 'mouseup' || e.type === 'keyup') {
                    whereAmI();
                    return;
                }
            }
        }
    }
    function makeTableContextMenu() {
        var div = document.createElement('DIV');
        div.id = t + 'ctm';
        div.innerHTML = [
            '<span id="irow"><i class="fa fa-w fa-arrow-left"> </i> Insert Row</span><br>',
            '<span id="drow"><i style="color:red" class="fa fa-w fa-trash"> </i> Delete row </span><br>',
            '<hr>',
            '<span id="icol"><i class="fa fa-w fa-arrow-left"> </i> Insert Column</span><br>',
            '<span id="dcol"><i style="color:red" class="fa fa-w fa-trash"> </i> Delete column</span>'
        ].join('');

        div.style.display = 'none';
        div.style.backgroundColor = '#eaeaea';
        iframe.contentDocument.body.appendChild(div);
    }
    function contextMenu(e) {
        var div, left, top, obj;
        stopBubble();
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
    function insertRow() {
        var i, cell, ci, ri, cc, row;
        cell = this;
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
        closeContextMenu();
        return;

    }
    function deleteRow() {
        var cell, ci, ri, cc, row;
        cell = this;
        if (cell === null) {
            return;
        }
        console.log(cell);
        console.log(cell.parentNode);
        console.log(cell.parentNode.parentNode);
        ci = cell.cellIndex;
        ri = cell.parentNode.rowIndex;
        cc = cell.parentNode.cells.length;
        row = cell.parentNode.parentNode.deleteRow(ri);
        closeContextMenu();
        return;
    }

    function insertCols() {
        var cell = this, ci, ri, i, cii, tbody;
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
        var cell = this, i, ci, ri, cii, tbody;
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
    function findElementAtSelection(elem) {
        var node, sel;
        sel = iframe.contentDocument.getSelection();
        node = sel.anchorNode;
        while (node !== null && node.tagName !== elem) {
            node = node.parentNode;
        }
        return node;
    }
    function uploadFiles(dropZoneId, formId, dialogs) {
        'use strict';
        var
                request = new XMLHttpRequest(),
                dropZone, div,
                uploadedFiles;
        // 
        //    add drop handlers
        //
        theForm = document.getElementById(formId);
        if (typeof dropZoneId === 'string') {
            dropZone = document.getElementById(dropZoneId);
        } else {
            dropZone = dropZoneId;
        }

        dropZone.ondrop = dropHandler;
        dropZone.ondragover = function (event) {
            event.preventDefault();
        };
        //*
        //* find file type element
        //
        if (!theForm) {
            div = document.createElement('DIV');
            div.innerHTML = ["<form name='upload' enctype='multipart/form-data' action='../php/upload_save_2.php' method='POST'>",
                "<input type='hidden' name='MAX_FILE_SIZE' value='123456789'>",
                "<input type='hidden' name='path' value='", cfg.imageUploadPath, "'>",
                "<input name='uploadedfile' type='file'>",
                "<input name='submit' value='Speichern'>",
                "</form>"].join('');
            document.body.appendChild(div);
            theForm = div.firstChild;
            theForm.style.display = 'none';
        }

        [].some.call(theForm.elements, function (elem) {
            if (elem.type === 'file') {
                uploadedFiles = elem.name;
                return true;
            }
            return false;
        });
        function dropHandler(ev) {
            var file, formData, allow;
            // Prevent default behavior (Prevent file from being opened)
            ev.preventDefault();
            allow = false;
            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                [].some.call(ev.dataTransfer.items, function (item) {
                    // If dropped items aren't files, reject them
                    if (item.kind === 'file' && item.type.split('/')[0] === 'image') {
                        file = item.getAsFile();
                        formData = new FormData(theForm);
                        formData.append(uploadedFiles, file, file.name);
                        allow = true;
                        return true;
                    }
                    return false;
                });
            }
            if (!allow) {
                return;
            }
            thisDropZone = this;
            request.open("POST", theForm.action, true);
            request.onreadystatechange = onChange;
            request.send(formData);
        }
        function onChange() {
            var js;
            if (this.readyState !== 4 || this.status !== 200) {
                if (this.readyState === 4) {
                }
                if (dialogs) {
                    dialogs.infoDialog('Uploaded; Status: ' + this.readyState + '/' + this.status, [{label: 'ok', action: {}}]);
                }
                return;
            }
            try {
                js = JSON.parse(this.responseText);
                if (dialogs) {
                    dialogs.infoDialog(js.result, [{label: 'ok', action: {}}]);
                }
                thisDropZone.innerHTML = "<img style='width:" + js.width + "px;height:" + js.height + "px' src='" + js.result + "'>";
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