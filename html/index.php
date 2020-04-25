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

        <div id="divdiv" class='editMe' style="display:inline-block">
            <H1> Image upload is not configured in this demo </h1> 
            
            <h2>Sources are located at <a href="https://github.com/napengam/nanoEditor" target='nanoEditor'>https://github.com/napengam/nanoEditor</a> </h2>
            <p>
                <b>click me</b>
            </p>
        </div>

    </body>
</html>


