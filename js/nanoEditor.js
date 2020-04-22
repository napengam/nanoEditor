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
function createEditor() {
    'use strict';

    var
            docx, d, t, iframe, uidiv, self, cfg, thisDropZone,
            configMenu = [], innerHTML, storedSelections,
            saveCallback, closeCallback;

    //*
    // * do we allready exist ?
    //
    uidiv = document.querySelector('.uidivuidiv');
    if (uidiv) {
        return uidiv.aaaself;
    }
    //*
    //* create
    //
    d = new Date();
    t = d.getTime();// used to make ids  somehow 'unique' 
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
        {'label': 'save', 'event': 'click', 'action': saveContent},
        {'label': 'Color', 'event': 'change', 'action': foreColor},
        {'label': 'close', 'event': 'click', 'action': closeEditor},
        {'label': 'Size', 'event': 'change', 'action': fontSize},
        {'label': 'Font', 'event': 'change', 'action': fontName},
        {'label': 'Image', 'event': 'click', 'action': insertImageDropZone}
    ];

    document.body.appendChild(uidiv);
    uidiv.classList.add('uidivuidiv');
    uidiv.style.border = '1px solid gray';
    uidiv.style.background = 'white';
    uidiv.style.display = 'inline-block';
    uidiv.style.width = 'auto';
    //uidiv.style.minWidth = '600px';
    uidiv.id = t + 'Div';
    uidiv.innerHTML = ["<table style='border-collapse:collapse'> <tr style='border-bottom:1px solid gray' id=", t, "saveselect><td>",
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
        "<button id=", t, "Image ><i class='fa fa-fw fa-image' title='Picture'></i></button>",
        "<i class='fa fa-fw fa-square-full'></i>",
        "<button  style=''  id=", t, "close ><i style='color:red' class='fa fa-fw fa-times' title='close'></i></button>",
        "</td></tr>",
        "<tr><td><iframe style='width:100%' id =", t, "nanoContent src = '' ></iframe></td></tr> ",
        "</table>"].join('');


    t = t.toString();

    configMenu.forEach(function (item) {
        document.getElementById(t + item.label).addEventListener(item.event, item.action, false);
    });

    iframe = document.getElementById(t + 'nanoContent');
    iframe.style.border = '0px';

    docx = iframe.contentDocument;
    docx.open();
    docx.write('');
    docx.close();
    docx.body.contentEditable = true;
    docx.contentEditable = true;

    uidiv.style.display = 'none';
    uidiv.onclick = stopBubble; // keep all (click-)events inside the editor 
    uidiv.onfocus = stopBubble;
    uidiv.onmouseover = stopBubble;

    function insertImageDropZone() {
        var dz, node = document.createElement('span');
        node.innerHTML = "&nbsp;<i style='border 1px blue'>DROPZONEIMAGE</i>&nbsp;";
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
        stopBubble(e);
        restoreSelection();
        iframe.contentDocument.execCommand(this.id.split('-')[1], false, null);
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
            node.innerHTML = innerHTML;
        }
        if (typeof closeCallback === 'function') {
            closeCallback();
        }
    }
    function setContent(content) {
        var dz, docx = iframe.contentDocument;
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
        dz = docx.querySelectorAll('.dropZone');
        dz.forEach((node) => {
            uploadFiles(node, '', '');
        });


    }
    function attacheEditor(config) {
        var val;
        closeEditor();
        val = this.innerHTML;
        innerHTML = val;
        this.innerHTML = '';
        this.appendChild(uidiv);
        if (typeof config !== 'undefined') {
            cfg = config;
        }
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
    function insertNodeAtSelection(insertNode) {

        var doc, sel, range, container, pos, textBefore, textAfter,
                afterNode, beforeNode, textNode, text;

        // get editor document
        if (iframe.contentDocument.body.innerText === '') {
            iframe.contentDocument.body.innerHTML = '&nbsp;';
        }
        doc = iframe.contentDocument;
        // get current selection
        sel = iframe.contentDocument.getSelection();

        // get the first range of the selection
        // (there's almost always only one range)
        range = sel.getRangeAt(0);

        // deselect everything
        sel.removeAllRanges();

        // remove content of current selection from document
        range.deleteContents();

        // get location of current selection
        container = range.startContainer;
        pos = range.startOffset;

        // make a new range for the new selection
        range = doc.createRange();

        if (container.nodeType === 3 && insertNode.nodeType === 3) {
            // if we insert text in a textnode, do optimized insertion
            container.insertData(pos, insertNode.data);
            // put cursor after inserted text
            range.setEnd(container, pos + insertNode.length);
            range.setStart(container, pos + insertNode.length);
        } else {


            if (container.nodeType === 3) {
                // when inserting into a textnode
                // we create 2 new textnodes
                // and put the insertNode in between
                textNode = container;
                container = textNode.parentNode;
                text = textNode.nodeValue;

                // text before the split
                textBefore = text.substr(0, pos);
                // text after the split
                textAfter = text.substr(pos);

                beforeNode = document.createTextNode(textBefore);
                afterNode = document.createTextNode(textAfter);

                // insert the 3 new nodes before the old one
                container.insertBefore(afterNode, textNode);
                container.insertBefore(insertNode, afterNode);
                container.insertBefore(beforeNode, insertNode);

                // remove the old node
                container.removeChild(textNode);
            } else {
                // else simply insert the node
                afterNode = container.childNodes[pos];
                //container.insertBefore(insertNode, afterNode);
                container.appendChild(insertNode);
                return insertNode;
            }

            try {
                range.setEnd(afterNode, 0);
                range.setStart(afterNode, 0);
            } catch (e) {
                // alert(e);
            }
        }

        //sel.addRange(range);
        return insertNode;
    }
    function uploadFiles(dropZoneId, formId, dialogs) {
        'use strict';
        var
                request = new XMLHttpRequest(),
                theForm = document.getElementById(formId),
                dropZone, div,
                uploadedFiles;
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
        //*
        //* find file type element
        //
        if (!theForm) {
            div = document.createElement('DIV');
            div.innerHTML = ["<form name='upload' enctype='multipart/form-data' action='../allMyScripts/php/upload_save_2.php' method='POST'>",
                "<input type='hidden' name='MAX_FILE_SIZE' value='123456789'>",
                "<input type='hidden' name='id' value='" + cfg.id + "'>",
                "<input type='hidden' name='table' value='" + cfg.dbtable + "'>",
                "<input type='hidden' name='field' value='" + cfg.name + "'>",
                "<input type='hidden' name='path' value='" + cfg.path + "'>",
                "<input type='hidden' name='root' value='" + '' + "'>",
                "<input name='uploadedfile' type='file'>",
                "<input name='submit' value='Speichern'>",
                "</form>"].join('');
            document.body.appendChild(div);
            theForm = div.firstChild;
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
                thisDropZone.innerHTML = "<span  class='dropZone'> <img style='width:" + js.width + "px;height:" + js.height + "px' src='" + js.result + "'></span>";
            } catch (e) {
                return;
            }
        }

        function removeDragData(ev) {

            if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to remove the drag data
                ev.dataTransfer.items.clear();
            } else {
                // Use DataTransfer interface to remove the drag data
                ev.dataTransfer.clearData();
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