<!DOCTYPE html>
<html>
    <head>
        <title>nanoEditor</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="https://use.fontawesome.com/ed46cb3bd2.js"></script>

        <script src="../js/nanoEditor.js"></script>
        <script>

            function initEditDemo() {
                var objects, nanoEdit = createEditor({'imageUploadPath': '../upload/'});
                objects = document.body.querySelectorAll('.editMe');
                [].forEach.call(objects, function (obj) {
                    obj.onclick = nanoEdit.attacheEditor;
                });
            }

            window.addEventListener('load', initEditDemo, false);
        </script>
    </head>
    <body>

        <p>Just click in a cell and the editor will open <br>
            Everything you need is within the source of this page <p>                          
        <table border='1' id='editTable'>
            <tr><th>------------Head1----------------</th><th >------------------Head2----------------------</th></tr>
            <tr><td class='editMe'><h1>ffffffffffffff</h1></td><td class='editMe'>bbbbbbbbbb</td></tr>
            <tr><td class='editMe'>ffffffffffffff</td><td class='editMe'>bbbbbbbbbb</td></tr>
            <tr><th>On sale today</th><th > Dear Diary </th></tr>
            <tr><td class='editMe'>ffffffffffffff</td><td class='editMe'>bbbbbbbbbb</td></tr>
        </table><p>
        <div id="divdiv" class='editMe' style="display:inline-block">click <b>me</b> here </div>

    </body>
</html>


