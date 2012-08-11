# evol.colorpicker

This project is a web color picker which look like the one in Microsoft Office 2010. It can be used inline or as a popup binded to a text box.
It is a full jQuery UI widget, supporting various configurations and themes.

![screenshot 1](https://raw.github.com/evoluteur/colorpicker/master/screenshot1.png) ![screenshot 2](https://raw.github.com/evoluteur/colorpicker/master/screenshot2.png)


## Usage

First, load [jQuery](http://jquery.com/) (v1.7 or greater), [jQuery UI](http://jqueryui.com/) (v1.8 or greater), and the plugin:

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/evol.colorpicker.js" type="text/javascript" charset="utf-8"></script>

The widget requires a jQuery UI theme to be present, as well as its own included base CSS file ([evol.colorpicker.css](http://github.com/evoluteur/colorpicker/raw/master/css/evol.colorpicker.css)). Here we use the "ui-lightness" theme as an example:

    <link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/themes/ui-lightness/jquery-ui.css">
    <link href="css/evol.colorpicker.css" rel="stylesheet" type="text/css">

Now, let's attach it to an existing `<input>` tag:

    <script type="text/javascript">
        $(document).ready(function() {
            $("#mycolor").colorpicker();
        });
    </script>

    <input style="width:100px;" id="mycolor" />

This will wrap it into a "holder" `<div>` and add another `<div>` beside it for the color box:

	<div style="width:128px;">
	   <input style="width:100px;" id="mycolor" class="colorPicker evo-cp0" />
	   <div class="evo-colorind" style="background-color:#8db3e2"></div>
	</div>

Using the same syntax, the widget can also be instanciated on a `<div>` or a `<span>` tag to show inline. In that case the generated HTML is the full palette.


## License

Copyright (c) 2012 Olivier Giulieri.

evol.colorpicker is released under the [MIT license](http://github.com/evoluteur/colorpicker/raw/master/LICENSE.md).

