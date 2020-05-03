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
                    obj.ondblclick = nanoEdit.attacheEditor;
                });
            }

            window.addEventListener('load', initEditDemo, false);
        </script>
    </head>
    <body>

        <div id="divdiv" class='editMe' style="display:inline-block">
           
            <h1>double click here to start the editor</h1>

            <H2> Image upload is not <i>configured</i> in this demo </h2> 

            <h2>Sources are located at <a href="https://github.com/napengam/nanoEditor" target='nanoEditor'>https://github.com/napengam/nanoEditor</a> </h2>

            <p style="max-width:600px">
                <b>Basic table handling</b><br>

                Right click into a table cell and you get a context menu to add or remove rows and columns.
                Inserting columns will work only in cells of type &lt;TD> with a colspan of maximum 1.
            </p>

            <table>
                <tr><th>th1</th><th colspan="2">th2</th><th>th3</th></tr>
                <tr><td>eins</td><td> 2a </td><td> 2b </td><td> III </td></tr>
            </table>

        </div>

    </body>
</html>


